
import { query } from "../models/db.js";

// GET /api/admin/stats
export const getSystemStats = async (req, res) => {
    try {
        const userCount = await query("SELECT COUNT(*) as count FROM users");
        const boardCount = await query("SELECT COUNT(*) as count FROM boards");
        const listCount = await query("SELECT COUNT(*) as count FROM lists");
        const cardCount = await query("SELECT COUNT(*) as count FROM cards");

        res.json({
            users: userCount[0].count,
            boards: boardCount[0].count,
            lists: listCount[0].count,
            cards: cardCount[0].count,
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
};

// GET /api/admin/users
export const getUsers = async (req, res) => {
    try {
        // Get all users with a count of their boards
        const users = await query(`
      SELECT u.id, u.name, u.email, u.is_admin, COUNT(b.id) as board_count
      FROM users u
      LEFT JOIN boards b ON u.id = b.user_id
      GROUP BY u.id
    `);
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

// GET /api/admin/users/:id
export const getUserDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const users = await query("SELECT id, name, email, is_admin FROM users WHERE id = ?", [id]);
        if (users.length === 0) return res.status(404).json({ error: "User not found" });

        const user = users[0];

        // Get boards owned/member of
        const boards = await query(`
      SELECT b.id, b.name, b.created_at, 'owner' as role
      FROM boards b WHERE b.user_id = ?
      UNION
      SELECT b.id, b.name, b.created_at, bm.role
      FROM boards b
      JOIN board_members bm ON b.id = bm.board_id
      WHERE bm.user_id = ?
    `, [id, id]);

        res.json({ user, boards });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: "Failed to fetch user details" });
    }
};
