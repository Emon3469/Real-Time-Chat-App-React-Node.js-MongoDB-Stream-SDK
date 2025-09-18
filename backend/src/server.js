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
const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? ["https://your-frontend-domain.vercel.app", "https://your-frontend-domain.onrender.com"]
        : "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
    connectDB();
})