import { randomUUID } from "crypto";
import Group from "../models/Group.js";
import User from "../models/User.js";
import {
    createGroupChannel,
    deleteGroupChannel,
    addMemberToChannel,
    removeMemberFromChannel,
} from "../lib/stream.js";

export async function createGroup(req, res) {
    try {
        const adminId = req.user._id.toString();
        const { name, description, memberIds = [] } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ message: "Group name is required" });
        }

        // Only allow friends of the admin to be added
        const adminUser = await User.findById(adminId).select("friends");
        const friendSet = new Set(adminUser.friends.map((f) => f.toString()));
        const validMembers = memberIds.filter((id) => friendSet.has(id));

        // Always include admin; deduplicate
        const allMemberIds = [...new Set([adminId, ...validMembers])];

        if (allMemberIds.length < 2) {
            return res.status(400).json({
                message: "Add at least one friend to create a group",
            });
        }

        const streamChannelId = `grp${randomUUID().replace(/-/g, "")}`;

        const group = await Group.create({
            name: name.trim(),
            description: description?.trim() || "",
            members: allMemberIds,
            admin: adminId,
            streamChannelId,
        });

        // Create the Stream channel with all members
        await createGroupChannel(streamChannelId, name.trim(), allMemberIds, adminId);

        const populated = await Group.findById(group._id)
            .populate("members", "fullName profilePic username")
            .populate("admin", "fullName profilePic username");

        res.status(201).json(populated);
    } catch (error) {
        console.error("createGroup error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyGroups(req, res) {
    try {
        const groups = await Group.find({ members: req.user._id })
            .populate("members", "fullName profilePic username")
            .populate("admin", "fullName profilePic username")
            .sort({ updatedAt: -1 });

        res.status(200).json(groups);
    } catch (error) {
        console.error("getMyGroups error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getGroupById(req, res) {
    try {
        const { id: groupId } = req.params;
        const userId = req.user._id.toString();

        const group = await Group.findById(groupId)
            .populate("members", "fullName profilePic username bio")
            .populate("admin", "fullName profilePic username");

        if (!group) return res.status(404).json({ message: "Group not found" });

        const isMember = group.members.some((m) => m._id.toString() === userId);
        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this group" });
        }

        res.status(200).json(group);
    } catch (error) {
        console.error("getGroupById error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function addMember(req, res) {
    try {
        const { id: groupId } = req.params;
        const { userId } = req.body;
        const requesterId = req.user._id.toString();

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.admin.toString() !== requesterId) {
            return res.status(403).json({ message: "Only the group admin can add members" });
        }

        if (group.members.some((m) => m.toString() === userId)) {
            return res.status(400).json({ message: "User is already a member" });
        }

        group.members.push(userId);
        await group.save();
        await addMemberToChannel(group.streamChannelId, userId);

        res.status(200).json({ message: "Member added" });
    } catch (error) {
        console.error("addMember error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function leaveGroup(req, res) {
    try {
        const { id: groupId } = req.params;
        const userId = req.user._id.toString();

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        const isMember = group.members.some((m) => m.toString() === userId);
        if (!isMember) {
            return res.status(400).json({ message: "You are not in this group" });
        }

        const remaining = group.members.filter((m) => m.toString() !== userId);

        if (remaining.length === 0) {
            // Last member left — clean up entirely
            await deleteGroupChannel(group.streamChannelId);
            await Group.findByIdAndDelete(groupId);
            return res.status(200).json({ message: "Group deleted (no members left)" });
        }

        // Transfer admin if the admin is leaving
        if (group.admin.toString() === userId) {
            group.admin = remaining[0];
        }

        group.members = remaining;
        await group.save();
        await removeMemberFromChannel(group.streamChannelId, userId);

        res.status(200).json({ message: "Left group successfully" });
    } catch (error) {
        console.error("leaveGroup error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteGroup(req, res) {
    try {
        const { id: groupId } = req.params;
        const userId = req.user._id.toString();

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.admin.toString() !== userId) {
            return res.status(403).json({ message: "Only the admin can delete the group" });
        }

        await deleteGroupChannel(group.streamChannelId);
        await Group.findByIdAndDelete(groupId);

        res.status(200).json({ message: "Group deleted" });
    } catch (error) {
        console.error("deleteGroup error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
