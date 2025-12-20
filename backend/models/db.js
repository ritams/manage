import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, '../trello.db');

const db = new sqlite3.Database(DB_FILE);

export const initDB = () => {
    db.serialize(async () => {
        // Enable Foreign Keys enforcement
        db.run("PRAGMA foreign_keys = ON;");

        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT,
                name TEXT
            )
        `);

        // 1. Create BOARDS table
        db.run(`
            CREATE TABLE IF NOT EXISTS boards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                name TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `);

        // 2. Create LISTS table
        db.run(`
            CREATE TABLE IF NOT EXISTS lists (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                board_id INTEGER,
                title TEXT,
                position INTEGER,
                FOREIGN KEY(board_id) REFERENCES boards(id) ON DELETE CASCADE
            )
        `);

        // 3. SCHEMA MIGRATION: Add board_id to lists if missing
        // We use a try-catch block for the column addition because SQLite doesn't have "IF COLUMN NOT EXISTS"
        db.run("ALTER TABLE lists ADD COLUMN board_id INTEGER", (err) => {
            // Ignore error if column already exists
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS cards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                list_id INTEGER,
                text TEXT,
                position INTEGER,
                FOREIGN KEY(list_id) REFERENCES lists(id) ON DELETE CASCADE
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

        // 4. DATA MIGRATION: Fix orphan lists (lists with null board_id)
        // This needs to run after table alterations are committed/complete.
        // Since db.serialize ensures sequential execution, this should be safe.
        db.all("SELECT DISTINCT user_id FROM lists WHERE board_id IS NULL", [], (err, rows) => {
            if (err) {
                console.error("Migration check failed:", err);
                return;
            }
            if (rows && rows.length > 0) {
                console.log(`Migrating data for ${rows.length} users...`);
                rows.forEach(row => {
                    const userId = row.user_id;
                    // Create a default board for this user
                    db.run("INSERT INTO boards (user_id, name) VALUES (?, ?)", [userId, 'Main Board'], function (err) {
                        if (err) {
                            console.error(`Failed to create board for user ${userId}`, err);
                            return;
                        }
                        const newBoardId = this.lastID;
                        // Assign all orphan lists of this user to the new board
                        db.run("UPDATE lists SET board_id=? WHERE user_id=? AND board_id IS NULL", [newBoardId, userId], (err) => {
                            if (err) console.error(`Failed to update lists for user ${userId}`, err);
                            else console.log(`Migrated lists for user ${userId} to Board ${newBoardId}`);
                        });
                    });
                });
            }
        });

        // 5. INDEXES for Performance
        db.run("CREATE INDEX IF NOT EXISTS idx_lists_board_id ON lists(board_id)");
        db.run("CREATE INDEX IF NOT EXISTS idx_cards_list_id ON cards(list_id)");
        db.run("CREATE INDEX IF NOT EXISTS idx_card_tags_card_id ON card_tags(card_id)");
        db.run("CREATE INDEX IF NOT EXISTS idx_card_tags_tag_id ON card_tags(tag_id)");
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
