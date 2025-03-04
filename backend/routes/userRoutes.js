import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
  searchUsers,
} from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";
//updated routes
const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.post("/search", searchUsers);
router.post("/signup", signupUser); //signup route
router.post("/login", loginUser); // login route
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser); //id is going to be of the user to be followed/unfollowed
router.put("/update/:id", protectRoute, updateUser);

export default router;
