import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
} from "../controllers/postConteroller.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

router.get("/getallposts", getAllPosts);
router.get("/feed/:feed", protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);
export default router;
