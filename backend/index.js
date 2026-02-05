const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
let nodemailer;

const DB_PATH = path.join(__dirname, 'data.sqlite');

// Ensure DB file exists
const dbExists = fs.existsSync(DB_PATH);
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  if (!dbExists) {
    db.run(
      `CREATE TABLE users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        data TEXT
      )`
    );
    db.run(
      `CREATE TABLE password_resets (
        token TEXT PRIMARY KEY,
        user_id TEXT,
        expires_at INTEGER
      )`
    );
    console.log('Database initialized at', DB_PATH);
  }
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/register', async (req, res) => {
  try {
    const { id, name, email, password, ...rest } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const hashed = await bcrypt.hash(password, 10);
    const userId = id || Date.now().toString();
    const data = JSON.stringify(rest || {});

    const stmt = db.prepare('INSERT INTO users (id, name, email, password, data) VALUES (?, ?, ?, ?, ?)');
    stmt.run(userId, name || '', email, hashed, data, function (err) {
      if (err) {
        console.error('DB insert error', err);
        return res.status(500).json({ error: 'could not create user' });
      }
      const user = { id: userId, name: name || '', email, ...rest };
      res.json({ user });
    });
    stmt.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  db.get('SELECT id, name, email, password, data FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error('DB get error', err);
      return res.status(500).json({ error: 'internal' });
    }
    if (!row) return res.status(401).json({ error: 'invalid credentials' });

    const ok = bcrypt.compareSync(password, row.password);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    let rest = {};
    try { rest = JSON.parse(row.data || '{}'); } catch {}
    const user = { id: row.id, name: row.name, email: row.email, ...rest };
    res.json({ user });
  });
});

// Password reset request
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });

  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error('DB get error', err);
      return res.status(500).json({ error: 'internal' });
    }

    // Always respond 200 to avoid revealing whether email exists
    if (!row) {
      console.log('Password reset requested for non-existing email:', email);
      return res.json({ ok: true });
    }

    const userId = row.id;
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour

    const stmt = db.prepare('INSERT OR REPLACE INTO password_resets (token, user_id, expires_at) VALUES (?, ?, ?)');
    stmt.run(token, userId, expiresAt, function (e) {
      if (e) {
        console.error('DB insert token error', e);
        return res.status(500).json({ error: 'internal' });
      }

      const frontendHost = process.env.FRONTEND_URL || 'http://localhost:5173';
      const resetUrl = `${frontendHost}/reset-password?token=${token}`;

      // Try to send email if SMTP ENV provided
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          if (!nodemailer) nodemailer = require('nodemailer');
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          const mail = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject: 'Redefinição de senha',
            text: `Para redefinir sua senha, acesse: ${resetUrl}`,
            html: `<p>Para redefinir sua senha, clique no link abaixo:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Se você não solicitou, ignore este e-mail.</p>`,
          };

          transporter.sendMail(mail, (mailErr, info) => {
            if (mailErr) {
              console.error('Error sending reset email', mailErr);
            } else {
              console.log('Sent password reset email to', email, info && info.response);
            }
          });
        } catch (sendErr) {
          console.error('nodemailer error', sendErr);
        }
      } else {
        // No SMTP configured — log the reset URL so developer can use it
        console.log('Password reset URL (no SMTP configured):', resetUrl);
      }

      res.json({ ok: true });
    });
    stmt.finalize();
  });
});

// Password reset (set new password)
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'token and password required' });

  db.get('SELECT user_id, expires_at FROM password_resets WHERE token = ?', [token], async (err, row) => {
    if (err) {
      console.error('DB get token error', err);
      return res.status(500).json({ error: 'internal' });
    }
    if (!row) return res.status(400).json({ error: 'invalid token' });
    if (Date.now() > row.expires_at) return res.status(400).json({ error: 'token expired' });

    const hashed = await bcrypt.hash(password, 10);
    const stmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
    stmt.run(hashed, row.user_id, function (uErr) {
      if (uErr) {
        console.error('DB update password error', uErr);
        return res.status(500).json({ error: 'internal' });
      }

      // delete token
      db.run('DELETE FROM password_resets WHERE token = ?', [token], (dErr) => {
        if (dErr) console.error('DB delete token error', dErr);
      });

      res.json({ ok: true });
    });
    stmt.finalize();
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Auth server listening on', port));
