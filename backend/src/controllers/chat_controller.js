import { generateStreamToken } from "../lib/stream.js";

// In-memory token cache — avoids regenerating a token on every page visit.
// Key: userId string  Value: { token, expiresAt }
// Stream tokens are valid for 24h by default; we cache for 50 min to be safe.
const TOKEN_TTL_MS = 50 * 60 * 1000;
const tokenCache = new Map();

export async function getStreamToken(req, res) {
    try {
        const userId = req.user.id;

        const cached = tokenCache.get(userId);
        if (cached && cached.expiresAt > Date.now()) {
            return res.status(200).json({ token: cached.token });
        }

        const token = generateStreamToken(userId);
        tokenCache.set(userId, { token, expiresAt: Date.now() + TOKEN_TTL_MS });

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error in getStreamToken controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
