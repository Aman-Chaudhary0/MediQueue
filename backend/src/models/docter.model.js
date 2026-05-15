import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    // Relation with User model
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Professional Information

    specialization: {
      type: String,
      required: false,
      default: "",
      example: "Cardiologist, Neurologist, Pediatrician",
    },

    department: {
      type: String,
      required: false,
      default: "",
      example: "Cardiology, Neurology, Pediatrics",
    },

    experience: {
      type: Number,
      required: false,
      default: 0,
      description: "Years of experience",
    },

    qualifications: {
      type: [String],
      default: [],
      example: ["MBBS", "MD"],
    },


    // Contact Information
    mobileNo: {
      type: String,
      required: false,
      default: "",
    },

    // Hospital/Clinic
    hospital: {
      type: String,
      required: false,
      default: "",
    },

    // Consultation Fee
    consultationFee: {
      type: Number,
      required: false,
      default: 0,
      description: "Fee in currency units",
    },

    // Profile
    profilePic: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      default: "",
    },

    // Status
    status: {
      type: String,
      enum: ["active", "inactive", "on-leave"],
      default: "active",
    },

    // Availability
    isAvailable: {
      type: Boolean,
      default: true,
    },


    // Appointment count
    totalAppointments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
