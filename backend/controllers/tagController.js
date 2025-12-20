import db from '../models/db.js';

export const getTags = async (req, res) => {
    const tags = await db.query("SELECT * FROM tags WHERE user_id=?", [req.user.id]);
    res.json(tags);
};

export const createTag = async (req, res) => {
    const { name, color } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400);
        throw new Error("Invalid name");
    }
    if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
        res.status(400);
        throw new Error("Invalid color format (must be hex code, e.g. #3b82f6)");
    }
    const result = await db.run(
        "INSERT INTO tags (user_id, name, color) VALUES (?, ?, ?)",
        [req.user.id, name, color || "#3b82f6"]
    );
    res.json({ id: result.id, name, color });
};

export const updateTag = async (req, res) => {
    const { name, color } = req.body;
    if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
        res.status(400);
        throw new Error("Invalid color format");
    }
    const result = await db.run(
        "UPDATE tags SET name=?, color=? WHERE id=? AND user_id=?",
        [name, color, req.params.id, req.user.id]
    );
    if (result.changes === 0) {
        res.status(404);
        throw new Error("Tag not found or unauthorized");
    }
    res.json({ ok: true });
};

export const deleteTag = async (req, res) => {
    const result = await db.run(
        "DELETE FROM tags WHERE id=? AND user_id=?",
        [req.params.id, req.user.id]
    );
    if (result.changes === 0) {
        res.status(404);
        throw new Error("Tag not found or unauthorized");
    }
    res.json({ ok: true });
};

export const addTagToCard = async (req, res) => {
    const { cardId, tagId } = req.body;

    // Verify ownership of both card and tag
    const card = await db.query(
        `SELECT 1 FROM cards 
         JOIN lists ON cards.list_id = lists.id 
         WHERE cards.id=? AND lists.user_id=?`,
        [cardId, req.user.id]
    );
    if (!card || card.length === 0) {
        res.status(404);
        throw new Error("Card not found or unauthorized");
    }

    const tag = await db.query("SELECT 1 FROM tags WHERE id=? AND user_id=?", [tagId, req.user.id]);
    if (!tag || tag.length === 0) {
        res.status(404);
        throw new Error("Tag not found or unauthorized");
    }

    await db.run("INSERT OR IGNORE INTO card_tags (card_id, tag_id) VALUES (?, ?)", [cardId, tagId]);
    res.json({ ok: true });
};

export const removeTagFromCard = async (req, res) => {
    const { cardId, tagId } = req.params;

    const result = await db.run(
        `DELETE FROM card_tags 
         WHERE card_id=? AND tag_id=? AND EXISTS (
            SELECT 1 FROM cards 
            JOIN lists ON cards.list_id = lists.id 
            WHERE cards.id=? AND lists.user_id=?
         )`,
        [cardId, tagId, cardId, req.user.id]
    );

    if (result.changes === 0) {
        res.status(404);
        throw new Error("Association not found or unauthorized");
    }
    res.json({ ok: true });
};
