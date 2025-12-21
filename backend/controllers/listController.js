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

export const getLists = async (req, res) => {
    const { boardId } = req.query;
    if (!boardId) {
        res.status(400);
        throw new Error("boardId required");
    }

    if (!await checkBoardAccess(req.user.id, boardId)) {
        res.status(404);
        throw new Error("Board not found or unauthorized");
    }

    const lists = await db.query(
        "SELECT * FROM lists WHERE board_id=? ORDER BY position",
        [boardId]
    );

    if (!lists || lists.length === 0) return res.json([]);

    const listIds = lists.map(l => l.id);
    const placeholders = listIds.map(() => "?").join(",");

    const cards = await db.query(
        `SELECT cards.*, tags.id as tag_id, tags.name as tag_name, tags.color as tag_color 
         FROM cards 
         LEFT JOIN card_tags ON cards.id = card_tags.card_id 
         LEFT JOIN tags ON card_tags.tag_id = tags.id
         WHERE cards.list_id IN (${placeholders})`,
        listIds
    );

    // Group cards and tags
    const cardMap = new Map();
    cards.forEach(row => {
        if (!cardMap.has(row.id)) {
            const { tag_id, tag_name, tag_color, ...cardData } = row;
            cardMap.set(row.id, { ...cardData, tags: [] });
        }
        if (row.tag_id) {
            cardMap.get(row.id).tags.push({
                id: row.tag_id,
                name: row.tag_name,
                color: row.tag_color
            });
        }
    });

    const groupedCards = Array.from(cardMap.values());

    lists.forEach(l => {
        l.cards = groupedCards
            .filter(c => c.list_id === l.id)
            .sort((a, b) => a.position - b.position);
    });

    res.json(lists);
};

export const createList = async (req, res) => {
    const { title, boardId } = req.body;
    // Validation handled by middleware
    if (!boardId) {
        res.status(400);
        throw new Error("boardId required");
    }
    if (title.length > 255) {
        res.status(400);
        throw new Error("Title too long (max 255 chars)");
    }

    if (!await checkBoardAccess(req.user.id, boardId)) {
        res.status(404);
        throw new Error("Board not found or unauthorized");
    }

    const result = await db.run(
        "INSERT INTO lists (user_id, board_id, title, position) VALUES (?, ?, ?, (SELECT IFNULL(MAX(position), -1) + 1 FROM lists WHERE board_id=?))",
        [req.user.id, boardId, title, boardId]
    );

    getIO().to(`board_${boardId}`).emit('BOARD_UPDATED');
    res.json({ id: result.id });
};

export const updateList = async (req, res) => {
    const { title } = req.body;
    const { id } = req.params;

    // Validation handled by middleware

    // Get board_id to check access
    const list = await db.query("SELECT board_id FROM lists WHERE id=?", [id]);
    if (!list.length) {
        res.status(404);
        throw new Error("List not found");
    }
    const boardId = list[0].board_id;

    if (!await checkBoardAccess(req.user.id, boardId)) {
        res.status(403);
        throw new Error("Unauthorized");
    }

    await db.run("UPDATE lists SET title=? WHERE id=?", [title, id]);

    getIO().to(`board_${boardId}`).emit('BOARD_UPDATED');
    res.json({ ok: true });
};

export const deleteList = async (req, res) => {
    const { id } = req.params;
    const list = await db.query("SELECT board_id FROM lists WHERE id=?", [id]);
    if (!list.length) {
        res.status(404);
        throw new Error("List not found");
    }
    const boardId = list[0].board_id;

    if (!await checkBoardAccess(req.user.id, boardId)) {
        res.status(403);
        throw new Error("Unauthorized");
    }

    await db.run("DELETE FROM lists WHERE id=?", [id]);

    getIO().to(`board_${boardId}`).emit('BOARD_UPDATED');
    res.json({ ok: true });
};

export const reorderLists = async (req, res) => {
    const { listIds } = req.body;
    if (!listIds || listIds.length === 0) return res.json({ ok: true });

    // Validate input format
    if (!Array.isArray(listIds)) {
        res.status(400);
        throw new Error("listIds must be an array");
    }

    // 1. Fetch board_id for ALL lists to ensure they all belong to the same board
    // and that the user isn't mixing lists from different boards (or boards they don't own)
    const placeholders = listIds.map(() => '?').join(',');
    const lists = await db.query(
        `SELECT id, board_id FROM lists WHERE id IN (${placeholders})`,
        listIds
    );

    if (lists.length !== listIds.length) {
        res.status(404);
        throw new Error("One or more lists not found");
    }

    const boardId = lists[0].board_id;
    const allSameBoard = lists.every(l => l.board_id === boardId);

    if (!allSameBoard) {
        res.status(400);
        throw new Error("All lists must belong to the same board");
    }

    // 2. Check access to this board
    if (!await checkBoardAccess(req.user.id, boardId)) {
        res.status(403);
        throw new Error("Unauthorized");
    }

    // 3. Update positions in transaction
    await db.transaction(async () => {
        for (let i = 0; i < listIds.length; i++) {
            await db.run("UPDATE lists SET position=? WHERE id=?", [i, listIds[i]]);
        }
    });

    getIO().to(`board_${boardId}`).emit('BOARD_UPDATED');
    res.json({ ok: true });
};
