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
      default: "N/A"
    },

    mobileNo: {
      type: String,
      required: true,
      default: "N/A"
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
      default: "other"
    },

    profilepic: {
      type: String,
      required: true,
      default: "https://via.placeholder.com/100"
    },

    medicalHistory: {
      type: String,
      default: ""
    },

    allergies: {
      type: String,
      default: ""
    },

    currentMedications: {
      type: String,
      default: ""
    },

    emergencyContact: {
      name: {
        type: String,
        default: ""
      },
      relationship: {
        type: String,
        default: ""
      },
      phone: {
        type: String,
        default: ""
      }
    },

    insuranceDetails: {
      provider: {
        type: String,
        default: ""
      },
      policyNumber: {
        type: String,
        default: ""
      },
      groupNumber: {
        type: String,
        default: ""
      }
    }
  },
  { timestamps: true }
);

const Patient = mongoose.model(
  "Patient",
  patientSchema
);

export default Patient;
