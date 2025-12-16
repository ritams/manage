import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(fileURLToPath(import.meta.url), '../../.env') });

import db, { initDB } from "./database.js";
import { verifyGoogleToken, authMiddleware, generateSession } from "./auth.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: /http:\/\/localhost:\d+$/,
    credentials: true
}));

// Initialize DB
initDB();

// Request logging middleware
app.use((req, res, next) => {
    console.log(`REQ: ${req.method} ${req.url} ${req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : ""}`);

    // Intercept response to log status
    const originalJson = res.json;
    res.json = function (body) {
        console.log(`RES: ${res.statusCode} ${JSON.stringify(body).substring(0, 100)}`);
        originalJson.apply(res, arguments);
    };
    next();
});

/* ================== ROUTES ================== */

// Google login
app.post("/auth/google", async (req, res) => {
    try {
        const { token } = req.body;
        const user = await verifyGoogleToken(token);

        db.run(
            "INSERT OR IGNORE INTO users VALUES (?, ?, ?)",
            [user.sub, user.email, user.name],
            (err) => {
                if (err) console.error(err);
            }
        );

        const session = generateSession(user);

        // Set cookie
        res.cookie("session", session, {
            httpOnly: true,
            // secure: true, // Enable in production with HTTPS
            sameSite: 'lax' // Needed for local dev between ports usually
        });

        res.json({ ok: true, user: { name: user.name, email: user.email } });
    } catch (e) {
        console.error(e);
        res.status(401).json({ error: "Auth failed" });
    }
});

app.post("/auth/logout", (req, res) => {
    res.clearCookie("session");
    res.json({ ok: true });
});

app.get("/auth/me", authMiddleware, (req, res) => {
    res.json({ user: req.user });
});

// Load board
app.get("/board", authMiddleware, (req, res) => {
    db.all(
        "SELECT * FROM lists WHERE user_id=? ORDER BY position",
        [req.user.id],
        (err, lists) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!lists) return res.json([]);

            const listIds = lists.map(l => l.id);
            if (!listIds.length) return res.json(lists.map(l => ({ ...l, cards: [] })));

            db.all(
                `SELECT * FROM cards WHERE list_id IN (${listIds.map(() => "?").join(",")})`,
                listIds,
                (err, cards) => {
                    if (err) return res.status(500).json({ error: err.message });
                    lists.forEach(l => {
                        l.cards = cards
                            .filter(c => c.list_id === l.id)
                            .sort((a, b) => a.position - b.position);
                    });
                    res.json(lists);
                }
            );
        }
    );
});

// Create list
app.post("/lists", authMiddleware, (req, res) => {
    db.run(
        "INSERT INTO lists (user_id, title, position) VALUES (?, ?, ?)",
        [req.user.id, req.body.title, Date.now()],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

// Add card
app.post("/cards", authMiddleware, (req, res) => {
    const { listId, text } = req.body;
    db.run(
        "INSERT INTO cards (list_id, text, position) VALUES (?, ?, ?)",
        [listId, text, Date.now()],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

// Reorder Lists
app.put("/lists/reorder", authMiddleware, (req, res) => {
    const { listIds } = req.body;
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        listIds.forEach((id, index) => {
            db.run("UPDATE lists SET position=? WHERE id=?", [index, id]);
        });
        db.run("COMMIT", (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ ok: true });
        });
    });
});

// Reorder Cards
app.put("/cards/reorder", authMiddleware, (req, res) => {
    const { cardIds } = req.body;
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        cardIds.forEach((id, index) => {
            db.run("UPDATE cards SET position=? WHERE id=?", [index, id]);
        });
        db.run("COMMIT", (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ ok: true });
        });
    });
});

// Update List
app.put("/lists/:id", authMiddleware, (req, res) => {
    const { title } = req.body;
    db.run(
        "UPDATE lists SET title=? WHERE id=?",
        [title, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ ok: true });
        }
    );
});

// Delete List
app.delete("/lists/:id", authMiddleware, (req, res) => {
    db.serialize(() => {
        db.run("DELETE FROM cards WHERE list_id=?", [req.params.id]);
        db.run("DELETE FROM lists WHERE id=?", [req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ ok: true });
        });
    });
});

// Update Card
app.put("/cards/:id", authMiddleware, (req, res) => {
    const { text } = req.body;
    db.run(
        "UPDATE cards SET text=? WHERE id=?",
        [text, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ ok: true });
        }
    );
});

// Delete Card
app.delete("/cards/:id", authMiddleware, (req, res) => {
    db.run("DELETE FROM cards WHERE id=?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ ok: true });
    });
});

// Move card
app.post("/cards/move", authMiddleware, (req, res) => {
    const { cardId, listId } = req.body;
    db.run(
        "UPDATE cards SET list_id=? WHERE id=?",
        [listId, cardId],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ ok: true });
        }
    );
});

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
