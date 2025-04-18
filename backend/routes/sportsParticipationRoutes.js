import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, "sportsParticipation");

    if (!user || !user.sportsParticipation) {
      return res.status(404).json([]);
    }

    res.json(user.sportsParticipation);
  } catch (err) {
    console.error("Error fetching sportsParticipation:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
