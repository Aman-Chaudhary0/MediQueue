import Appointment from "../models/appointment.model.js";
import Patient from "../models/patient.model.js";
import Doctor from "../models/docter.model.js";
import Schedule from "../models/Schedule.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError, ValidationError, ForbiddenError } from "../utils/errors.js";
import { sendMail } from "../utils/email.js";

// keep these in sync with queue.controller.js (queue logic depends on them)
const SLOT_DURATION_IN_MINUTES = 30;
const WORKING_HOURS = {
  startMinutes: 9 * 60,
  endMinutes: 17 * 60,
};
const EXCLUDED_SLOT_START_TIMES = new Set(["11:00 AM", "2:00 PM"]);

// Refund is applicable when cancelled >= this many hours before appointment
const REFUND_CUTOFF_HOURS = 24;

const padTime = (value) => String(value).padStart(2, "0");

const formatMinutesToTime = (totalMinutes) => {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${padTime(minutes)} ${period}`;
};

const getDayRange = (dateValue) => {
  const date = new Date(dateValue);
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return { startOfDay, endOfDay };
};

const parseTimeTo24Hour = (timeValue) => {
  const match = String(timeValue || "").match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
};

const parseTimeToMinutes = (timeValue) => {
  const parsedTime = parseTimeTo24Hour(timeValue);
  if (!parsedTime) return null;
  return parsedTime.hours * 60 + parsedTime.minutes;
};

const getAppointmentEndDateTime = (appointmentDateValue, endTime) => {
  const appointmentDate = new Date(appointmentDateValue);
  if (Number.isNaN(appointmentDate.getTime())) return null;
  const parsedTime = parseTimeTo24Hour(endTime);
  if (!parsedTime) return null;
  const endDateTime = new Date(appointmentDate);
  endDateTime.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
  return endDateTime;
};

const getAppointmentStartDateTime = (appointmentDateValue, startTime) => {
  const appointmentDate = new Date(appointmentDateValue);
  if (Number.isNaN(appointmentDate.getTime())) return null;
  const parsedTime = parseTimeTo24Hour(startTime);
  if (!parsedTime) return null;
  const startDateTime = new Date(appointmentDate);
  startDateTime.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
  return startDateTime;
};

const cancelExpiredAppointments = async () => {
  const activeAppointments = await Appointment.find({
    status: { $in: ["pending", "confirmed"] },
  }).select("_id appointmentDate endTime");

  const now = new Date();
  const expiredIds = activeAppointments
    .filter((a) => {
      const end = getAppointmentEndDateTime(a.appointmentDate, a.endTime);
      return end && end < now;
    })
    .map((a) => a._id);

  if (expiredIds.length === 0) return;

  await Appointment.updateMany(
    { _id: { $in: expiredIds } },
    { $set: { status: "cancelled", cancelledAt: now, cancelledBy: "admin" } }
  );
};

const buildDailySlots = ({
  startMinutes = WORKING_HOURS.startMinutes,
  endMinutes = WORKING_HOURS.endMinutes,
  slotDuration = SLOT_DURATION_IN_MINUTES,
  breaks = [],
  maxPatientsPerDay,
} = {}) => {
  const slots = [];
  const parsedBreaks = breaks
    .map((b) => ({
      startMinutes: parseTimeToMinutes(b?.startTime),
      endMinutes: parseTimeToMinutes(b?.endTime),
    }))
    .filter((b) => b.startMinutes !== null && b.endMinutes !== null && b.endMinutes > b.startMinutes);

  for (
    let cur = startMinutes;
    cur < endMinutes;
    cur += slotDuration
  ) {
    const end = cur + slotDuration;
    if (end > endMinutes) break;
    if (parsedBreaks.some((b) => cur < b.endMinutes && end > b.startMinutes)) continue;
    const startTime = formatMinutesToTime(cur);
    if (EXCLUDED_SLOT_START_TIMES.has(startTime)) continue;
    slots.push({
      startTime,
      endTime: formatMinutesToTime(end),
      label: `${startTime} - ${formatMinutesToTime(end)}`,
      period:
        cur < 12 * 60 ? "Morning" : cur < 17 * 60 ? "Afternoon" : "Evening",
    });
  }

  return maxPatientsPerDay ? slots.slice(0, maxPatientsPerDay) : slots;
};

const getDailySlotsForDoctorDate = async (doctor, requestedDate) => {
  const isApproved = !doctor.verificationStatus || doctor.verificationStatus === "approved";
  if (!isApproved || doctor.status !== "active" || doctor.isAvailable === false) return [];

  const schedule = await Schedule.findOne({
    doctor: doctor._id,
    dayOfWeek: requestedDate.getDay(),
  });

  if (!schedule) return buildDailySlots();
  if (!schedule.isAvailable) return [];

  const startMinutes = parseTimeToMinutes(schedule.startTime);
  const endMinutes = parseTimeToMinutes(schedule.endTime);
  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) return [];

  return buildDailySlots({
    startMinutes,
    endMinutes,
    slotDuration: schedule.slotDuration || SLOT_DURATION_IN_MINUTES,
    breaks: schedule.breaks || [],
    maxPatientsPerDay: schedule.maxPatientsPerDay,
  });
};

const getTokenNumberForSlot = (dailySlots, startTime) => {
  const idx = dailySlots.findIndex((s) => s.startTime === startTime);
  return idx === -1 ? null : `A${idx + 1}`;
};

// ─── Email helpers ───────────────────────────────────────────────────────────

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

const sendCancellationEmail = async ({ patientEmail, patientName, doctorName, appointmentDate, startTime, refundStatus }) => {
  const refundMsg =
    refundStatus === "pending"
      ? "A refund has been initiated and will be processed within 5–7 business days."
      : "No refund is applicable as the cancellation was made less than 24 hours before the appointment.";

  sendMail({
    to: patientEmail,
    subject: "Appointment Cancelled – MediQueue",
    text: `Hi ${patientName}, your appointment with Dr. ${doctorName} on ${formatDate(appointmentDate)} at ${startTime} has been cancelled. ${refundMsg}`,
    html: `<p>Hi <strong>${patientName}</strong>,</p><p>Your appointment with <strong>Dr. ${doctorName}</strong> on <strong>${formatDate(appointmentDate)}</strong> at <strong>${startTime}</strong> has been <strong>cancelled</strong>.</p><p>${refundMsg}</p>`,
  }).catch(() => {});
};

const sendRescheduleEmail = async ({ patientEmail, patientName, doctorName, newDate, newStartTime }) => {
  sendMail({
    to: patientEmail,
    subject: "Appointment Rescheduled – MediQueue",
    text: `Hi ${patientName}, your appointment with Dr. ${doctorName} has been rescheduled to ${formatDate(newDate)} at ${newStartTime}.`,
    html: `<p>Hi <strong>${patientName}</strong>,</p><p>Your appointment with <strong>Dr. ${doctorName}</strong> has been rescheduled to <strong>${formatDate(newDate)}</strong> at <strong>${newStartTime}</strong>.</p>`,
  }).catch(() => {});
};

const sendReminderEmail = async ({ patientEmail, patientName, doctorName, appointmentDate, startTime, tokenNumber }) => {
  sendMail({
    to: patientEmail,
    subject: "Appointment Reminder – MediQueue",
    text: `Hi ${patientName}, reminder: you have an appointment with Dr. ${doctorName} tomorrow on ${formatDate(appointmentDate)} at ${startTime}. Your token number is ${tokenNumber}.`,
    html: `<p>Hi <strong>${patientName}</strong>,</p><p>This is a reminder that you have an appointment with <strong>Dr. ${doctorName}</strong> tomorrow on <strong>${formatDate(appointmentDate)}</strong> at <strong>${startTime}</strong>.</p><p>Your token number: <strong>${tokenNumber}</strong></p>`,
  }).catch(() => {});
};

// ─── Controllers ─────────────────────────────────────────────────────────────

export const getAvailableSlots = asyncHandler(async (req, res) => {
  await cancelExpiredAppointments();

  const { doctorId, date } = req.query;
  if (!doctorId || !date) throw new ValidationError("doctorId and date are required");

  const doctor = await Doctor.findById(doctorId).populate("user", "name email");
  if (!doctor) throw new NotFoundError("Doctor not found");

  const requestedDate = new Date(date);
  if (Number.isNaN(requestedDate.getTime())) throw new ValidationError("Invalid date");

  const { startOfDay, endOfDay } = getDayRange(requestedDate);
  const dailySlots = await getDailySlotsForDoctorDate(doctor, requestedDate);

  const existingAppointments = await Appointment.find({
    doctor: doctorId,
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    status: { $ne: "cancelled" },
  }).select("startTime endTime");

  const bookedKeys = new Set(existingAppointments.map((a) => `${a.startTime}-${a.endTime}`));
  const now = new Date();

  const availableSlots = dailySlots.filter((slot) => {
    if (bookedKeys.has(`${slot.startTime}-${slot.endTime}`)) return false;
    const start = getAppointmentStartDateTime(requestedDate, slot.startTime);
    return start && start > now;
  });

  res.status(200).json({ success: true, doctor, selectedDate: startOfDay, availableSlots });
});


export const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, appointmentDate, startTime, endTime } = req.body;

  if (!doctorId || !appointmentDate || !startTime || !endTime) {
    throw new ValidationError("Please provide all required fields");
  }

  const patient = await Patient.findOne({ user: req.user._id });
  if (!patient) throw new NotFoundError("Patient profile not found");

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new NotFoundError("Doctor not found");

  const { startOfDay, endOfDay } = getDayRange(appointmentDate);
  const appointmentStartDateTime = getAppointmentStartDateTime(appointmentDate, startTime);

  if (!appointmentStartDateTime) throw new ValidationError("Invalid appointment start time");
  if (appointmentStartDateTime <= new Date()) throw new ValidationError("You cannot book an appointment in the past");

  const existing = await Appointment.findOne({
    doctor: doctorId,
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    startTime,
    endTime,
    status: { $ne: "cancelled" },
  });
  if (existing) throw new ValidationError("Time slot already booked for this doctor");

  const dailySlots = await getDailySlotsForDoctorDate(doctor, new Date(appointmentDate));
  const selectedSlot = dailySlots.find((s) => s.startTime === startTime && s.endTime === endTime);
  if (!selectedSlot) throw new ValidationError("Doctor is not available for the selected slot");

  const tokenNumber = getTokenNumberForSlot(dailySlots, startTime);
  if (!tokenNumber) throw new ValidationError("Invalid slot selected");

  const appointment = await Appointment.create({
    patient: patient._id,
    doctor: doctorId,
    appointmentDate: new Date(appointmentDate),
    startTime,
    endTime,
    tokenNumber,
    status: "pending",
  });

  await appointment.populate([
    { path: "patient", populate: { path: "user", select: "name email" } },
    { path: "doctor", populate: { path: "user", select: "name email" } },
  ]);

  res.status(201).json({ success: true, message: "Appointment booked successfully", appointment });
});


export const getPatientAppointments = asyncHandler(async (req, res) => {
  await cancelExpiredAppointments();

  const patient = await Patient.findOne({ user: req.user._id });
  if (!patient) throw new NotFoundError("Patient profile not found");

  const appointments = await Appointment.find({ patient: patient._id })
    .populate({ path: "doctor", populate: { path: "user", select: "name email" } })
    .sort({ appointmentDate: -1 });

  res.status(200).json({ success: true, appointments });
});


export const getDoctorAppointmentStats = asyncHandler(async (req, res) => {
  await cancelExpiredAppointments();

  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) throw new NotFoundError("Doctor profile not found");

  const appointments = await Appointment.find({ doctor: doctor._id }).select("status appointmentDate endTime");

  const now = new Date();
  const { startOfDay, endOfDay } = getDayRange(now);

  const stats = appointments.reduce(
    (summary, a) => {
      if (a.status === "cancelled") return summary;
      summary.total += 1;
      const end = getAppointmentEndDateTime(a.appointmentDate, a.endTime);
      const isToday = a.appointmentDate >= startOfDay && a.appointmentDate <= endOfDay;
      const isUpcoming = isToday && a.status !== "completed" && end && end >= now;
      if (a.status === "completed") summary.completed += 1;
      else if (a.status === "pending" || a.status === "confirmed") summary.pending += 1;
      if (isUpcoming) summary.inProgress += 1;
      return summary;
    },
    { total: 0, completed: 0, inProgress: 0, pending: 0 }
  );

  res.status(200).json({ success: true, stats });
});


export const getDoctorUpcomingPatients = asyncHandler(async (req, res) => {
  await cancelExpiredAppointments();

  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) throw new NotFoundError("Doctor profile not found");

  const { startOfDay, endOfDay } = getDayRange(new Date());

  const appointments = await Appointment.find({
    doctor: doctor._id,
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ["pending", "confirmed"] },
  })
    .populate({ path: "patient", populate: { path: "user", select: "name" } })
    .select("appointmentDate startTime tokenNumber status patient");

  const sorted = appointments.sort((a, b) => {
    const an = Number(String(a.tokenNumber || "").replace(/\D/g, "")) || 0;
    const bn = Number(String(b.tokenNumber || "").replace(/\D/g, "")) || 0;
    return an !== bn ? an - bn : String(a.startTime || "").localeCompare(String(b.startTime || ""));
  });

  res.status(200).json({ success: true, appointments: sorted });
});


export const getDoctorTodaySchedule = asyncHandler(async (req, res) => {
  await cancelExpiredAppointments();

  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) throw new NotFoundError("Doctor profile not found");

  const { startOfDay, endOfDay } = getDayRange(new Date());

  const appointments = await Appointment.find({
    doctor: doctor._id,
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    status: { $ne: "cancelled" },
  })
    .populate({ path: "patient", populate: { path: "user", select: "name" } })
    .populate({ path: "doctor", populate: { path: "user", select: "name" } })
    .select("appointmentDate startTime endTime tokenNumber status patient doctor")
    .sort({ appointmentDate: 1, startTime: 1 });

  res.status(200).json({ success: true, appointments });
});


export const getAppointmentDetails = asyncHandler(async (req, res) => {
  await cancelExpiredAppointments();

  const appointment = await Appointment.findById(req.params.appointmentId).populate([
    { path: "patient", populate: { path: "user", select: "name email" } },
    { path: "doctor", populate: { path: "user", select: "name email" } },
  ]);

  if (!appointment) throw new NotFoundError("Appointment not found");

  res.status(200).json({ success: true, appointment });
});


// CANCEL APPOINTMENT — with refund logic
export const cancelAppointment = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const appointment = await Appointment.findById(req.params.appointmentId).populate([
    { path: "patient", populate: { path: "user", select: "name email" } },
    { path: "doctor", populate: { path: "user", select: "name email" } },
  ]);

  if (!appointment) throw new NotFoundError("Appointment not found");
  if (["cancelled", "completed", "no-show"].includes(appointment.status)) {
    throw new ValidationError(`Appointment is already ${appointment.status}`);
  }

  const now = new Date();
  const appointmentStart = getAppointmentStartDateTime(appointment.appointmentDate, appointment.startTime);
  const hoursUntilAppointment = appointmentStart
    ? (appointmentStart.getTime() - now.getTime()) / (1000 * 60 * 60)
    : 0;

  // Refund applicable if cancelled >= 24 hours before
  const refundStatus = hoursUntilAppointment >= REFUND_CUTOFF_HOURS ? "pending" : "not_applicable";

  let cancelledBy = "patient";
  if (req.user.role === "doctor") cancelledBy = "doctor";
  if (req.user.role === "admin") cancelledBy = "admin";

  appointment.status = "cancelled";
  appointment.cancelledAt = now;
  appointment.cancellationReason = reason || "";
  appointment.cancelledBy = cancelledBy;
  appointment.refundStatus = refundStatus;
  await appointment.save();

  // Send cancellation email (non-blocking)
  const patientEmail = appointment.patient?.user?.email;
  const patientName = appointment.patient?.user?.name;
  const doctorName = appointment.doctor?.user?.name;
  if (patientEmail) {
    sendCancellationEmail({
      patientEmail,
      patientName,
      doctorName,
      appointmentDate: appointment.appointmentDate,
      startTime: appointment.startTime,
      refundStatus,
    });
  }

  res.status(200).json({
    success: true,
    message: "Appointment cancelled successfully",
    refundStatus,
    refundMessage:
      refundStatus === "pending"
        ? "Refund initiated. Will be processed in 5–7 business days."
        : "No refund applicable (cancelled less than 24 hours before appointment).",
    appointment,
  });
});


// RESCHEDULE APPOINTMENT
export const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { appointmentDate, startTime, endTime } = req.body;

  if (!appointmentDate || !startTime || !endTime) {
    throw new ValidationError("appointmentDate, startTime, and endTime are required");
  }

  const original = await Appointment.findById(req.params.appointmentId).populate([
    { path: "patient", populate: { path: "user", select: "name email" } },
    { path: "doctor", populate: { path: "user", select: "name email" } },
  ]);

  if (!original) throw new NotFoundError("Appointment not found");
  if (["cancelled", "completed", "no-show"].includes(original.status)) {
    throw new ValidationError(`Cannot reschedule a ${original.status} appointment`);
  }

  // Only patient who owns it (or admin) can reschedule
  if (req.user.role === "patient") {
    const patient = await Patient.findOne({ user: req.user._id }).select("_id");
    if (!patient || String(patient._id) !== String(original.patient._id)) {
      throw new ForbiddenError("You can only reschedule your own appointments");
    }
  }

  const newStart = getAppointmentStartDateTime(appointmentDate, startTime);
  if (!newStart) throw new ValidationError("Invalid appointment start time");
  if (newStart <= new Date()) throw new ValidationError("New appointment time must be in the future");

  const doctor = await Doctor.findById(original.doctor._id ?? original.doctor);
  if (!doctor) throw new NotFoundError("Doctor not found");

  const { startOfDay, endOfDay } = getDayRange(appointmentDate);

  const conflict = await Appointment.findOne({
    doctor: doctor._id,
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    startTime,
    endTime,
    status: { $ne: "cancelled" },
    _id: { $ne: original._id },
  });
  if (conflict) throw new ValidationError("Selected time slot is already booked");

  const dailySlots = await getDailySlotsForDoctorDate(doctor, new Date(appointmentDate));
  const selectedSlot = dailySlots.find((s) => s.startTime === startTime && s.endTime === endTime);
  if (!selectedSlot) throw new ValidationError("Doctor is not available for the selected slot");

  const tokenNumber = getTokenNumberForSlot(dailySlots, startTime);
  if (!tokenNumber) throw new ValidationError("Invalid slot selected");

  // Cancel original, create new linked appointment
  original.status = "cancelled";
  original.cancelledAt = new Date();
  original.cancellationReason = "Rescheduled by patient";
  original.cancelledBy = req.user.role;
  original.refundStatus = "not_applicable";
  await original.save();

  const newAppointment = await Appointment.create({
    patient: original.patient._id,
    doctor: doctor._id,
    appointmentDate: new Date(appointmentDate),
    startTime,
    endTime,
    tokenNumber,
    status: "pending",
    rescheduledFrom: original._id,
    rescheduledAt: new Date(),
  });

  await newAppointment.populate([
    { path: "patient", populate: { path: "user", select: "name email" } },
    { path: "doctor", populate: { path: "user", select: "name email" } },
  ]);

  // Send reschedule email (non-blocking)
  const patientEmail = newAppointment.patient?.user?.email;
  if (patientEmail) {
    sendRescheduleEmail({
      patientEmail,
      patientName: newAppointment.patient?.user?.name,
      doctorName: newAppointment.doctor?.user?.name,
      newDate: newAppointment.appointmentDate,
      newStartTime: startTime,
    });
  }

  res.status(201).json({
    success: true,
    message: "Appointment rescheduled successfully",
    appointment: newAppointment,
  });
});


// MARK NO-SHOW (doctor or admin)
export const markNoShow = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.appointmentId);
  if (!appointment) throw new NotFoundError("Appointment not found");

  if (!["pending", "confirmed"].includes(appointment.status)) {
    throw new ValidationError("Only pending or confirmed appointments can be marked as no-show");
  }

  const now = new Date();
  const appointmentStart = getAppointmentStartDateTime(appointment.appointmentDate, appointment.startTime);
  if (appointmentStart && appointmentStart > now) {
    throw new ValidationError("Cannot mark no-show before the appointment time");
  }

  appointment.status = "no-show";
  appointment.noShow = true;
  appointment.noShowMarkedAt = now;
  await appointment.save();

  res.status(200).json({
    success: true,
    message: "Appointment marked as no-show",
    appointment,
  });
});


// SEND APPOINTMENT REMINDER (admin or system; sends email to patient)
export const sendAppointmentReminder = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.appointmentId).populate([
    { path: "patient", populate: { path: "user", select: "name email" } },
    { path: "doctor", populate: { path: "user", select: "name email" } },
  ]);

  if (!appointment) throw new NotFoundError("Appointment not found");
  if (["cancelled", "completed", "no-show"].includes(appointment.status)) {
    throw new ValidationError("Cannot send reminder for a cancelled, completed, or no-show appointment");
  }

  const patientEmail = appointment.patient?.user?.email;
  const patientName = appointment.patient?.user?.name;
  const doctorName = appointment.doctor?.user?.name;

  if (!patientEmail) throw new ValidationError("Patient email not found");

  await sendReminderEmail({
    patientEmail,
    patientName,
    doctorName,
    appointmentDate: appointment.appointmentDate,
    startTime: appointment.startTime,
    tokenNumber: appointment.tokenNumber,
  });

  appointment.reminderSentAt = new Date();
  await appointment.save();

  res.status(200).json({ success: true, message: "Reminder sent successfully" });
});


// SUBMIT RATING & REVIEW (patient, after completion)
export const submitReview = asyncHandler(async (req, res) => {
  const { rating, review } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw new ValidationError("Rating must be between 1 and 5");
  }

  const patient = await Patient.findOne({ user: req.user._id }).select("_id");
  if (!patient) throw new NotFoundError("Patient profile not found");

  const appointment = await Appointment.findById(req.params.appointmentId);
  if (!appointment) throw new NotFoundError("Appointment not found");

  if (String(appointment.patient) !== String(patient._id)) {
    throw new ForbiddenError("You can only review your own appointments");
  }
  if (appointment.status !== "completed") {
    throw new ValidationError("You can only review completed appointments");
  }
  if (appointment.rating !== null) {
    throw new ValidationError("You have already submitted a review for this appointment");
  }

  appointment.rating = Number(rating);
  appointment.review = review || "";
  appointment.reviewSubmittedAt = new Date();
  await appointment.save();

  res.status(200).json({
    success: true,
    message: "Review submitted successfully",
    rating: appointment.rating,
    review: appointment.review,
  });
});


export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
    throw new ValidationError("Invalid status");
  }

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.appointmentId,
    { status },
    { new: true }
  );

  if (!appointment) throw new NotFoundError("Appointment not found");

  res.status(200).json({ success: true, message: "Appointment status updated", appointment });
});


export const addConsultationNotes = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { consultationNotes, diagnosis, prescription, followUpRequired, followUpNotes } = req.body;

  const appointment = await Appointment.findById(appointmentId)
    .populate("doctor", "user")
    .populate("patient", "user");

  if (!appointment) throw new NotFoundError("Appointment not found");
  if (String(appointment.doctor.user) !== String(req.user._id)) {
    throw new ValidationError("You can only add notes to your own appointments");
  }

  appointment.consultationNotes = consultationNotes || appointment.consultationNotes;
  appointment.diagnosis = diagnosis || appointment.diagnosis;
  appointment.prescription = prescription || appointment.prescription;
  appointment.followUpRequired = followUpRequired !== undefined ? followUpRequired : appointment.followUpRequired;
  appointment.followUpNotes = followUpNotes || appointment.followUpNotes;
  appointment.status = "completed";
  await appointment.save();

  res.status(200).json({ success: true, message: "Consultation notes added successfully", appointment });
});


export const getConsultationNotes = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  const appointment = await Appointment.findById(appointmentId)
    .populate("doctor")
    .populate("patient", "user");

  if (!appointment) throw new NotFoundError("Appointment not found");

  if (req.user.role === "patient") {
    if (String(appointment.patient._id) !== String(req.user._id)) {
      throw new ValidationError("You can only view your own consultation notes");
    }
  } else if (req.user.role === "doctor") {
    if (String(appointment.doctor.user) !== String(req.user._id)) {
      throw new ValidationError("You can only view your own consultation notes");
    }
  }

  res.status(200).json({
    success: true,
    consultationNotes: {
      notes: appointment.consultationNotes,
      diagnosis: appointment.diagnosis,
      prescription: appointment.prescription,
      followUpRequired: appointment.followUpRequired,
      followUpNotes: appointment.followUpNotes,
    },
  });
});
