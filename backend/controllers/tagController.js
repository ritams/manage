import db from '../models/db.js';
import { getIO } from '../socket.js';

const checkBoardAccess = async (userId, boardId) => {
    const access = await db.query(
        `SELECT 1 FROM boards WHERE id=? AND user_id=?
         UNION
         SELECT 1 FROM board_members WHERE board_id=? AND user_id=?`,
        [boardId, userId, boardId, userId]
    );
    return access.length > 0;
};

const getBoardIdFromCard = async (cardId) => {
    const res = await db.query(
        "SELECT l.board_id FROM cards c JOIN lists l ON c.list_id = l.id WHERE c.id=?",
        [cardId]
    );
    return res.length ? res[0].board_id : null;
};

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

    const boardId = await getBoardIdFromCard(cardId);
    if (!boardId) {
        res.status(404);
        throw new Error("Card not found");
    }

    if (!await checkBoardAccess(req.user.id, boardId)) {
        res.status(403);
        throw new Error("Unauthorized");
    }

    // Verify tag ownership (can only add MY tags)
    const tag = await db.query("SELECT 1 FROM tags WHERE id=? AND user_id=?", [tagId, req.user.id]);
    if (!tag || tag.length === 0) {
        res.status(404);
        throw new Error("Tag not found (you can only use your own tags)");
    }

    await db.run("INSERT OR IGNORE INTO card_tags (card_id, tag_id) VALUES (?, ?)", [cardId, tagId]);

    getIO().to(`board_${boardId}`).emit('BOARD_UPDATED');
    res.json({ ok: true });
};

export const removeTagFromCard = async (req, res) => {
    const { cardId, tagId } = req.params;

    const boardId = await getBoardIdFromCard(cardId);
    if (!boardId) {
        res.status(404);
        throw new Error("Card not found");
    }

    if (!await checkBoardAccess(req.user.id, boardId)) {
        res.status(403);
        throw new Error("Unauthorized");
    }

    const result = await db.run(
        "DELETE FROM card_tags WHERE card_id=? AND tag_id=?",
        [cardId, tagId]
    );

    if (result.changes === 0) {
        // Could be unrelated error, but mostly means it wasn't there.
        // We'll return OK anyway for idempotency or 404 if strictly needed.
        // Original returned 404.
        res.status(404);
        throw new Error("Association not found");
    }

    getIO().to(`board_${boardId}`).emit('BOARD_UPDATED');
    res.json({ ok: true });
};
