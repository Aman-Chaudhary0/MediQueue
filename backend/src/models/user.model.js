import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "patient",
    },

    // Admin profile fields (optional; doctors/patients can ignore)
    phone: {
      type: String,
      default: "",
    },

    hospital: {
      type: String,
      default: "",
    },

    // store image URL (ImageKit URL or any hosted URL)
    profilePic: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
