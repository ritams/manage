import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(fileURLToPath(import.meta.url), '../../.env') });

import { initDB } from "./models/db.js";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";

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

app.use("/auth", authRoutes);
app.use("/", boardRoutes);

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
