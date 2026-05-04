import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        groupPic: { type: String, default: "" },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        // ID of the corresponding Stream Chat channel
        streamChannelId: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

groupSchema.index({ members: 1 });
groupSchema.index({ admin: 1 });

const Group = mongoose.model("Group", groupSchema);
export default Group;
