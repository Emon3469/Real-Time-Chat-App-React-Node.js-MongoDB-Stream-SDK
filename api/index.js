// Vercel serverless entry point.
import app from '../backend/src/server.js';
import { connectDB } from '../backend/src/lib/db.js';

let isDbConnected = false;

export default async function handler(req, res) {
    if (!isDbConnected) {
        try {
            await connectDB();
            isDbConnected = true;
        } catch (err) {
            // DB failed — still handle the request so Vercel returns a clean error
            // instead of a function crash. API routes that need DB return 500.
            console.error("DB connection failed in Vercel handler:", err.message);
        }
    }
    return app(req, res);
}
