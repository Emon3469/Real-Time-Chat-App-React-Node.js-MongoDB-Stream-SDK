import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth_route.js";
import userRoutes from "./routes/user_route.js";
import chatRoutes from "./routes/chat_route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";



import { connectDB } from "./lib/db.js";


const app = express();
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? ["https://chat-app-frontend.onrender.com"]
        : "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// For Vercel serverless deployment, we don't need static file serving
// as it's handled by the vercel.json configuration
if(process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    app.use(express.static(path.join(__dirname, "../frontend/chat_app_fronend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "chat_app_fronend", "dist", "index.html"));
    });
}

// For Vercel serverless functions, we need to export the app
if (process.env.VERCEL) {
    connectDB();
}

// Only listen when not in Vercel environment
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`);
        connectDB();
    });
}

// Export for Vercel serverless functions
export default app;