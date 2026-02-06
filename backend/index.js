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

  // Always ensure jobs table exists (even for existing DBs)
  db.run(
    `CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      company_id TEXT,
      company_name TEXT DEFAULT '',
      title TEXT,
      description TEXT DEFAULT '',
      area TEXT,
      type TEXT,
      location TEXT DEFAULT '',
      salary TEXT DEFAULT '',
      requirements TEXT DEFAULT '[]',
      active INTEGER DEFAULT 1,
      applicants INTEGER DEFAULT 0,
      created_at TEXT
    )`
  );

  // Always ensure applications table exists
  db.run(
    `CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      job_id TEXT,
      candidate_id TEXT,
      candidate_data TEXT DEFAULT '{}',
      status TEXT DEFAULT 'pending',
      created_at TEXT
    )`
  );
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
      const appName = process.env.APP_NAME || 'Nossa Plataforma';
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
            subject: `Redefinição de senha - ${appName}`,
            text: `Olá, você ou alguém solicitou a redefinição de senha para sua conta em ${appName}. Acesse o link para definir uma nova senha: ${resetUrl}`,
            html: `
              <div style="font-family: Arial, sans-serif; color: #111;">
                <h2 style="color:#0B5FFF">${appName}</h2>
                <p>Olá,</p>
                <p>Recebemos uma solicitação para redefinir a senha da sua conta em <strong>${appName}</strong>.</p>
                <p>Clique no botão abaixo para definir uma nova senha. O link expira em 1 hora.</p>
                <p style="text-align:center; margin: 24px 0;"><a href="${resetUrl}" style="background:#0B5FFF;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Redefinir minha senha</a></p>
                <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
                <p>Atenciosamente,<br/>Equipe ${appName}</p>
              </div>
            `,
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

// ==================== VAGAS (JOBS) ====================

// Criar nova vaga
app.post('/api/jobs', (req, res) => {
  const { companyId, companyName, title, description, area, type, location, salary, requirements } = req.body;
  if (!companyId || !title || !area || !type) {
    return res.status(400).json({ error: 'Campos obrigatórios: companyId, title, area, type' });
  }

  const id = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const createdAt = new Date().toISOString();
  const reqsJson = JSON.stringify(requirements || []);

  const stmt = db.prepare(
    `INSERT INTO jobs (id, company_id, company_name, title, description, area, type, location, salary, requirements, active, applicants, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?)`
  );
  stmt.run(id, companyId, companyName || '', title, description || '', area, type, location || '', salary || '', reqsJson, createdAt, function (err) {
    if (err) {
      console.error('DB insert job error', err);
      return res.status(500).json({ error: 'Erro ao criar vaga' });
    }
    const job = {
      id, companyId, companyName: companyName || '', title,
      description: description || '', area, type,
      location: location || '', salary: salary || '',
      requirements: requirements || [], active: true, applicants: 0, createdAt,
    };
    res.json({ success: true, job });
  });
  stmt.finalize();
});

// Listar todas as vagas ativas (para estudantes/admin)
app.get('/api/jobs', (req, res) => {
  db.all('SELECT * FROM jobs WHERE active = 1 ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('DB get all jobs error', err);
      return res.status(500).json({ error: 'Erro ao buscar vagas' });
    }
    const jobs = (rows || []).map(r => ({
      id: r.id,
      companyId: r.company_id,
      companyName: r.company_name,
      company: r.company_name,
      title: r.title,
      description: r.description,
      area: r.area,
      type: r.type,
      location: r.location,
      salary: r.salary,
      requirements: JSON.parse(r.requirements || '[]'),
      active: !!r.active,
      applicants: r.applicants || 0,
      createdAt: r.created_at,
    }));
    res.json({ jobs });
  });
});

// Listar vagas de uma empresa
app.get('/api/jobs/company/:companyId', (req, res) => {
  const { companyId } = req.params;
  db.all('SELECT * FROM jobs WHERE company_id = ? ORDER BY created_at DESC', [companyId], (err, rows) => {
    if (err) {
      console.error('DB get company jobs error', err);
      return res.status(500).json({ error: 'Erro ao buscar vagas da empresa' });
    }
    const jobs = (rows || []).map(r => ({
      id: r.id,
      companyId: r.company_id,
      companyName: r.company_name,
      company: r.company_name,
      title: r.title,
      description: r.description,
      area: r.area,
      type: r.type,
      location: r.location,
      salary: r.salary,
      requirements: JSON.parse(r.requirements || '[]'),
      active: !!r.active,
      applicants: r.applicants || 0,
      createdAt: r.created_at,
    }));
    res.json({ jobs });
  });
});

// Atualizar vaga
app.put('/api/jobs/:jobId', (req, res) => {
  const { jobId } = req.params;
  const { title, description, area, type, location, salary, requirements, active, applicants } = req.body;

  db.get('SELECT * FROM jobs WHERE id = ?', [jobId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Erro interno' });
    if (!row) return res.status(404).json({ error: 'Vaga não encontrada' });

    const stmt = db.prepare(
      `UPDATE jobs SET title=?, description=?, area=?, type=?, location=?, salary=?, requirements=?, active=?, applicants=? WHERE id=?`
    );
    stmt.run(
      title ?? row.title,
      description ?? row.description,
      area ?? row.area,
      type ?? row.type,
      location ?? row.location,
      salary ?? row.salary,
      JSON.stringify(requirements ?? JSON.parse(row.requirements || '[]')),
      (active !== undefined ? (active ? 1 : 0) : row.active),
      applicants ?? row.applicants,
      jobId,
      function (uErr) {
        if (uErr) {
          console.error('DB update job error', uErr);
          return res.status(500).json({ error: 'Erro ao atualizar vaga' });
        }
        const updatedJob = {
          id: jobId,
          companyId: row.company_id,
          companyName: row.company_name,
          title: title ?? row.title,
          description: description ?? row.description,
          area: area ?? row.area,
          type: type ?? row.type,
          location: location ?? row.location,
          salary: salary ?? row.salary,
          requirements: requirements ?? JSON.parse(row.requirements || '[]'),
          active: active !== undefined ? active : !!row.active,
          applicants: applicants ?? row.applicants,
          createdAt: row.created_at,
        };
        res.json({ success: true, job: updatedJob });
      }
    );
    stmt.finalize();
  });
});

// Deletar vaga
app.delete('/api/jobs/:jobId', (req, res) => {
  const { jobId } = req.params;
  db.run('DELETE FROM jobs WHERE id = ?', [jobId], function (err) {
    if (err) {
      console.error('DB delete job error', err);
      return res.status(500).json({ error: 'Erro ao deletar vaga' });
    }
    res.json({ success: true });
  });
});

// ==================== CANDIDATURAS (APPLICATIONS) ====================

// Candidatar-se a uma vaga
app.post('/api/applications', (req, res) => {
  const { jobId, candidateId, candidateData } = req.body;
  if (!jobId || !candidateId) {
    return res.status(400).json({ error: 'jobId e candidateId obrigatórios' });
  }

  const id = `app_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const createdAt = new Date().toISOString();

  const stmt = db.prepare(
    'INSERT INTO applications (id, job_id, candidate_id, candidate_data, status, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  );
  stmt.run(id, jobId, candidateId, JSON.stringify(candidateData || {}), 'pending', createdAt, function (err) {
    if (err) {
      console.error('DB insert application error', err);
      return res.status(500).json({ error: 'Erro ao candidatar-se' });
    }
    // Increment applicants count on the job
    db.run('UPDATE jobs SET applicants = applicants + 1 WHERE id = ?', [jobId]);
    res.json({ success: true, application: { id, jobId, candidateId, candidateData, status: 'pending', createdAt } });
  });
  stmt.finalize();
});

// Listar candidaturas de uma empresa (por vagas da empresa)
app.get('/api/applications/company/:companyId', (req, res) => {
  const { companyId } = req.params;
  db.all(
    `SELECT a.*, j.title as job_title FROM applications a
     JOIN jobs j ON a.job_id = j.id
     WHERE j.company_id = ?
     ORDER BY a.created_at DESC`,
    [companyId],
    (err, rows) => {
      if (err) {
        console.error('DB get applications error', err);
        return res.status(500).json({ error: 'Erro ao buscar candidaturas' });
      }
      const applications = (rows || []).map(r => ({
        id: r.id,
        jobId: r.job_id,
        jobTitle: r.job_title,
        candidateId: r.candidate_id,
        candidateData: JSON.parse(r.candidate_data || '{}'),
        status: r.status,
        createdAt: r.created_at,
      }));
      res.json({ applications });
    }
  );
});

// Atualizar status da candidatura
app.put('/api/applications/:applicationId', (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'status obrigatório' });

  db.run('UPDATE applications SET status = ? WHERE id = ?', [status, applicationId], function (err) {
    if (err) {
      console.error('DB update application error', err);
      return res.status(500).json({ error: 'Erro ao atualizar candidatura' });
    }
    res.json({ success: true });
  });
});

// Deletar candidatura
app.delete('/api/applications/:applicationId', (req, res) => {
  const { applicationId } = req.params;
  db.run('DELETE FROM applications WHERE id = ?', [applicationId], function (err) {
    if (err) {
      console.error('DB delete application error', err);
      return res.status(500).json({ error: 'Erro ao deletar candidatura' });
    }
    res.json({ success: true });
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Auth server listening on', port));
