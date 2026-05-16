import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // References
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // Appointment Details
    appointmentDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    // Status
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },

    // Token number for queue
    tokenNumber: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);

export default Appointment;
