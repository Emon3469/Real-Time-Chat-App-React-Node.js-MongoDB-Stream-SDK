import express from "express";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import authRoutes from "./routes/auth_route.js";
import userRoutes from "./routes/user_route.js";
import chatRoutes from "./routes/chat_route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Correct __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS: use FRONTEND_URL env var so any deployment target works
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",")
    : process.env.NODE_ENV === "production"
        ? ["https://chat-app-frontend.onrender.com"]
        : ["http://localhost:5173", "http://localhost:5174"];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(compression()); // gzip all responses — reduces payload by 60-80%
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.get("/health", (req, res) => {
    const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: dbStates[mongoose.connection.readyState] || "unknown",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// Serve frontend static build only when running as a monolith (Render single-service).
// Skip when FRONTEND_URL is set (frontend deployed on Netlify/Vercel separately)
// or when running as a Vercel serverless function.
if (process.env.NODE_ENV === "production" && !process.env.VERCEL && !process.env.FRONTEND_URL) {
    app.use(express.static(path.join(__dirname, "../../frontend/chat_app_fronend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../frontend/chat_app_fronend/dist/index.html"));
    });
}

// 404 handler — must come before error handler
app.use("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global error handler — must be last (4-parameter signature required by Express)
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === "production" ? {} : err.message,
    });
});

// Start the HTTP server only when NOT running as a Vercel serverless function.
// Vercel manages its own HTTP layer and calls the exported app handler directly.
if (!process.env.VERCEL) {
    connectDB()
        .catch((err) => {
            // DB failed after all retries. Log it but DO NOT exit — keeping the
            // process alive means Render won't crash-loop, the /health endpoint
            // stays reachable (so UptimeRobot keeps the service warm), and API
            // routes return a clean 500 instead of a connection-refused error.
            console.error("MongoDB connection failed — server will start without DB:", err.message);
            console.error("Fix: allow 0.0.0.0/0 in MongoDB Atlas → Network Access.");
        })
        .finally(() => {
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        });
}

export default app;
