import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
} from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser); //id is going to be of the user to be followed/unfollowed
router.post("/update/:id", protectRoute, updateUser);

export default router;
