import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    followers: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      dafault: "",
    },
    currentLevel: {
      type: String,
      enum: [
        "Intra-District Level",
        "Inter-District Level",
        "Inter-State Level",
        "Inter-Nation Level",
        null,
      ],
      default: null,
    },
    district: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    sportsParticipation: [
      {
        year: Number,
        numberOfMatches: Number,
        numberOfGamesWon: Number,
        numberOfGamesLost: Number,
        level: {
          type: String,
          enum: [
            "Intra-District",
            "Inter-District",
            "Inter-State",
            "Inter-National",
          ],
        },
      },
    ],
    lovedSport: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
