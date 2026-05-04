import "dotenv/config";
import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async (userData) => {
    try{
        await streamClient.upsertUsers([userData]);
        return userData;
    }
    catch(error){
        console.error("Error upserting Stream user:", error);
        throw error;
    }
};

export const generateStreamToken = (userId) => {
    try{
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    }
    catch(error){
        console.error("Error generating Stream token:", error);
        throw error;
    }
};

export const createGroupChannel = async (channelId, name, memberIds, creatorId) => {
    const channel = streamClient.channel("messaging", channelId, {
        name,
        members: memberIds.map(String),
        created_by_id: creatorId.toString(),
    });
    await channel.create();
    return channel;
};

export const deleteGroupChannel = async (channelId) => {
    try {
        const channel = streamClient.channel("messaging", channelId);
        await channel.delete();
    } catch (err) {
        console.error("Error deleting Stream channel:", err.message);
    }
};

export const addMemberToChannel = async (channelId, userId) => {
    const channel = streamClient.channel("messaging", channelId);
    await channel.addMembers([userId.toString()]);
};

export const removeMemberFromChannel = async (channelId, userId) => {
    const channel = streamClient.channel("messaging", channelId);
    await channel.removeMembers([userId.toString()]);
};