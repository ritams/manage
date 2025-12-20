import db from '../models/db.js';

export const createCard = async (req, res) => {
    const { listId, text } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        res.status(400);
        throw new Error("Invalid text");
    }
    if (text.length > 1000) {
        res.status(400);
        throw new Error("Text too long (max 1000 chars)");
    }

    // Verify list ownership
    const list = await db.query("SELECT id FROM lists WHERE id=? AND user_id=?", [listId, req.user.id]);
    if (!list || list.length === 0) {
        res.status(404);
        throw new Error("List not found or unauthorized");
    }

    const result = await db.run(
        "INSERT INTO cards (list_id, text, position) VALUES (?, ?, (SELECT IFNULL(MAX(position), -1) + 1 FROM cards WHERE list_id=?))",
        [listId, text, listId]
    );
    res.json({ id: result.id });
};

export const updateCard = async (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        res.status(400);
        throw new Error("Invalid text");
    }
    if (text.length > 1000) {
        res.status(400);
        throw new Error("Text too long (max 1000 chars)");
    }

    // Check ownership via join or subquery. Using subquery to keep it simple as in original
    const result = await db.run(
        `UPDATE cards SET text=? 
         WHERE id=? AND EXISTS (
            SELECT 1 FROM lists WHERE lists.id = cards.list_id AND lists.user_id=?
         )`,
        [text, req.params.id, req.user.id]
    );
    if (result.changes === 0) {
        res.status(404);
        throw new Error("Card not found or unauthorized");
    }
    res.json({ ok: true });
};

export const deleteCard = async (req, res) => {
    const result = await db.run(
        `DELETE FROM cards 
         WHERE id=? AND EXISTS (
            SELECT 1 FROM lists WHERE lists.id = cards.list_id AND lists.user_id=?
         )`,
        [req.params.id, req.user.id]
    );
    if (result.changes === 0) {
        res.status(404);
        throw new Error("Card not found or unauthorized");
    }
    res.json({ ok: true });
};

export const moveCard = async (req, res) => {
    const { cardId, listId } = req.body;
    // Verify target list ownership
    const targetList = await db.query("SELECT id FROM lists WHERE id=? AND user_id=?", [listId, req.user.id]);
    if (!targetList || targetList.length === 0) {
        res.status(404);
        throw new Error("Target list not found or unauthorized");
    }

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

    if (result.changes === 0) {
        res.status(404);
        throw new Error("Card not found or unauthorized");
    }
    res.json({ ok: true });
};

export const reorderCards = async (req, res) => {
    const { cardIds } = req.body;
    await db.transaction(async () => {
        for (let i = 0; i < cardIds.length; i++) {
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
};
