import { atom } from "recoil";

const userAtom = atom({
  key: "userAtom",
  default: JSON.parse(localStorage.getItem("userInfo")) || {
    name: "",
    username: "",
    email: "",
    bio: "",
    profilePic: "",
    lovedSport: "",
    experience: "",
    achievements: "",
    bmi: "",
    preferredTime: "",
    sportsParticipation: [],
    followers: [],
    following: [],
  },
});

export default userAtom;
