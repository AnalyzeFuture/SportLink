import express from "express";
import { createPost, deletePost, getPost, likeUnlikePost, replyToPost,getFeedPosts} from "../controllers/postConteroller.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

router.get("/:id",getPost);
router.get("/feed/:feed",protectRoute,getFeedPosts);
router.post("/create",protectRoute , createPost)
router.delete("/:id",protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/reply/:id", protectRoute, replyToPost); 
export default router;
