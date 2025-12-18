
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:');

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

async function test() {
    try {
        // 1. Setup Schema
        await run(`CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT, name TEXT)`);
        await run(`CREATE TABLE lists (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, title TEXT, position INTEGER)`);
        await run(`CREATE TABLE cards (id INTEGER PRIMARY KEY AUTOINCREMENT, list_id INTEGER, text TEXT, position INTEGER)`);
        await run(`CREATE TABLE tags (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, name TEXT, color TEXT)`);
        await run(`CREATE TABLE card_tags (
            card_id INTEGER,
            tag_id INTEGER,
            PRIMARY KEY (card_id, tag_id),
            FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        )`);

        // 2. Insert Data
        const userId = "user123";
        await run(`INSERT INTO users (id, name) VALUES (?, ?)`, [userId, "Test User"]);

        const listResult = await run(`INSERT INTO lists (user_id, title, position) VALUES (?, ?, ?)`, [userId, "Test List", 0]);
        const listId = listResult.id;

        const cardResult = await run(`INSERT INTO cards (list_id, text, position) VALUES (?, ?, ?)`, [listId, "Test Card", 0]);
        const cardId = cardResult.id;

        const tagResult = await run(`INSERT INTO tags (user_id, name, color) VALUES (?, ?, ?)`, [userId, "Test Tag", "red"]);
        const tagId = tagResult.id;

        // 3. Associate Tag
        await run(`INSERT INTO card_tags (card_id, tag_id) VALUES (?, ?)`, [cardId, tagId]);

        // Verify association exists
        let associations = await query(`SELECT * FROM card_tags`);
        console.log("Associations before delete:", associations);

        if (associations.length !== 1) throw new Error("Association failed setup");

        // 4. Run the DELETE query being debugged
        const params = [cardId, tagId, cardId, userId];
        const sql = `DELETE FROM card_tags 
             WHERE card_id=? AND tag_id=? AND EXISTS (
                SELECT 1 FROM cards 
                JOIN lists ON cards.list_id = lists.id 
                WHERE cards.id=? AND lists.user_id=?
             )`;

        console.log("Running DELETE with params:", params);

        const result = await run(sql, params);
        console.log("Delete result:", result);

        // 5. Verify Deletion
        associations = await query(`SELECT * FROM card_tags`);
        console.log("Associations after delete:", associations);

        if (associations.length === 0) {
            console.log("SUCCESS: Tag removed from card.");
        } else {
            console.log("FAILURE: Tag still associated with card.");
        }

    } catch (err) {
        console.error("Test failed:", err);
    }
}

test();
