import Schedule from "../models/Schedule.model.js";
import Doctor from "../models/docter.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  ConflictError,
  ValidationError,
  NotFoundError,
} from "../utils/errors.js";

// CREATE OR UPDATE DOCTOR SCHEDULE FOR A DAY
export const setDoctorSchedule = asyncHandler(async (req, res) => {
  const { dayOfWeek, isAvailable, startTime, endTime, breaks = [], maxPatientsPerDay = 20, slotDuration = 30 } = req.body;

  // Validation
  if (dayOfWeek === undefined || dayOfWeek === null) {
    throw new ValidationError("Day of week is required (0-6)");
  }

  if (dayOfWeek < 0 || dayOfWeek > 6) {
    throw new ValidationError("Day of week must be between 0 and 6");
  }

  // Get doctor
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    throw new NotFoundError("Doctor profile not found. Please contact admin to setup your profile.");
  }

  let schedule = await Schedule.findOne({ doctor: doctor._id, dayOfWeek });

  if (schedule) {
    // Update existing schedule
    schedule.isAvailable = isAvailable;
    if (isAvailable) {
      schedule.startTime = startTime || schedule.startTime;
      schedule.endTime = endTime || schedule.endTime;
      schedule.breaks = breaks;
      schedule.maxPatientsPerDay = maxPatientsPerDay;
      schedule.slotDuration = slotDuration;
    }
    await schedule.save();
  } else {
    // Create new schedule
    if (isAvailable && (!startTime || !endTime)) {
      throw new ValidationError("Start time and end time are required for available days");
    }

    schedule = await Schedule.create({
      doctor: doctor._id,
      dayOfWeek,
      isAvailable,
      startTime: startTime || "9:00 AM",
      endTime: endTime || "5:00 PM",
      breaks,
      maxPatientsPerDay,
      slotDuration,
    });
  }

  res.status(200).json({
    success: true,
    message: "Schedule updated successfully",
    schedule,
  });
});

// GET DOCTOR SCHEDULE
export const getDoctorSchedule = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });

  if (!doctor) {
    throw new NotFoundError("Doctor profile not found");
  }

  const schedules = await Schedule.find({ doctor: doctor._id }).sort("dayOfWeek");

  // If no schedules exist, create default ones
  if (schedules.length === 0) {
    const defaultSchedules = [];
    for (let day = 1; day <= 5; day++) {
      // Mon to Fri
      const schedule = await Schedule.create({
        doctor: doctor._id,
        dayOfWeek: day,
        isAvailable: true,
        startTime: "9:00 AM",
        endTime: "5:00 PM",
        breaks: [{ startTime: "1:00 PM", endTime: "2:00 PM" }],
        maxPatientsPerDay: 20,
        slotDuration: 30,
      });
      defaultSchedules.push(schedule);
    }

    // Weekends unavailable
    for (let day of [0, 6]) {
      const schedule = await Schedule.create({
        doctor: doctor._id,
        dayOfWeek: day,
        isAvailable: false,
        startTime: "9:00 AM",
        endTime: "5:00 PM",
      });
      defaultSchedules.push(schedule);
    }

    return res.status(200).json({
      success: true,
      message: "Default schedule created",
      schedules: defaultSchedules.sort((a, b) => a.dayOfWeek - b.dayOfWeek),
    });
  }

  res.status(200).json({
    success: true,
    schedules,
  });
});

// GET SCHEDULE FOR ALL DAYS
export const getFullWeekSchedule = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new NotFoundError("Doctor not found");
  }

  const schedules = await Schedule.find({ doctor: doctorId }).sort("dayOfWeek");

  res.status(200).json({
    success: true,
    schedules,
  });
});

// UPDATE DOCTOR CONSULTATION FEE
export const updateConsultationFee = asyncHandler(async (req, res) => {
  const { consultationFee } = req.body;

  if (consultationFee === undefined || consultationFee === null || Number(consultationFee) < 0) {
    throw new ValidationError("Valid consultation fee is required");
  }

  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    throw new NotFoundError("Doctor profile not found");
  }

  doctor.consultationFee = Number(consultationFee);
  await doctor.save();

  res.status(200).json({
    success: true,
    message: "Consultation fee updated successfully",
    doctor,
  });
});

// GET DOCTOR CONSULTATION FEE
export const getConsultationFee = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new NotFoundError("Doctor not found");
  }

  res.status(200).json({
    success: true,
    consultationFee: doctor.consultationFee,
  });
});

// UPDATE DOCTOR AVAILABILITY STATUS
export const updateDoctorAvailability = asyncHandler(async (req, res) => {
  const { isAvailable } = req.body;

  if (typeof isAvailable !== "boolean") {
    throw new ValidationError("isAvailable must be a boolean");
  }

  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    throw new NotFoundError("Doctor profile not found");
  }

  doctor.isAvailable = isAvailable;
  await doctor.save();

  res.status(200).json({
    success: true,
    message: `Doctor marked as ${isAvailable ? "available" : "unavailable"}`,
    doctor,
  });
});
