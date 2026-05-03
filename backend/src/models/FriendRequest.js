import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for the two most common query patterns
friendRequestSchema.index({ recipient: 1, status: 1 }); // getFriendRequests (incoming)
friendRequestSchema.index({ sender: 1, status: 1 });    // getOutgoingFriendReqs + duplicate check

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;
