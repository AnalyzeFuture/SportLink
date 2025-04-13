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
        "School/Interschool Level",
        "College/Intercollege Level",
        "Club Level",
        "District Level",
        "State Level",
        "Nation Level",
        "International Level",
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
        numberOfCompetitions: Number,
        numberOfGamesWon: Number,
        level: {
          type: String,
          enum: ["District", "State", "National", "International"],
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
