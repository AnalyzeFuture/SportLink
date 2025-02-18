import express from "express";
import { getQuery } from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/getQuery", getQuery);

export default router;
