import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function verify() {
    console.log("Verifying Security Headers...");
    try {
        const res = await fetch(`${BASE_URL}/`);
        const limit = res.headers.get('x-ratelimit-limit');
        const remaining = res.headers.get('x-ratelimit-remaining');

        console.log(`X-RateLimit-Limit: ${limit}`);
        console.log(`X-RateLimit-Remaining: ${remaining}`);

        if (limit && remaining) {
            console.log("✅ Rate Limiting is active.");
        } else {
            console.error("❌ Rate Limiting headers missing.");
        }
    } catch (e) {
        console.error("Connection failed:", e.message);
    }
}

verify();
