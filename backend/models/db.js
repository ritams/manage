import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, '../trello.db');

const db = new sqlite3.Database(DB_FILE);

export const initDB = () => {
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
        db.run(`
            CREATE TABLE IF NOT EXISTS tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                name TEXT,
                color TEXT
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS card_tags (
                card_id INTEGER,
                tag_id INTEGER,
                PRIMARY KEY (card_id, tag_id),
                FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
            )
        `);
    });
};

export const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

export const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

// Transaction helper
export const transaction = async (callback) => {
    await run("BEGIN TRANSACTION");
    try {
        await callback(db);
        await run("COMMIT");
    } catch (err) {
        await run("ROLLBACK");
        throw err;
    }
};

export default { query, run, transaction, initDB };
