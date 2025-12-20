import sqlite3 from 'sqlite3';
import { initDB } from './models/db.js';

// Use a separate test DB file to avoid messing with real data
// But wait, initDB uses a hardcoded DB path relative to models/db.js.
// I should probably manually replicate the schema creation for this test or trust the file.
// Let's manually create a test db in tmp and verify the schema logic.

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON;");

    // Create tables as per new schema
    db.run(`CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT, name TEXT)`);
    db.run(`CREATE TABLE boards (id INTEGER PRIMARY KEY, user_id TEXT, name TEXT, FOREIGN KEY(user_id) REFERENCES users(id))`);
    db.run(`CREATE TABLE lists (id INTEGER PRIMARY KEY, board_id INTEGER, title TEXT, FOREIGN KEY(board_id) REFERENCES boards(id) ON DELETE CASCADE)`);
    db.run(`CREATE TABLE cards (id INTEGER PRIMARY KEY, list_id INTEGER, text TEXT, FOREIGN KEY(list_id) REFERENCES lists(id) ON DELETE CASCADE)`);

    // Insert Data
    db.run("INSERT INTO users VALUES ('u1', 'test@test.com', 'Test user')");
    db.run("INSERT INTO boards (id, user_id, name) VALUES (1, 'u1', 'Board 1')");
    db.run("INSERT INTO lists (id, board_id, title) VALUES (10, 1, 'List 1')");
    db.run("INSERT INTO cards (id, list_id, text) VALUES (100, 10, 'Card 1')");

    // Verify Data Exists
    db.get("SELECT count(*) as c FROM cards", (err, row) => {
        console.log("Cards before delete:", row.c);
    });

    // Delete Board
    console.log("Deleting Board 1...");
    db.run("DELETE FROM boards WHERE id = 1", (err) => {
        if (err) console.error("Delete failed:", err);

        // Verify Cascade
        db.get("SELECT count(*) as c FROM lists", (err, row) => {
            console.log("Lists after delete:", row.c); // Should be 0
        });
        db.get("SELECT count(*) as c FROM cards", (err, row) => {
            console.log("Cards after delete:", row.c); // Should be 0
        });
    });
});
