// Simple SQL Injection demo
// WARNING: The "vulnerable" endpoint is INTENTIONALLY insecure. For demo only.

const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const db = new Database(':memory:');

// ---- Seed an in-memory users table with 2 legitimate users + 1 admin ----
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    secret TEXT NOT NULL
  );
`);

const insert = db.prepare(
  'INSERT INTO users (username, password, role, secret) VALUES (?, ?, ?, ?)'
);
insert.run('alice',  'wonderland', 'user',  'Alice\'s diary: I love rabbits.');
insert.run('bob',    'builder123', 'user',  'Bob\'s notes: meeting at 3pm.');
insert.run('admin',  'sup3rS3cret!','admin', 'TOP SECRET: launch codes = 0000.');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Disable caching so demo edits show up on refresh.
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.set('Pragma', 'no-cache');
  next();
});

app.use(express.static(path.join(__dirname, 'public'), { etag: false, lastModified: false }));

// ---------------- VULNERABLE LOGIN (string concatenation) ----------------
app.post('/api/login-vulnerable', (req, res) => {
  const { username = '', password = '' } = req.body;
  // !! DO NOT DO THIS IN REAL CODE !!
  const sql = `SELECT id, username, role, secret FROM users
               WHERE username = '${username}' AND password = '${password}'`;
  try {
    const row = db.prepare(sql).get();
    res.json({ sql, success: !!row, user: row || null });
  } catch (err) {
    res.json({ sql, success: false, error: err.message });
  }
});

// ---------------- SAFE LOGIN (parameterized query) ----------------
app.post('/api/login-safe', (req, res) => {
  const { username = '', password = '' } = req.body;
  const sql =
    "SELECT id, username, role, secret FROM users WHERE username = ? AND password = ?";
  try {
    const row = db.prepare(sql).get(username, password);
    res.json({ sql, params: [username, password], success: !!row, user: row || null });
  } catch (err) {
    res.json({ sql, success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SQL Injection demo running at http://localhost:${PORT}`);
});
