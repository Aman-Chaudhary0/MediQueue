import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    // Doctor reference
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // Day of week (0 = Sunday, 6 = Saturday)
    dayOfWeek: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6],
      required: true,
    },

    // Is this day available
    isAvailable: {
      type: Boolean,
      default: true,
    },

    // Start time (e.g., "9:00 AM")
    startTime: {
      type: String,
      required: true,
    },

    // End time (e.g., "5:00 PM")
    endTime: {
      type: String,
      required: true,
    },

    // Break times
    breaks: [
      {
        startTime: String,
        endTime: String,
      },
    ],

    // Maximum patients per day
    maxPatientsPerDay: {
      type: Number,
      default: 20,
    },

    // Consultation duration in minutes
    slotDuration: {
      type: Number,
      default: 30,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate schedules per doctor per day
scheduleSchema.index({ doctor: 1, dayOfWeek: 1 }, { unique: true });

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
