import mongoose from "mongoose";

const SportsParticipationSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  numberOfMatches: {
    type: Number,
    required: true,
  },
  numberOfGamesWon: {
    type: Number,
    required: true,
  },
  numberOfGamesLost: {
    type: Number,
    required: true,
  },
});

const SportsParticipation = mongoose.model(
  "SportsParticipation",
  SportsParticipationSchema
);

export default SportsParticipation;
