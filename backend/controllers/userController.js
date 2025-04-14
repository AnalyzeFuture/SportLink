import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Post from "../models/postModel.js";

//user controller updated
const getUserProfile = async (req, res) => {
  //query is either username or userid

  const { query } = req.params;

  try {
    let user;

    if (mongoose.Types.ObjectId.isValid(query)) {
      //if query is Id
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      //if query is username
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }
    if (!user) return res.status(400).json({ error: "User not found" });
    // console.log("getuserprofile : ", user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getUserProfile: ", err.message);
  }
};

const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    console.log("user info inside signup: ", name);
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in signupUser", err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log("user info inside signup: ", req.body);
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: "Invalid username or password" });

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in loginuser", error.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in signupUser", err.message);
  }
};

const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    // console.log(id, " ", req.user._id.toString());

    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in followUnfollowUser: ", err.message);
  }
};

const updateUser = async (req, res) => {
  const {
    name,
    email,
    username,
    password,
    bio,
    lovedSport,
    experience,
    currentLevel,
    district,
    state,
    sportsParticipation,
  } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;

  console.log("updateUser: ", req.body);
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You cannot update another user's profile" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    user.lovedSport = lovedSport || user.lovedSport;
    user.experience = experience || user.experience;
    user.district = district || user.district;
    user.state = state || user.state;

    // Only update currentLevel if it is provided, otherwise leave it unchanged
    if (currentLevel !== undefined) {
      user.currentLevel = currentLevel || null; // Set to null if empty
    }
    if (sportsParticipation) {
      user.sportsParticipation = [
        ...user.sportsParticipation,
        ...sportsParticipation,
      ]; // Replace the participation data
    }

    user = await user.save();

    user.password = null;
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updateUser: ", err.message);
  }
};

const deleteSportsParticipation = async (req, res) => {
  const userId = req.user._id;
  const { participationId } = req.params; // Get the participation record ID from the request params
  console.log(
    "deleteSportsParticipation: userId: ",
    userId,
    " participationId: ",
    participationId
  );
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Filter out the record with the given ID
    user.sportsParticipation = user.sportsParticipation.filter(
      (record) => record._id.toString() !== participationId
    );

    await user.save();
    res.status(200).json({
      message: "Participation record deleted successfully",
      data: user.sportsParticipation,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in deleteSportsParticipation: ", err.message);
  }
};

const getUsersWithSameLovedSport = async (req, res) => {
  const userId = req.user._id;

  try {
    // Find the logged-in user
    const loggedInUser = await User.findById(userId);
    if (!loggedInUser) return res.status(404).json({ error: "User not found" });

    const { lovedSport } = loggedInUser;

    // Find users with the same lovedSport
    const users = await User.find({ lovedSport, _id: { $ne: userId } }).select(
      "lovedSport currentLevel district state sportsParticipation"
    );

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ error: "No users found with the same loved sport" });
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getUsersWithSameLovedSport: ", err.message);
  }
};

const searchUsers = async (req, res) => {
  try {
    const searchText = req.body.searchText;
    console.log("searchUser searchText: ", req.body.searchText);

    const query = {
      $or: [
        { name: { $regex: searchText, $options: "i" } },
        { username: { $regex: searchText, $options: "i" } },
      ],
    };
    const result = await User.find(query)
      .select("username profilePic followers")
      .limit(25);

    if (!result || result.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in searchUsers: ", err.message);
  }
};

const addSportsParticipation = async (req, res) => {
  const userId = req.user._id;
  const { year, numberOfCompetitions, numberOfGamesWon, level } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.sportsParticipation.push({
      year,
      numberOfCompetitions,
      numberOfGamesWon,
      level,
    });

    await user.save();
    res.status(200).json({
      message: "Participation added successfully",
      data: user.sportsParticipation,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in addSportsParticipation: ", err.message);
  }
};

export {
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
};
