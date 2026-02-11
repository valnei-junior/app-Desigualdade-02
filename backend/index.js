const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const speakeasy = require('speakeasy');
let nodemailer;

const DB_PATH = path.join(__dirname, 'data.sqlite');

// Criar diretório de uploads se não existir
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

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
      deadline TEXT DEFAULT '',
      requirements TEXT DEFAULT '[]',
      active INTEGER DEFAULT 1,
      applicants INTEGER DEFAULT 0,
      created_at TEXT
    )`
  );

  db.all('PRAGMA table_info(jobs)', (err, columns) => {
    if (err) return;
    const hasDeadline = (columns || []).some((col) => col.name === 'deadline');
    if (!hasDeadline) {
      db.run("ALTER TABLE jobs ADD COLUMN deadline TEXT DEFAULT ''");
    }
  });

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

  db.run(
    `CREATE TABLE IF NOT EXISTS user_security (
      user_id TEXT PRIMARY KEY,
      email_verified INTEGER DEFAULT 0,
      totp_secret TEXT,
      totp_enabled INTEGER DEFAULT 0,
      require_2fa INTEGER DEFAULT 0,
      lgpd_consent_at TEXT
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS email_verifications (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      code TEXT,
      expires_at INTEGER
    )`
  );

  db.run('ALTER TABLE user_security ADD COLUMN require_2fa INTEGER DEFAULT 0', () => {});
});

const ensureUserSecurity = (userId, callback) => {
  db.get('SELECT * FROM user_security WHERE user_id = ?', [userId], (err, row) => {
    if (err) return callback(err);
    if (row) return callback(null, row);
    db.run(
      'INSERT INTO user_security (user_id, email_verified, totp_enabled, require_2fa) VALUES (?, ?, ?, ?) ',
      [userId, 1, 0, 0],
      function (insErr) {
        if (insErr) return callback(insErr);
        db.get('SELECT * FROM user_security WHERE user_id = ?', [userId], callback);
      }
    );
  });
};

const base64urlEncode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const signJwt = (claims, opts = {}) => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    iat: now,
    exp: now + (opts.expiresIn || 60 * 60),
    ...claims,
  };
  const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
  const signingInput = `${base64urlEncode(header)}.${base64urlEncode(payload)}`;
  const signature = crypto.createHmac('sha256', secret).update(signingInput).digest('base64url');
  return `${signingInput}.${signature}`;
};

const sendEmail = async ({ to, subject, html }) => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    if (!nodemailer) nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    await transporter.sendMail({ from, to, subject, html });
    return true;
  }
  console.log('[Email mock] To:', to, 'Subject:', subject, 'HTML:', html);
  return false;
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/register', async (req, res) => {
  try {
    const { id, name, email, password, acceptTerms, acceptSecurity, acceptLgpd, ...rest } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    if (!acceptTerms || !acceptSecurity || !acceptLgpd) {
      return res.status(400).json({ error: 'consent_required' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const userId = id || Date.now().toString();
    const consentAt = new Date().toISOString();
    const data = JSON.stringify({
      ...rest,
      termsAcceptedAt: consentAt,
      securityAcceptedAt: consentAt,
    });

    const stmt = db.prepare('INSERT INTO users (id, name, email, password, data) VALUES (?, ?, ?, ?, ?)');
    stmt.run(userId, name || '', email, hashed, data, function (err) {
      if (err) {
        console.error('DB insert error', err);
        return res.status(500).json({ error: 'could not create user' });
      }
      db.run(
        'INSERT OR REPLACE INTO user_security (user_id, email_verified, totp_secret, totp_enabled, require_2fa, lgpd_consent_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, 0, null, 0, 1, consentAt],
        function (secErr) {
          if (secErr) console.error('DB insert user_security error', secErr);
          const user = { id: userId, name: name || '', email, ...rest, emailVerified: false, totpEnabled: false };

          const code = String(Math.floor(100000 + Math.random() * 900000));
          const expiresAt = Date.now() + 10 * 60 * 1000;
          const verificationId = `verify_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          const stmtVerify = db.prepare(
            'INSERT OR REPLACE INTO email_verifications (id, user_id, code, expires_at) VALUES (?, ?, ?, ?)'
          );
          stmtVerify.run(verificationId, userId, code, expiresAt, async (verErr) => {
            if (verErr) {
              console.error('DB insert email verification error', verErr);
              return res.json({
                user,
                requiresEmailVerification: true,
                requiresTwoFactor: true,
                verificationSent: false,
              });
            }
            const appName = process.env.APP_NAME || 'CarreiraHub';
            const html = `<p>Seu código de verificação é <strong>${code}</strong>. Ele expira em 10 minutos.</p>`;
            const sent = await sendEmail({ to: email, subject: `${appName} - Verificação de e-mail`, html });
            res.json({
              user,
              requiresEmailVerification: true,
              requiresTwoFactor: true,
              verificationSent: sent,
            });
          });
          stmtVerify.finalize();
        }
      );
    });
    stmt.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password, otp } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  db.get('SELECT id, name, email, password, data FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error('DB get error', err);
      return res.status(500).json({ error: 'internal' });
    }
    if (!row) return res.status(401).json({ error: 'invalid credentials' });

    const ok = bcrypt.compareSync(password, row.password);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    ensureUserSecurity(row.id, (secErr, security) => {
      if (secErr) {
        console.error('DB user_security error', secErr);
        return res.status(500).json({ error: 'internal' });
      }

      const emailVerified = !!security?.email_verified;
      if (!emailVerified) {
        return res.status(403).json({ error: 'email_not_verified' });
      }

      const totpEnabled = !!security?.totp_enabled;
      const require2fa = !!security?.require_2fa;
      if (require2fa && !totpEnabled) {
        return res.status(403).json({ error: '2fa_setup_required' });
      }
      if (totpEnabled) {
        if (!otp) return res.status(401).json({ error: '2fa_required' });
        const okOtp = speakeasy.totp.verify({
          secret: security.totp_secret,
          encoding: 'base32',
          token: String(otp),
          window: 1,
        });
        if (!okOtp) return res.status(401).json({ error: 'invalid_otp' });
      }

      let rest = {};
      try { rest = JSON.parse(row.data || '{}'); } catch {}
      const user = {
        id: row.id,
        name: row.name,
        email: row.email,
        emailVerified,
        totpEnabled,
        require2fa,
        ...rest,
      };
      const token = signJwt({
        sub: row.id,
        email: row.email,
        role: rest.role,
        emailVerified,
        totpEnabled,
      });
      res.json({ user, token });
    });
  });
});

app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  db.get('SELECT id, name, email, data FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      console.error('DB get user error', err);
      return res.status(500).json({ error: 'internal' });
    }
    if (!row) return res.status(404).json({ error: 'user_not_found' });
    let rest = {};
    try { rest = JSON.parse(row.data || '{}'); } catch {}
    ensureUserSecurity(row.id, (secErr, security) => {
      if (secErr) {
        console.error('DB user_security error', secErr);
        return res.status(500).json({ error: 'internal' });
      }
      res.json({
        user: {
          id: row.id,
          name: row.name,
          email: row.email,
          emailVerified: !!security?.email_verified,
          totpEnabled: !!security?.totp_enabled,
          require2fa: !!security?.require_2fa,
          lgpdConsentAt: security?.lgpd_consent_at || null,
          ...rest,
        }
      });
    });
  });
});

app.put('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const { name, email, password, lgpdConsent, ...rest } = req.body || {};

  db.get('SELECT id, name, email, password, data FROM users WHERE id = ?', [userId], async (err, row) => {
    if (err) {
      console.error('DB get user error', err);
      return res.status(500).json({ error: 'internal' });
    }
    if (!row) return res.status(404).json({ error: 'user_not_found' });

    let currentData = {};
    try { currentData = JSON.parse(row.data || '{}'); } catch {}
    const nextData = { ...currentData, ...rest };
    const nextName = name ?? row.name;
    const nextEmail = email ?? row.email;
    const nextPassword = password ? await bcrypt.hash(password, 10) : row.password;

    const stmt = db.prepare('UPDATE users SET name = ?, email = ?, password = ?, data = ? WHERE id = ?');
    stmt.run(nextName, nextEmail, nextPassword, JSON.stringify(nextData), userId, function (uErr) {
      if (uErr) {
        console.error('DB update user error', uErr);
        return res.status(500).json({ error: 'internal' });
      }

      if (lgpdConsent) {
        db.run(
          'INSERT OR REPLACE INTO user_security (user_id, email_verified, totp_secret, totp_enabled, require_2fa, lgpd_consent_at) VALUES (?, COALESCE((SELECT email_verified FROM user_security WHERE user_id = ?), 1), COALESCE((SELECT totp_secret FROM user_security WHERE user_id = ?), NULL), COALESCE((SELECT totp_enabled FROM user_security WHERE user_id = ?), 0), COALESCE((SELECT require_2fa FROM user_security WHERE user_id = ?), 0), ?)',
          [userId, userId, userId, userId, userId, new Date().toISOString()]
        );
      }

      ensureUserSecurity(userId, (secErr, security) => {
        if (secErr) {
          console.error('DB user_security error', secErr);
          return res.status(500).json({ error: 'internal' });
        }
        res.json({
          user: {
            id: row.id,
            name: nextName,
            email: nextEmail,
            emailVerified: !!security?.email_verified,
            totpEnabled: !!security?.totp_enabled,
            require2fa: !!security?.require_2fa,
            lgpdConsentAt: security?.lgpd_consent_at || null,
            ...nextData,
          }
        });
      });
    });
    stmt.finalize();
  });
});

app.get('/api/auth/security/:userId', (req, res) => {
  const { userId } = req.params;
  ensureUserSecurity(userId, (err, security) => {
    if (err) return res.status(500).json({ error: 'internal' });
    res.json({
      emailVerified: !!security?.email_verified,
      totpEnabled: !!security?.totp_enabled,
      require2fa: !!security?.require_2fa,
      lgpdConsentAt: security?.lgpd_consent_at || null,
    });
  });
});

app.post('/api/auth/request-email-verification', (req, res) => {
  const { userId, email } = req.body || {};
  if (!userId && !email) return res.status(400).json({ error: 'userId or email required' });

  const lookup = (cb) => {
    if (userId) return cb(null, { id: userId, email });
    db.get('SELECT id, email FROM users WHERE email = ?', [email], cb);
  };

  lookup(async (err, row) => {
    if (err) {
      console.error('DB lookup error', err);
      return res.status(500).json({ error: 'internal' });
    }
    if (!row) return res.json({ ok: true });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const id = `verify_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const stmt = db.prepare('INSERT OR REPLACE INTO email_verifications (id, user_id, code, expires_at) VALUES (?, ?, ?, ?)');
    stmt.run(id, row.id, code, expiresAt, async (insErr) => {
      if (insErr) {
        console.error('DB insert email verification error', insErr);
        return res.status(500).json({ error: 'internal' });
      }
      const appName = process.env.APP_NAME || 'CarreiraHub';
      const html = `<p>Seu código de verificação é <strong>${code}</strong>. Ele expira em 10 minutos.</p>`;
      await sendEmail({ to: row.email, subject: `${appName} - Verificação de e-mail`, html });
      res.json({ ok: true });
    });
    stmt.finalize();
  });
});

app.post('/api/auth/verify-email', (req, res) => {
  const { userId, code } = req.body || {};
  if (!userId || !code) return res.status(400).json({ error: 'userId and code required' });

  db.get('SELECT * FROM email_verifications WHERE user_id = ? AND code = ?', [userId, String(code)], (err, row) => {
    if (err) {
      console.error('DB get email verification error', err);
      return res.status(500).json({ error: 'internal' });
    }
    if (!row || Date.now() > row.expires_at) {
      return res.status(400).json({ error: 'code_invalid_or_expired' });
    }

    db.run(
      'INSERT OR REPLACE INTO user_security (user_id, email_verified, totp_secret, totp_enabled, require_2fa, lgpd_consent_at) VALUES (?, 1, COALESCE((SELECT totp_secret FROM user_security WHERE user_id = ?), NULL), COALESCE((SELECT totp_enabled FROM user_security WHERE user_id = ?), 0), COALESCE((SELECT require_2fa FROM user_security WHERE user_id = ?), 0), COALESCE((SELECT lgpd_consent_at FROM user_security WHERE user_id = ?), NULL))',
      [userId, userId, userId, userId, userId],
      function (uErr) {
        if (uErr) {
          console.error('DB update email verified error', uErr);
          return res.status(500).json({ error: 'internal' });
        }
        db.run('DELETE FROM email_verifications WHERE user_id = ?', [userId]);
        res.json({ ok: true });
      }
    );
  });
});

app.post('/api/auth/2fa/setup', (req, res) => {
  const { userId, email } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const secret = speakeasy.generateSecret({
    length: 20,
    name: `CarreiraHub (${email || userId})`,
  });

  db.run(
    'INSERT OR REPLACE INTO user_security (user_id, email_verified, totp_secret, totp_enabled, require_2fa, lgpd_consent_at) VALUES (?, COALESCE((SELECT email_verified FROM user_security WHERE user_id = ?), 1), ?, 0, COALESCE((SELECT require_2fa FROM user_security WHERE user_id = ?), 0), COALESCE((SELECT lgpd_consent_at FROM user_security WHERE user_id = ?), NULL))',
    [userId, userId, secret.base32, userId, userId],
    function (err) {
      if (err) {
        console.error('DB update totp secret error', err);
        return res.status(500).json({ error: 'internal' });
      }
      res.json({ secret: secret.base32, otpauthUrl: secret.otpauth_url });
    }
  );
});

app.post('/api/auth/2fa/verify', (req, res) => {
  const { userId, token } = req.body || {};
  if (!userId || !token) return res.status(400).json({ error: 'userId and token required' });

  db.get('SELECT totp_secret FROM user_security WHERE user_id = ?', [userId], (err, row) => {
    if (err) return res.status(500).json({ error: 'internal' });
    if (!row?.totp_secret) return res.status(400).json({ error: 'totp_not_setup' });

    const ok = speakeasy.totp.verify({
      secret: row.totp_secret,
      encoding: 'base32',
      token: String(token),
      window: 1,
    });
    if (!ok) return res.status(400).json({ error: 'invalid_otp' });

    db.run('UPDATE user_security SET totp_enabled = 1 WHERE user_id = ?', [userId], (uErr) => {
      if (uErr) return res.status(500).json({ error: 'internal' });
      res.json({ ok: true });
    });
  });
});

app.post('/api/auth/2fa/disable', (req, res) => {
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId required' });
  db.run('UPDATE user_security SET totp_enabled = 0 WHERE user_id = ?', [userId], (err) => {
    if (err) return res.status(500).json({ error: 'internal' });
    res.json({ ok: true });
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
  const { companyId, companyName, title, description, area, type, location, salary, deadline, requirements } = req.body;
  if (!companyId || !title || !area || !type) {
    return res.status(400).json({ error: 'Campos obrigatórios: companyId, title, area, type' });
  }

  const id = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const createdAt = new Date().toISOString();
  const reqsJson = JSON.stringify(requirements || []);

  const stmt = db.prepare(
    `INSERT INTO jobs (id, company_id, company_name, title, description, area, type, location, salary, deadline, requirements, active, applicants, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?)`
  );
  stmt.run(id, companyId, companyName || '', title, description || '', area, type, location || '', salary || '', deadline || '', reqsJson, createdAt, function (err) {
    if (err) {
      console.error('DB insert job error', err);
      return res.status(500).json({ error: 'Erro ao criar vaga' });
    }
    const job = {
      id, companyId, companyName: companyName || '', title,
      description: description || '', area, type,
      location: location || '', salary: salary || '',
      deadline: deadline || '',
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
      deadline: r.deadline,
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
      deadline: r.deadline,
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
  const { title, description, area, type, location, salary, deadline, requirements, active, applicants } = req.body;

  db.get('SELECT * FROM jobs WHERE id = ?', [jobId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Erro interno' });
    if (!row) return res.status(404).json({ error: 'Vaga não encontrada' });

    const stmt = db.prepare(
      `UPDATE jobs SET title=?, description=?, area=?, type=?, location=?, salary=?, deadline=?, requirements=?, active=?, applicants=? WHERE id=?`
    );
    stmt.run(
      title ?? row.title,
      description ?? row.description,
      area ?? row.area,
      type ?? row.type,
      location ?? row.location,
      salary ?? row.salary,
      deadline ?? row.deadline,
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
          deadline: deadline ?? row.deadline,
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

// Endpoint de upload de currículo (simples, sem multer)
app.post('/api/upload-resume', (req, res) => {
  try {
    // Simular resposta de sucesso
    // Em produção, aqui seria feito o upload real
    const fileId = 'resume_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const uploadPath = path.join(UPLOAD_DIR, fileId + '.pdf');
    
    // Salvar arquivo (se body contiver dados binários)
    if (req.body && Buffer.isBuffer(req.body) && req.body.length > 0) {
      fs.writeFileSync(uploadPath, req.body);
    }
    
    const response = {
      success: true,
      fileId,
      fileName: req.headers['x-filename'] || 'curriculum.pdf',
      filePath: uploadPath,
      url: `/uploads/${fileId}.pdf`,
      signedUrl: `${req.protocol}://${req.get('host')}/uploads/${fileId}.pdf`,
      uploadedAt: new Date().toISOString()
    };
    
    console.log(`✅ Arquivo enviado: ${fileId}.pdf`);
    res.json(response);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do arquivo' });
  }
});

// Servir arquivos estáticos do diretório de uploads
app.use('/uploads', express.static(UPLOAD_DIR));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Auth server listening on', port));
