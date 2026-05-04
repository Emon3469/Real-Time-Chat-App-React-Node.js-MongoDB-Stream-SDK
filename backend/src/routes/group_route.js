import express from "express";
import { protectRoute } from "../middleware/auth_middleware.js";
import {
    createGroup,
    getMyGroups,
    getGroupById,
    addMember,
    leaveGroup,
    deleteGroup,
} from "../controllers/group_controller.js";

const router = express.Router();

router.use(protectRoute);

router.post("/", createGroup);
router.get("/", getMyGroups);
router.get("/:id", getGroupById);
router.post("/:id/members", addMember);
router.delete("/:id/members", leaveGroup);
router.delete("/:id", deleteGroup);

export default router;
