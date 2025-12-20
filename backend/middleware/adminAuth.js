
import { query } from "../models/db.js";

export const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const users = await query("SELECT is_admin FROM users WHERE id = ?", [req.user.id]);

        if (!users || users.length === 0) {
            return res.status(401).json({ error: "User not found" });
        }

        const user = users[0];
        if (user.is_admin !== 1) {
            return res.status(403).json({ error: "Forbidden: Admin access required" });
        }

        next();
    } catch (e) {
        console.error("Admin Auth Error:", e);
        res.status(500).json({ error: "Server Error" });
    }
};
