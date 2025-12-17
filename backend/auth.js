import fetch from "node-fetch";
import jwt from "jsonwebtoken";

export async function verifyGoogleToken(token) {
    const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
    console.log("Verifying token against Client ID:", GOOGLE_CLIENT_ID);

    const res = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );
    const data = await res.json();
    console.log("Google Token Info Response:", JSON.stringify(data).substring(0, 100) + "..."); // Log first 100 chars

    if (data.error) throw new Error("Google Error: " + data.error_description);
    if (data.aud !== GOOGLE_CLIENT_ID) {
        console.error(`Token aud (${data.aud}) does not match env (${GOOGLE_CLIENT_ID})`);
        throw new Error("Invalid token audience");
    }
    return data;
}

export function authMiddleware(req, res, next) {
    const JWT_SECRET = process.env.JWT_SECRET;
    try {
        const token = req.cookies.session;
        if (!token) throw new Error("No token");
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        // console.log("Auth success for:", req.user.email);
        next();
    } catch (e) {
        console.error("Auth failed:", e.message);
        res.status(401).json({ error: "Unauthorized" });
    }
}

export const generateSession = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    return jwt.sign({ id: user.sub, name: user.name, picture: user.picture }, JWT_SECRET);
};
