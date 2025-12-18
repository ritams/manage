import { verifyGoogleToken, generateSession } from '../auth.js';
import db from '../models/db.js';

export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await verifyGoogleToken(token);

        await db.run(
            "INSERT OR IGNORE INTO users VALUES (?, ?, ?)",
            [user.sub, user.email, user.name]
        );

        // Ensure user has at least one board
        const boards = await db.query("SELECT id FROM boards WHERE user_id = ?", [user.sub]);
        if (boards.length === 0) {
            await db.run("INSERT INTO boards (user_id, name) VALUES (?, ?)", [user.sub, "Main Board"]);
            console.log(`Created default 'Main Board' for user: ${user.email}`);
        }

        const session = generateSession(user);

        res.cookie("session", session, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production', // true in production
            signed: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
        });

        res.json({ ok: true, user: { name: user.name, email: user.email, picture: user.picture } });
    } catch (e) {
        console.error("LOGIN ERROR DETAILED:", e);
        console.error("Message:", e.message);
        console.error("Stack:", e.stack);
        res.status(401).json({ error: "Auth failed", details: e.message });
    }

};

export const logout = (req, res) => {
    res.clearCookie("session");
    res.json({ ok: true });
};

export const me = (req, res) => {
    res.json({ user: req.user });
};
