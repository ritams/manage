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
        const { title } = req.body;
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ error: "Invalid title" });
        }
        if (title.length > 255) {
            return res.status(400).json({ error: "Title too long (max 255 chars)" });
        }


        const result = await db.run(
            "INSERT INTO lists (user_id, title, position) VALUES (?, ?, (SELECT IFNULL(MAX(position), -1) + 1 FROM lists WHERE user_id=?))",
            [req.user.id, title, req.user.id]
        );
        res.json({ id: result.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateList = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ error: "Invalid title" });
        }
        if (title.length > 255) {
            return res.status(400).json({ error: "Title too long (max 255 chars)" });
        }
        const result = await db.run(
            "UPDATE lists SET title=? WHERE id=? AND user_id=?",
            [req.body.title, req.params.id, req.user.id]
        );
        if (result.changes === 0) return res.status(404).json({ error: "List not found or unauthorized" });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteList = async (req, res) => {
    try {
        // First verify ownership
        const list = await db.query("SELECT id FROM lists WHERE id=? AND user_id=?", [req.params.id, req.user.id]);
        if (!list || list.length === 0) return res.status(404).json({ error: "List not found or unauthorized" });

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
                await db.run(
                    "UPDATE lists SET position=? WHERE id=? AND user_id=?",
                    [i, listIds[i], req.user.id]
                );
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
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({ error: "Invalid text" });
        }
        if (text.length > 1000) {
            return res.status(400).json({ error: "Text too long (max 1000 chars)" });
        }
        // Verify list ownership
        const list = await db.query("SELECT id FROM lists WHERE id=? AND user_id=?", [listId, req.user.id]);
        if (!list || list.length === 0) return res.status(404).json({ error: "List not found or unauthorized" });


        const result = await db.run(
            "INSERT INTO cards (list_id, text, position) VALUES (?, ?, (SELECT IFNULL(MAX(position), -1) + 1 FROM cards WHERE list_id=?))",
            [listId, text, listId]
        );
        res.json({ id: result.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateCard = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({ error: "Invalid text" });
        }
        if (text.length > 1000) {
            return res.status(400).json({ error: "Text too long (max 1000 chars)" });
        }
        const result = await db.run(
            `UPDATE cards SET text=? 
             WHERE id=? AND EXISTS (
                SELECT 1 FROM lists WHERE lists.id = cards.list_id AND lists.user_id=?
             )`,
            [req.body.text, req.params.id, req.user.id]
        );
        if (result.changes === 0) return res.status(404).json({ error: "Card not found or unauthorized" });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteCard = async (req, res) => {
    try {
        const result = await db.run(
            `DELETE FROM cards 
             WHERE id=? AND EXISTS (
                SELECT 1 FROM lists WHERE lists.id = cards.list_id AND lists.user_id=?
             )`,
            [req.params.id, req.user.id]
        );
        if (result.changes === 0) return res.status(404).json({ error: "Card not found or unauthorized" });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const moveCard = async (req, res) => {
    const { cardId, listId } = req.body;
    try {
        // Verify target list ownership
        const targetList = await db.query("SELECT id FROM lists WHERE id=? AND user_id=?", [listId, req.user.id]);
        if (!targetList || targetList.length === 0) return res.status(404).json({ error: "Target list not found or unauthorized" });

        // Get max position for the target list
        const maxPosResult = await db.query("SELECT MAX(position) as maxPos FROM cards WHERE list_id=?", [listId]);
        const nextPos = (maxPosResult[0].maxPos !== null) ? maxPosResult[0].maxPos + 1 : 0;

        // Verify card ownership and move with updated position
        const result = await db.run(
            `UPDATE cards SET list_id=?, position=? 
             WHERE id=? AND EXISTS (
                SELECT 1 FROM lists WHERE lists.id = cards.list_id AND lists.user_id=?
             )`,
            [listId, nextPos, cardId, req.user.id]
        );

        if (result.changes === 0) return res.status(404).json({ error: "Card not found or unauthorized" });
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
                // Verify ownership inside the loop (or you could batch verify)
                // Using a subquery update is safest/easiest here to avoid separate read
                await db.run(
                    `UPDATE cards SET position=? 
                     WHERE id=? AND EXISTS (
                        SELECT 1 FROM lists WHERE lists.id = cards.list_id AND lists.user_id=?
                     )`,
                    [i, cardIds[i], req.user.id]
                );
            }
        });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
