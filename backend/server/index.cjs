const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

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

    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        console.error('DB get error', err);
        return res.status(500).json({ error: 'internal error' });
      }
      if (row) {
        return res.status(409).json({ error: 'email already exists' });
      }

      const hashed = await bcrypt.hash(password, 10);
      const userId = id || Date.now().toString();
      const data = JSON.stringify(rest || {});

      const stmt = db.prepare('INSERT INTO users (id, name, email, password, data) VALUES (?, ?, ?, ?, ?)');
      stmt.run(userId, name || '', email, hashed, data, function (err) {
        if (err) {
          console.error('DB insert error', err);
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ error: 'email already exists' });
          }
          return res.status(500).json({ error: 'could not create user' });
        }
        const user = { id: userId, name: name || '', email, ...rest };
        res.json({ user });
      });
      stmt.finalize();
    });
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

// Guest endpoint: create or return a user without requiring a password
app.post('/api/guest', (req, res) => {
  try {
    const { id, name, email, ...rest } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });

    db.get('SELECT id, name, email, password, data FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        console.error('DB get error', err);
        return res.status(500).json({ error: 'internal' });
      }
      if (row) {
        let data = {};
        try { data = JSON.parse(row.data || '{}'); } catch {}
        const user = { id: row.id, name: row.name, email: row.email, ...data };
        return res.json({ user });
      }

      const userId = id || Date.now().toString();
      const data = JSON.stringify(rest || {});
      const stmt = db.prepare('INSERT INTO users (id, name, email, password, data) VALUES (?, ?, ?, ?, ?)');
      // password null for guest
      stmt.run(userId, name || '', email, null, data, function (err) {
        if (err) {
          console.error('DB insert error', err);
          return res.status(500).json({ error: 'could not create user' });
        }
        const user = { id: userId, name: name || '', email, ...rest };
        res.json({ user });
      });
      stmt.finalize();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Auth server listening on', port));
