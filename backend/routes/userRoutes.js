import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
  searchUsers,
  addSportsParticipation,
  deleteSportsParticipation,
  getUsersWithSameLovedSport,
} from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";
//updated routes
const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/same-loved-sport", protectRoute, getUsersWithSameLovedSport);
router.post("/search", searchUsers);
router.post("/signup", signupUser); //signup route
router.post("/login", loginUser); // login route
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser); //id is going to be of the user to be followed/unfollowed
router.put("/update/:id", protectRoute, updateUser); // Update user profile
router.post("/updateProfile/:id", protectRoute, addSportsParticipation); // Add sports participation data
router.delete(
  "/participation/:participationId",
  protectRoute,
  deleteSportsParticipation
);
export default router;
