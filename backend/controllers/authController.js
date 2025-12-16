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

        const session = generateSession(user);

        res.cookie("session", session, {
            httpOnly: true,
            sameSite: 'lax'
        });

        res.json({ ok: true, user: { name: user.name, email: user.email } });
    } catch (e) {
        console.error(e);
        res.status(401).json({ error: "Auth failed" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("session");
    res.json({ ok: true });
};

export const me = (req, res) => {
    res.json({ user: req.user });
};
