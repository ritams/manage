import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// Try loading .env from current directory (Production/Standard)
dotenv.config();
// Also try loading from root (Local Dev compatibility)
dotenv.config({ path: path.resolve(fileURLToPath(import.meta.url), '../../.env') });

import { initDB } from "./models/db.js";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

import helmet from "helmet";

const app = express();
const PORT = 3000;

app.use(helmet()); // Security headers
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors({
    origin: ["http://localhost:5173", "https://manage.ritampal.com"], // Restrict to known frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Rate Limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-7',
    legacyHeaders: true,
});
app.use(limiter);

app.use(express.json({ limit: '10kb' })); // Body limit

// Initialize DB
initDB();

// Request logging middleware
app.use((req, res, next) => {
    // SECURITY: Do NOT log req.body to prevent sensitive data leaks (passwords, tokens)
    console.log(`REQ: ${req.method} ${req.url}`);
    next();
});

/* ================== ROUTES ================== */

// Helper to mount routes at both /api/X and /X
const mountRoutes = (path, route) => {
    app.use(`/api${path}`, route);
    app.use(path, route);
};

mountRoutes("/auth", authRoutes);
mountRoutes("/boards", boardRoutes);
mountRoutes("/lists", listRoutes);
mountRoutes("/cards", cardRoutes);
mountRoutes("/tags", tagRoutes);

// Error Handler Middleware (Must be last)
app.use(errorHandler);

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
