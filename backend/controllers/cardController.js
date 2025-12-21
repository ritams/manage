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

const getBoardIdFromList = async (listId) => {
    const list = await db.query("SELECT board_id FROM lists WHERE id=?", [listId]);
    return list.length ? list[0].board_id : null;
};

const getBoardIdFromCard = async (cardId) => {
    const res = await db.query(
        "SELECT l.board_id FROM cards c JOIN lists l ON c.list_id = l.id WHERE c.id=?",
        [cardId]
    );
    return res.length ? res[0].board_id : null;
};

export const createCard = async (req, res) => {
    const { listId, text } = req.body;
    // Validation handled by middleware
    if (text.length > 1000) {
        res.status(400);
        throw new Error("Text too long (max 1000 chars)");
    }

    const boardId = await getBoardIdFromList(listId);
    if (!boardId) {
        res.status(404);
        throw new Error("List not found");
    }

    if (!await checkBoardAccess(req.user.id, boardId)) {
        res.status(403);
        throw new Error("Unauthorized");
    }

    const result = await db.run(
        "INSERT INTO cards (list_id, text, position) VALUES (?, ?, (SELECT IFNULL(MAX(position), -1) + 1 FROM cards WHERE list_id=?))",
        [listId, text, listId]
    );

    getIO().to(`board_${boardId}`).emit('BOARD_UPDATED');
    res.json({ id: result.id });
};

export const updateCard = async (req, res) => {
    const { text } = req.body;
    const { id } = req.params;

    // Validation handled by middleware
    if (text.length > 1000) {
        res.status(400);
        throw new Error("Text too long (max 1000 chars)");
    }

    const boardId = await getBoardIdFromCard(id);
    if (!boardId) {
        res.status(404);
        throw new Error("Card not found");
    }

    if (!await checkBoardAccess(req.user.id, boardId)) {
        res.status(403);
        throw new Error("Unauthorized");
    }

    await db.run("UPDATE cards SET text=? WHERE id=?", [text, id]);

    getIO().to(`board_${boardId}`).emit('BOARD_UPDATED');
    res.json({ ok: true });
};

export const deleteCard = async (req, res) => {
    const { id } = req.params;
    const boardId = await getBoardIdFromCard(id);
    if (!boardId) {
        res.status(404);
        throw new Error("Card not found");
    }

    if (!await checkBoardAccess(req.user.id, boardId)) {
        res.status(403);
        throw new Error("Unauthorized");
    }

    await db.run("DELETE FROM cards WHERE id=?", [id]);

    getIO().to(`board_${boardId}`).emit('BOARD_UPDATED');
    res.json({ ok: true });
};

export const moveCard = async (req, res) => {
    const { cardId, listId } = req.body;

    // Check source board
    const sourceBoardId = await getBoardIdFromCard(cardId);
    if (!sourceBoardId) {
        res.status(404);
        throw new Error("Card not found");
    }
    if (!await checkBoardAccess(req.user.id, sourceBoardId)) {
        res.status(403);
        throw new Error("Unauthorized source");
    }

    // Check target board
    const targetBoardId = await getBoardIdFromList(listId);
    if (!targetBoardId) {
        res.status(404);
        throw new Error("Target list not found");
    }
    if (!await checkBoardAccess(req.user.id, targetBoardId)) {
        res.status(403);
        throw new Error("Unauthorized target");
    }

    // Get max position for the target list
    const maxPosResult = await db.query("SELECT MAX(position) as maxPos FROM cards WHERE list_id=?", [listId]);
    const nextPos = (maxPosResult[0].maxPos !== null) ? maxPosResult[0].maxPos + 1 : 0;

    await db.run("UPDATE cards SET list_id=?, position=? WHERE id=?", [listId, nextPos, cardId]);

    // Emit to both boards (usually same)
    getIO().to(`board_${sourceBoardId}`).emit('BOARD_UPDATED');
    if (sourceBoardId !== targetBoardId) {
        getIO().to(`board_${targetBoardId}`).emit('BOARD_UPDATED');
    }
    res.json({ ok: true });
};

export const reorderCards = async (req, res) => {
    const { cardIds } = req.body;
    if (!cardIds || cardIds.length === 0) return res.json({ ok: true });

    // Validate input format
    if (!Array.isArray(cardIds)) {
        res.status(400);
        throw new Error("cardIds must be an array");
    }

    // 1. Fetch board_id for ALL cards
    const placeholders = cardIds.map(() => '?').join(',');
    const cards = await db.query(
        `SELECT c.id, l.board_id 
         FROM cards c 
         JOIN lists l ON c.list_id = l.id 
         WHERE c.id IN (${placeholders})`,
        cardIds
    );

    if (cards.length !== cardIds.length) {
        res.status(404);
        throw new Error("One or more cards not found");
    }

    const boardId = cards[0].board_id;
    const allSameBoard = cards.every(c => c.board_id === boardId);

    if (!allSameBoard) {
        res.status(400);
        throw new Error("All cards must belong to the same board");
    }

    // 2. Check access to the board
    if (!await checkBoardAccess(req.user.id, boardId)) {
        res.status(403);
        throw new Error("Unauthorized");
    }

    // 3. Execute updates in transaction
    await db.transaction(async () => {
        for (let i = 0; i < cardIds.length; i++) {
            await db.run("UPDATE cards SET position=? WHERE id=?", [i, cardIds[i]]);
        }
    });

    getIO().to(`board_${boardId}`).emit('BOARD_UPDATED');
    res.json({ ok: true });
};

// Set or clear due date for a card
export const setDueDate = async (req, res) => {
    const { id } = req.params;
    const { dueDate } = req.body;

    const boardId = await getBoardIdFromCard(id);
    if (!boardId) {
        res.status(404);
        throw new Error("Card not found");
    }

    if (!await checkBoardAccess(req.user.id, boardId)) {
        res.status(403);
        throw new Error("Unauthorized");
    }

    // If dueDate is null/undefined, clear it; otherwise set it
    // Also reset notification_sent so user gets notified again if date changes
    if (dueDate) {
        await db.run(
            "UPDATE cards SET due_date = ?, notification_sent = 0 WHERE id = ?",
            [dueDate, id]
        );
    } else {
        await db.run(
            "UPDATE cards SET due_date = NULL, notification_sent = 0 WHERE id = ?",
            [id]
        );
    }

    getIO().to(`board_${boardId}`).emit('BOARD_UPDATED');
    res.json({ ok: true });
};
