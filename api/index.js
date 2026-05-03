// Vercel serverless entry point.
// Vercel invokes this as a function handler — it never calls app.listen().
// We connect to MongoDB once per cold start and then delegate every request to Express.
import app from '../backend/src/server.js';
import { connectDB } from '../backend/src/lib/db.js';

let isDbConnected = false;

export default async function handler(req, res) {
    if (!isDbConnected) {
        await connectDB();
        isDbConnected = true;
    }
    return app(req, res);
}
