import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
      index: true,
    },

    specialization: {
      type: String,
      trim: true,
      default: "",
      maxlength: [100, "Specialization cannot exceed 100 characters"],
      index: true,
    },

    department: {
      type: String,
      trim: true,
      default: "",
      maxlength: [100, "Department cannot exceed 100 characters"],
    },

    experience: {
      type: Number,
      default: 0,
      min: [0, "Experience cannot be negative"],
      max: [60, "Experience cannot exceed 60 years"],
    },

    qualifications: {
      type: [String],
      default: [],
    },

    mobileNo: {
      type: String,
      trim: true,
      default: "",
    },

    hospital: {
      type: String,
      trim: true,
      default: "",
      maxlength: [200, "Hospital name cannot exceed 200 characters"],
    },

    consultationFee: {
      type: Number,
      default: 0,
      min: [0, "Consultation fee cannot be negative"],
    },

    profilePic: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
    },

    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "on-leave"],
        message: "Status must be active, inactive, or on-leave",
      },
      default: "active",
      index: true,
    },

    verificationStatus: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected", "suspended"],
        message: "Verification status must be pending, approved, rejected, or suspended",
      },
      default: "approved",
      index: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    totalAppointments: {
      type: Number,
      default: 0,
      min: [0, "Total appointments cannot be negative"],
    },
  },
  { timestamps: true }
);

// Compound index for filtering available approved doctors by specialization
doctorSchema.index({ specialization: 1, verificationStatus: 1, isAvailable: 1 });

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
