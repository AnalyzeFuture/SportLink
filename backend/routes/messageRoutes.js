import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { sendMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", protectRoute, sendMessage);
router.get("/:otheruserId", protectRoute, getMessages);

export default router;
