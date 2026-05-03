import mongoose from "mongoose";

const RETRY_DELAYS = [3000, 5000, 10000]; // 3 attempts: wait 3s, 5s, 10s

export const connectDB = async () => {
    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 8000,
                socketTimeoutMS: 45000,
                bufferCommands: false,
                maxPoolSize: 10,
                minPoolSize: 2,
                maxIdleTimeMS: 30000,
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return; // success
        } catch (error) {
            const isLast = attempt === RETRY_DELAYS.length;
            if (isLast) {
                // Throw so server.js can decide — no process.exit here.
                // Exiting would cause Render to crash-loop the service.
                throw error;
            }
            const delay = RETRY_DELAYS[attempt];
            console.error(`MongoDB connection failed (attempt ${attempt + 1}): ${error.message}`);
            console.log(`Retrying in ${delay / 1000}s...`);
            await new Promise((res) => setTimeout(res, delay));
        }
    }
};
