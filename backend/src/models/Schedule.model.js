import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor reference is required"],
      index: true,
    },

    dayOfWeek: {
      type: Number,
      enum: {
        values: [0, 1, 2, 3, 4, 5, 6],
        message: "Day of week must be between 0 (Sunday) and 6 (Saturday)",
      },
      required: [true, "Day of week is required"],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    startTime: {
      type: String,
      required: [true, "Start time is required"],
      trim: true,
    },

    endTime: {
      type: String,
      required: [true, "End time is required"],
      trim: true,
    },

    breaks: [
      {
        startTime: { type: String, trim: true },
        endTime: { type: String, trim: true },
      },
    ],

    maxPatientsPerDay: {
      type: Number,
      default: 20,
      min: [1, "Must allow at least 1 patient per day"],
      max: [200, "Cannot exceed 200 patients per day"],
    },

    slotDuration: {
      type: Number,
      default: 30,
      min: [5, "Slot duration must be at least 5 minutes"],
      max: [120, "Slot duration cannot exceed 120 minutes"],
    },
  },
  { timestamps: true }
);

// Unique compound index: one schedule entry per doctor per day
scheduleSchema.index({ doctor: 1, dayOfWeek: 1 }, { unique: true });

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
