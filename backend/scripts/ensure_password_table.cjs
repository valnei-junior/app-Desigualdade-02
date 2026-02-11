const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data.sqlite');
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS password_resets (token TEXT PRIMARY KEY, user_id TEXT, expires_at INTEGER)", (err) => {
    if (err) {
      console.error('Failed to ensure password_resets table:', err);
      process.exit(1);
    }
    console.log('password_resets table ensured');
    db.close();
  });
});
