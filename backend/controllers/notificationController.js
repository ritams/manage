import db from '../models/db.js';

// Get user's notifications
export const getNotifications = async (req, res) => {
    const notifications = await db.query(
        `SELECT n.*, c.text as card_text, b.name as board_name
         FROM notifications n
         LEFT JOIN cards c ON n.card_id = c.id
         LEFT JOIN boards b ON n.board_id = b.id
         WHERE n.user_id = ?
         ORDER BY n.created_at DESC
         LIMIT 50`,
        [req.user.id]
    );
    res.json(notifications);
};

// Mark notification as read
export const markRead = async (req, res) => {
    const { id } = req.params;
    await db.run(
        "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?",
        [id, req.user.id]
    );
    res.json({ ok: true });
};

// Mark all notifications as read
export const markAllRead = async (req, res) => {
    await db.run(
        "UPDATE notifications SET is_read = 1 WHERE user_id = ?",
        [req.user.id]
    );
    res.json({ ok: true });
};

// Get unread count
export const getUnreadCount = async (req, res) => {
    const result = await db.query(
        "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0",
        [req.user.id]
    );
    res.json({ count: result[0].count });
};


