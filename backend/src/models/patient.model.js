import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
      index: true,
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
      max: [150, "Age cannot exceed 150"],
      default: 0,
    },

    mobileNo: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      default: "",
    },

    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be male, female, or other",
      },
      required: [true, "Gender is required"],
      default: "other",
    },

    profilepic: {
      type: String,
      default: "",
    },

    medicalHistory: {
      type: String,
      trim: true,
      default: "",
      maxlength: [2000, "Medical history cannot exceed 2000 characters"],
    },

    allergies: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Allergies cannot exceed 500 characters"],
    },

    currentMedications: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Current medications cannot exceed 500 characters"],
    },

    emergencyContact: {
      name: { type: String, trim: true, default: "" },
      relationship: { type: String, trim: true, default: "" },
      phone: { type: String, trim: true, default: "" },
    },

    insuranceDetails: {
      provider: { type: String, trim: true, default: "" },
      policyNumber: { type: String, trim: true, default: "" },
      groupNumber: { type: String, trim: true, default: "" },
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
