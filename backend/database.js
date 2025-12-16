import sqlite3 from "sqlite3";

const DB_FILE = "./trello.db";

const db = new sqlite3.Database(DB_FILE);

export function initDB() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT,
        name TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS lists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        title TEXT,
        position INTEGER
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        list_id INTEGER,
        text TEXT,
        position INTEGER
      )
    `);
  });
}

export default db;
