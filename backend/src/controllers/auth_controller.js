import "dotenv/config";
import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
    const {email, password, fullName} = req.body;

    try{
        if(!email || !password || !fullName){
            return res.status(400).json({message: "All fields are required"});
        }

        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 Characters"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid Email Format"});
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({message: "Email already exists, Please Use a different one"});
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        });

        try{
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic?.startsWith("data:") ? "" : newUser.profilePic || "",
            })
            console.log(`stream user created for ${newUser.fullName}`);
        }
        catch(error){
            console.log("Error creating Stream user:", error);
        }

        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res.cookie("jwt",token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(201).json({success: true, user: newUser});
    }
    catch(error){
        console.log("Error in signup controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}


export async function login(req , res) {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid email or password"});
        }

        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({message: "Invaild email or password"});
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res.cookie("jwt",token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({success: true, user});
    }
    catch(error){
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    } 
}

export function logout(req, res) {
    // clearCookie must use the same options that were used when the cookie was set,
    // otherwise the browser ignores the clear instruction (especially sameSite/secure in production)
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({success: true, message: "Logout Successfully"});
}

export async function onBoard(req, res) {
    try{
        const userId = req.user._id;

        const { fullName, username, bio, location, profilePic } = req.body;

        if(!fullName){
            return res.status(400).json({ message: "Full name is required" });
        }

        // Reject suspiciously large payloads (base64 images should be well under 1MB)
        if (profilePic && profilePic.length > 1_500_000) {
            return res.status(400).json({ message: "Profile picture is too large. Please use a smaller image." });
        }

        const updateData = {
            fullName,
            bio: bio || "",
            location: location || "",
            isOnboarded: true,
        };

        if (username) updateData.username = username.toLowerCase().replace(/\s+/g, "");
        if (profilePic) updateData.profilePic = profilePic;

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if(!updatedUser) {
            return res.status(404).json({message: "User not found"});
        }

        try{
            // Stream enforces a 5 KB limit on user data — never pass base64 strings.
            // If the pic is a URL keep it; base64 uploads are stored in MongoDB only.
            const streamImage = updatedUser.profilePic?.startsWith("data:")
                ? ""
                : updatedUser.profilePic || "";
           await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: streamImage,
            });
        }
        catch(streamError){
            console.log("Error updating Stream user during onboarding: ", streamError.message);
        }

        res.status(200).json({success: true, user: updatedUser});
    }
    catch(error){
        console.log("Onboarding error", error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

