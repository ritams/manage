import db from '../models/db.js';

export const getLists = async (req, res) => {
    const { boardId } = req.query;
    if (!boardId) {
        res.status(400);
        throw new Error("boardId required");
    }

    // Verify board ownership
    const board = await db.query("SELECT id FROM boards WHERE id=? AND user_id=?", [boardId, req.user.id]);
    if (!board || board.length === 0) {
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

    // Group tags by card_id
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
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        res.status(400);
        throw new Error("Invalid title");
    }
    if (!boardId) {
        res.status(400);
        throw new Error("boardId required");
    }
    if (title.length > 255) {
        res.status(400);
        throw new Error("Title too long (max 255 chars)");
    }

    // Verify board ownership
    const board = await db.query("SELECT id FROM boards WHERE id=? AND user_id=?", [boardId, req.user.id]);
    if (!board || board.length === 0) {
        res.status(404);
        throw new Error("Board not found or unauthorized");
    }

    const result = await db.run(
        "INSERT INTO lists (user_id, board_id, title, position) VALUES (?, ?, ?, (SELECT IFNULL(MAX(position), -1) + 1 FROM lists WHERE board_id=?))",
        [req.user.id, boardId, title, boardId]
    );
    res.json({ id: result.id });
};

export const updateList = async (req, res) => {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        res.status(400);
        throw new Error("Invalid title");
    }
    if (title.length > 255) {
        res.status(400);
        throw new Error("Title too long (max 255 chars)");
    }
    // Check if list belongs to a board owned by user
    // Actually we can just check user_id on list as per schema, assuming user_id was set correctly on creation.
    // The createList sets user_id.
    const result = await db.run(
        "UPDATE lists SET title=? WHERE id=? AND user_id=?",
        [title, req.params.id, req.user.id]
    );
    if (result.changes === 0) {
        res.status(404);
        throw new Error("List not found or unauthorized");
    }
    res.json({ ok: true });
};

export const deleteList = async (req, res) => {
    // With foreign keys ON DELETE CASCADE, we just delete the list.
    const result = await db.run("DELETE FROM lists WHERE id=? AND user_id=?", [req.params.id, req.user.id]);
    if (result.changes === 0) {
        res.status(404);
        throw new Error("List not found or unauthorized");
    }
    res.json({ ok: true });
};

export const reorderLists = async (req, res) => {
    const { listIds } = req.body;
    await db.transaction(async () => {
        for (let i = 0; i < listIds.length; i++) {
            await db.run(
                "UPDATE lists SET position=? WHERE id=? AND user_id=?",
                [i, listIds[i], req.user.id]
            );
        }
    });
    res.json({ ok: true });
};
