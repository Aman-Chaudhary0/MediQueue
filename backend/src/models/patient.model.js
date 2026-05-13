import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    // relation with user model
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    age: {
      type: String,
      required: true,
    },

    mobileNo: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    profilepic: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Patient = mongoose.model(
  "Patient",
  patientSchema
);

export default Patient;