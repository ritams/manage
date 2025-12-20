import db from '../models/db.js';

export const getBoards = async (req, res) => {
    const boards = await db.query("SELECT * FROM boards WHERE user_id=? ORDER BY created_at", [req.user.id]);
    res.json(boards);
};

export const createBoard = async (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400);
        throw new Error("Invalid name");
    }
    // Using db.run from models/db.js which returns a Promise resolving to { id, changes }
    const result = await db.run(
        "INSERT INTO boards (user_id, name) VALUES (?, ?)",
        [req.user.id, name]
    );
    res.json({ id: result.id, name });
};

export const updateBoard = async (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400);
        throw new Error("Invalid name");
    }
    const result = await db.run(
        "UPDATE boards SET name=? WHERE id=? AND user_id=?",
        [name, req.params.id, req.user.id]
    );
    if (result.changes === 0) {
        res.status(404);
        throw new Error("Board not found or unauthorized");
    }
    res.json({ ok: true });
};

export const deleteBoard = async (req, res) => {
    const result = await db.run("DELETE FROM boards WHERE id=? AND user_id=?", [req.params.id, req.user.id]);
    if (result.changes === 0) {
        res.status(404);
        throw new Error("Board not found or unauthorized");
    }
    res.json({ ok: true });
};
