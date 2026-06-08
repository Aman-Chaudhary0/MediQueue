import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
      index: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor is required"],
      index: true,
    },

    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
      index: true,
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

    reason: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },

    notes: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "completed", "cancelled", "no-show"],
        message: "Status must be pending, confirmed, completed, cancelled, or no-show",
      },
      default: "pending",
      index: true,
    },

    tokenNumber: {
      type: String,
      default: null,
    },

    // Cancellation
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Cancellation reason cannot exceed 500 characters"],
    },
    cancelledBy: {
      type: String,
      enum: ["patient", "doctor", "admin", null],
      default: null,
    },
    // Refund: tracks whether a refund is applicable/issued
    refundStatus: {
      type: String,
      enum: ["not_applicable", "pending", "issued", "rejected"],
      default: "not_applicable",
    },

    // Rescheduling
    rescheduledFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    rescheduledAt: {
      type: Date,
      default: null,
    },

    // No-show
    noShow: {
      type: Boolean,
      default: false,
    },
    noShowMarkedAt: {
      type: Date,
      default: null,
    },

    // Reminder
    reminderSentAt: {
      type: Date,
      default: null,
    },

    // Rating & Review (patient submits after completion)
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      default: null,
    },
    review: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "Review cannot exceed 1000 characters"],
    },
    reviewSubmittedAt: {
      type: Date,
      default: null,
    },

    // Consultation Notes
    consultationNotes: {
      type: String,
      trim: true,
      default: "",
      maxlength: [2000, "Consultation notes cannot exceed 2000 characters"],
    },

    diagnosis: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "Diagnosis cannot exceed 1000 characters"],
    },

    prescription: {
      type: String,
      trim: true,
      default: "",
      maxlength: [2000, "Prescription cannot exceed 2000 characters"],
    },

    followUpRequired: {
      type: Boolean,
      default: false,
    },

    followUpNotes: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "Follow-up notes cannot exceed 1000 characters"],
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ patient: 1, appointmentDate: -1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
