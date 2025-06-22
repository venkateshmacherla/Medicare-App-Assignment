const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./meds.db');

// Enable WAL mode for better concurrency (fixes SQLITE_BUSY)
db.serialize(() => {
  db.run("PRAGMA journal_mode = WAL;");

  // Initialize tables
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    dosage TEXT,
    frequency TEXT,
    taken_dates TEXT DEFAULT '[]',
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

module.exports = db;