import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false, // Disable mongoose buffering
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain a minimum of 5 socket connections
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch(error){
        console.log("Error in connecting to MongoDB", error);
        process.exit(1);
    }
}