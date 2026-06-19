import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    // store hashed OTP only (never plaintext)
    otpHash: {
      type: String,
      required: true,
    },

    // store pending user data until OTP is verified
    name: {
      type: String,
      required: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "patient",
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index created by Mongo (best-effort)
    },
  },
  { timestamps: true }
);

export default mongoose.model("OtpRegistration", otpSchema);
