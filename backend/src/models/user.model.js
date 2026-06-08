import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    role: {
      type: String,
      enum: {
        values: ["admin", "doctor", "patient"],
        message: "Role must be admin, doctor, or patient",
      },
      default: "patient",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    hospital: {
      type: String,
      trim: true,
      default: "",
    },

    profilePic: {
      type: String,
      default: null,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
      min: [0, "Cannot be negative"],
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    suspiciousActivityCount: {
      type: Number,
      default: 0,
      min: [0, "Cannot be negative"],
    },

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpiresAt: {
      type: Date,
      default: null,
    },

    refreshTokenHash: {
      type: String,
      default: null,
    },

    refreshTokenExpiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
