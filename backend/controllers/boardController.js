import db from '../models/db.js';

export const getBoard = async (req, res) => {
    try {
        const lists = await db.query(
            "SELECT * FROM lists WHERE user_id=? ORDER BY position",
            [req.user.id]
        );

        if (!lists || lists.length === 0) return res.json([]);

        const listIds = lists.map(l => l.id);
        const placeholders = listIds.map(() => "?").join(",");

        const cards = await db.query(
            `SELECT * FROM cards WHERE list_id IN (${placeholders})`,
            listIds
        );

        lists.forEach(l => {
            l.cards = cards
                .filter(c => c.list_id === l.id)
                .sort((a, b) => a.position - b.position);
        });

        res.json(lists);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createList = async (req, res) => {
    try {
        const result = await db.run(
            "INSERT INTO lists (user_id, title, position) VALUES (?, ?, ?)",
            [req.user.id, req.body.title, Date.now()]
        );
        res.json({ id: result.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateList = async (req, res) => {
    try {
        await db.run(
            "UPDATE lists SET title=? WHERE id=?",
            [req.body.title, req.params.id]
        );
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteList = async (req, res) => {
    try {
        await db.transaction(async () => {
            await db.run("DELETE FROM cards WHERE list_id=?", [req.params.id]);
            await db.run("DELETE FROM lists WHERE id=?", [req.params.id]);
        });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const reorderLists = async (req, res) => {
    const { listIds } = req.body;
    try {
        await db.transaction(async () => {
            for (let i = 0; i < listIds.length; i++) {
                await db.run("UPDATE lists SET position=? WHERE id=?", [i, listIds[i]]);
            }
        });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createCard = async (req, res) => {
    const { listId, text } = req.body;
    try {
        const result = await db.run(
            "INSERT INTO cards (list_id, text, position) VALUES (?, ?, ?)",
            [listId, text, Date.now()]
        );
        res.json({ id: result.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateCard = async (req, res) => {
    try {
        await db.run(
            "UPDATE cards SET text=? WHERE id=?",
            [req.body.text, req.params.id]
        );
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteCard = async (req, res) => {
    try {
        await db.run("DELETE FROM cards WHERE id=?", [req.params.id]);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const moveCard = async (req, res) => {
    const { cardId, listId } = req.body;
    try {
        await db.run(
            "UPDATE cards SET list_id=? WHERE id=?",
            [listId, cardId]
        );
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const reorderCards = async (req, res) => {
    const { cardIds } = req.body;
    try {
        await db.transaction(async () => {
            for (let i = 0; i < cardIds.length; i++) {
                await db.run("UPDATE cards SET position=? WHERE id=?", [i, cardIds[i]]);
            }
        });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
