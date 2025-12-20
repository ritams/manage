import db from '../models/db.js';
import { getIO } from '../socket.js';

export const getBoards = async (req, res) => {
    const sql = `
        SELECT b.*, 'owner' as role 
        FROM boards b WHERE b.user_id = ?
        UNION
        SELECT b.*, bm.role 
        FROM boards b 
        JOIN board_members bm ON b.id = bm.board_id 
        WHERE bm.user_id = ?
        ORDER BY created_at
    `;
    const boards = await db.query(sql, [req.user.id, req.user.id]);
    res.json(boards);
};

export const createBoard = async (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400);
        throw new Error("Invalid name");
    }
    const result = await db.run(
        "INSERT INTO boards (user_id, name) VALUES (?, ?)",
        [req.user.id, name]
    );
    res.json({ id: result.id, name, role: 'owner' });
};

export const updateBoard = async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400);
        throw new Error("Invalid name");
    }

    // Check access (Owner or Member)
    const access = await db.query(
        `SELECT 1 FROM boards WHERE id=? AND user_id=?
         UNION
         SELECT 1 FROM board_members WHERE board_id=? AND user_id=?`,
        [id, req.user.id, id, req.user.id]
    );

    if (access.length === 0) {
        res.status(403);
        throw new Error("Unauthorized");
    }

    await db.run("UPDATE boards SET name=? WHERE id=?", [name, id]);

    getIO().to(`board_${id}`).emit('BOARD_UPDATED');
    res.json({ ok: true });
};

export const deleteBoard = async (req, res) => {
    // Only owner can delete
    const result = await db.run("DELETE FROM boards WHERE id=? AND user_id=?", [req.params.id, req.user.id]);
    if (result.changes === 0) {
        res.status(404);
        throw new Error("Board not found or unauthorized");
    }
    // Disconnect everyone from room? Not strictly necessary, they will just get errors if they try to act.
    res.json({ ok: true });
};

export const getMembers = async (req, res) => {
    const { id } = req.params;
    // Check access
    const access = await db.query(
        `SELECT 1 FROM boards WHERE id=? AND user_id=?
         UNION
         SELECT 1 FROM board_members WHERE board_id=? AND user_id=?`,
        [id, req.user.id, id, req.user.id]
    );
    if (access.length === 0) return res.status(403).json({ error: "Unauthorized" });

    const members = await db.query(`
        SELECT u.id, u.email, u.name, bm.role 
        FROM board_members bm
        JOIN users u ON bm.user_id = u.id
        WHERE bm.board_id = ?
    `, [id]);

    res.json(members);
};

export const addMember = async (req, res) => {
    const { id } = req.params; // boardId
    const { email } = req.body;

    // Verify owner
    const board = await db.query("SELECT * FROM boards WHERE id=? AND user_id=?", [id, req.user.id]);
    if (!board.length) return res.status(403).json({ error: "Only owner can add members" });

    const user = await db.query("SELECT id FROM users WHERE email=?", [email]);
    if (!user.length) return res.status(404).json({ error: "User not found" });
    const newMemberId = user[0].id;

    if (newMemberId === req.user.id) return res.status(400).json({ error: "Cannot add self" });

    try {
        await db.run("INSERT INTO board_members (board_id, user_id) VALUES (?, ?)", [id, newMemberId]);
        res.json({ ok: true });
    } catch (e) {
        res.status(400).json({ error: "User already member" });
    }
};

export const removeMember = async (req, res) => {
    const { id, userId } = req.params; // boardId, memberUserId

    // Verify owner
    const board = await db.query("SELECT * FROM boards WHERE id=? AND user_id=?", [id, req.user.id]);
    if (!board.length) return res.status(403).json({ error: "Only owner can remove members" });

    await db.run("DELETE FROM board_members WHERE board_id=? AND user_id=?", [id, userId]);
    res.json({ ok: true });
};
