# Deployment Troubleshooting & Lessons Learned

This document records the specific issues encountered during the initial deployment of the Manage App to AWS EC2 and how they were resolved.

## 1. Frontend "Mixed Content" / Connection Refused
**Symptoms:**
*   Login button did nothing.
*   Browser Console showed errors trying to connect to `http://localhost:3000`.

**The Problem:**
The frontend code was hardcoded (or defaulting) to `localhost:3000` for API calls. Even on the server, the browser was trying to talk to the user's *local* machine.

**The Fix:**
Updated `frontend/src/lib/api.js` to dynamically detect the environment:
```javascript
// BEFORE
const API_URL = "http://localhost:3000";

// AFTER
const API_URL = window.location.hostname === 'localhost' ? "http://localhost:3000" : "/api";
```
*   **Prevention**: Always use relative paths (like `/api`) in production builds so the browser automatically talks to the same domain it is visiting.

---

## 2. Backend CORS Error
**Symptoms:**
*   Network tab showed valid requests but Status `CORS Error`.
*   Backend logs showed no activity (blocked before processing).

**The Problem:**
The `server.js` was configured to only accept requests from `http://localhost:5173`. When the request came from `https://manage.ritampal.com`, the browser rejected the response for security reasons.

**The Fix:**
Updated `cors` options in `backend/server.js`:
```javascript
app.use(cors({
    origin: ["http://localhost:5173", "https://manage.ritampal.com"],
    ...
}));
```
*   **Prevention**: Add production domains to the CORS allowlist immediately upon deployment.

---

## 3. The "Silent Failure" (Missing Environment Variables)
**Symptoms:**
*   Login returned `401 Unauthorized`.
*   Backend logs showed "Auth failed" even with valid Google Tokens.

**The Problem:**
The `server.js` was looking for `.env` in `../../.env` (two folders up), which is the structure in local development. On the server, we placed the `.env` directly in the `backend/` folder. The app couldn't find the Google Client ID.

**The Fix:**
Updated `server.js` loading logic to be smarter:
```javascript
// Try current folder first (Production)
dotenv.config(); 
// Fallback to root (Local Dev)
dotenv.config({ path: path.resolve(..., '../../.env') });
```
*   **Prevention**: verify `process.env` values on server startup (e.g., `console.log("Loaded Client ID:", process.env.CLIENT_ID ? "Yes" : "No")`).

---

## 4. Nginx "Route Shadowing" (404 / 401 Errors)
**Symptoms:**
*   `/api/auth/google` returned 401.
*   `/api/board` returned 404.

**The Problem:**
Nginx was configured to proxy `/api` requests to the backend, but it passed the *full path* (including `/api`) to the Node app.
*   The Backend Router expects `/auth` and `/board`.
*   It received `/api/auth` and `/api/board`.
*   Because no route matched `/api/auth`, it fell through to the `/` route (Board Routes), which requires Login, triggering a 401 before the Auth Logic could even run.

**The Fix:**
Instead of fighting Nginx configuration (which can be tricky), we updated `server.js` to explicitly route the `/api` prefixed paths:
```javascript
app.use("/api/auth", authRoutes); // Catches /api/auth
app.use("/auth", authRoutes);     // Catches /auth (local)

app.use("/api", boardRoutes);     // Catches /api/board
app.use("/", boardRoutes);        // Catches /board (local)
```

**Prevention**: When using Nginx as a Reverse Proxy, assume it might pass the full path. Structure Express routes to handle the storage prefix (`/api`) explicitly.

---

## 5. AWS Security Group Block
**Symptoms:**
*   Website reachable on `http://` but timed out on `https://` immediately after enabling SSL.

**The Problem:**
AWS EC2 instances reject all traffic on Port 443 (HTTPS) by default unless explicitly allowed.

**The Fix:**
*   Added Inbound Rule for Port 443 (0.0.0.0/0) in AWS Security Groups.
