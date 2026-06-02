import Appointment from "../models/appointment.model.js";
import Patient from "../models/patient.model.js";
import Doctor from "../models/docter.model.js";
import Schedule from "../models/Schedule.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";

// keep these in sync with queue.controller.js (queue logic depends on them)
const SLOT_DURATION_IN_MINUTES = 30;
const WORKING_HOURS = {
  startMinutes: 9 * 60,
  endMinutes: 17 * 60,
};
const EXCLUDED_SLOT_START_TIMES = new Set(["11:00 AM", "2:00 PM"]);


const padTime = (value) => String(value).padStart(2, "0");


// format minutes in real clock time
const formatMinutesToTime = (totalMinutes) => {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${padTime(minutes)} ${period}`;
};


// start to endtime of day
const getDayRange = (dateValue) => {
  const date = new Date(dateValue);
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
};


// parse "h:mm AM/PM" to minutes from midnight (e.g. "9:30 AM" => 570)
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


// get end datetime of appointment by date + end time
const getAppointmentEndDateTime = (appointmentDateValue, endTime) => {
  const appointmentDate = new Date(appointmentDateValue);
  if (Number.isNaN(appointmentDate.getTime())) return null;

  const parsedTime = parseTimeTo24Hour(endTime);
  if (!parsedTime) return null;

  const endDateTime = new Date(appointmentDate);
  endDateTime.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
  return endDateTime;
};

// get start datetime of appointment by date + start time
const getAppointmentStartDateTime = (appointmentDateValue, startTime) => {
  const appointmentDate = new Date(appointmentDateValue);
  if (Number.isNaN(appointmentDate.getTime())) return null;

  const parsedTime = parseTimeTo24Hour(startTime);
  if (!parsedTime) return null;

  const startDateTime = new Date(appointmentDate);
  startDateTime.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
  return startDateTime;
};


// Cancel appointments that have passed their end time but are still marked as pending/confirmed
const cancelExpiredAppointments = async () => {
  const activeAppointments = await Appointment.find({
    status: {
      $in: ["pending", "confirmed"],
    },
  }).select("_id appointmentDate endTime");

  const now = new Date();
  const expiredAppointmentIds = activeAppointments
    .filter((appointment) => {
      const endDateTime = getAppointmentEndDateTime(
        appointment.appointmentDate,
        appointment.endTime
      );

      return endDateTime && endDateTime < now;
    })
    .map((appointment) => appointment._id);

  if (expiredAppointmentIds.length === 0) {
    return;
  }

  await Appointment.updateMany(
    {
      _id: {
        $in: expiredAppointmentIds,
      },
    },
    {
      $set: {
        status: "cancelled",
      },
    }
  );
};



// It creates all appointment slots for the day.
const buildDailySlots = ({
  startMinutes = WORKING_HOURS.startMinutes,
  endMinutes = WORKING_HOURS.endMinutes,
  slotDuration = SLOT_DURATION_IN_MINUTES,
  breaks = [],
  maxPatientsPerDay,
} = {}) => {
  const slots = [];
  const parsedBreaks = breaks
    .map((breakItem) => ({
      startMinutes: parseTimeToMinutes(breakItem?.startTime),
      endMinutes: parseTimeToMinutes(breakItem?.endTime),
    }))
    .filter(
      (breakItem) =>
        breakItem.startMinutes !== null &&
        breakItem.endMinutes !== null &&
        breakItem.endMinutes > breakItem.startMinutes
    );

  for (
    let currentStartMinutes = startMinutes;
    currentStartMinutes < endMinutes;
    currentStartMinutes += slotDuration
  ) {
    const currentEndMinutes = currentStartMinutes + slotDuration;
    if (currentEndMinutes > endMinutes) break;

    const isDuringBreak = parsedBreaks.some(
      (breakItem) =>
        currentStartMinutes < breakItem.endMinutes &&
        currentEndMinutes > breakItem.startMinutes
    );

    if (isDuringBreak) continue;

    const startTime = formatMinutesToTime(currentStartMinutes);
    if (EXCLUDED_SLOT_START_TIMES.has(startTime)) continue;

    slots.push({
      startTime,
      endTime: formatMinutesToTime(currentEndMinutes),
      label: `${startTime} - ${formatMinutesToTime(currentEndMinutes)}`,
      period:
        currentStartMinutes < 12 * 60
          ? "Morning"
          : currentStartMinutes < 17 * 60
            ? "Afternoon"
            : "Evening",
    });
  }

  return maxPatientsPerDay ? slots.slice(0, maxPatientsPerDay) : slots;
};

const getDailySlotsForDoctorDate = async (doctor, requestedDate) => {
  const isApproved =
    !doctor.verificationStatus || doctor.verificationStatus === "approved";

  if (!isApproved || doctor.status !== "active" || doctor.isAvailable === false) {
    return [];
  }

  const schedule = await Schedule.findOne({
    doctor: doctor._id,
    dayOfWeek: requestedDate.getDay(),
  });

  if (!schedule) {
    return buildDailySlots();
  }

  if (!schedule.isAvailable) {
    return [];
  }

  const startMinutes = parseTimeToMinutes(schedule.startTime);
  const endMinutes = parseTimeToMinutes(schedule.endTime);

  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
    return [];
  }

  return buildDailySlots({
    startMinutes,
    endMinutes,
    slotDuration: schedule.slotDuration || SLOT_DURATION_IN_MINUTES,
    breaks: schedule.breaks || [],
    maxPatientsPerDay: schedule.maxPatientsPerDay,
  });
};



// get token no. according to slot
const getTokenNumberForSlot = (dailySlots, startTime) => {
  const slotIndex = dailySlots.findIndex((slot) => slot.startTime === startTime);

  if (slotIndex === -1) {
    return null;
  }

  return `A${slotIndex + 1}`;
};



// get available slots
export const getAvailableSlots = asyncHandler(async (req, res) => {
    await cancelExpiredAppointments();

    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      throw new ValidationError("doctorId and date are required");
    }

    const doctor = await Doctor.findById(doctorId).populate("user", "name email");

    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    const requestedDate = new Date(date);
    if (Number.isNaN(requestedDate.getTime())) {
      throw new ValidationError("Invalid date");
    }

    const { startOfDay, endOfDay } = getDayRange(requestedDate);
    const dailySlots = await getDailySlotsForDoctorDate(doctor, requestedDate);

    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $ne: "cancelled" },
    }).select("startTime endTime");

    const bookedSlotKeys = new Set(
      existingAppointments.map((appointment) => `${appointment.startTime}-${appointment.endTime}`)
    );

    const now = new Date();
    const availableSlots = dailySlots.filter((slot) => {
      if (bookedSlotKeys.has(`${slot.startTime}-${slot.endTime}`)) {
        return false;
      }

      const slotStartDateTime = getAppointmentStartDateTime(
        requestedDate,
        slot.startTime
      );

      if (!slotStartDateTime) {
        return false;
      }

      return slotStartDateTime > now;
    });

    res.status(200).json({
      success: true,
      doctor,
      selectedDate: startOfDay,
      availableSlots,
    });
});




// BOOK APPOINTMENT
export const bookAppointment = asyncHandler(async (req, res) => {
    const { doctorId, appointmentDate, startTime, endTime } =
      req.body;

    // Validate required fields
    if (!doctorId || !appointmentDate || !startTime || !endTime) {
      throw new ValidationError("Please provide all required fields");
    }

    // Get patient info
    const patient = await Patient.findOne({
      user: req.user._id,
    });

    if (!patient) {
      throw new NotFoundError("Patient profile not found");
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    const { startOfDay, endOfDay } = getDayRange(appointmentDate);
    const appointmentStartDateTime = getAppointmentStartDateTime(
      appointmentDate,
      startTime
    );

    if (!appointmentStartDateTime) {
      throw new ValidationError("Invalid appointment start time");
    }

    if (appointmentStartDateTime <= new Date()) {
      throw new ValidationError("You cannot book an appointment in the past");
    }

    // Check for appointment conflicts (same doctor, same time slot)
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      startTime,
      endTime,
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      throw new ValidationError("Time slot already booked for this doctor");
    }

    const dailySlots = await getDailySlotsForDoctorDate(
      doctor,
      new Date(appointmentDate)
    );
    const selectedDailySlot = dailySlots.find(
      (slot) => slot.startTime === startTime && slot.endTime === endTime
    );

    if (!selectedDailySlot) {
      throw new ValidationError("Doctor is not available for the selected slot");
    }

    const tokenNumber = getTokenNumberForSlot(dailySlots, startTime);
    if (!tokenNumber) {
      throw new ValidationError("Invalid slot selected");
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      startTime,
      endTime,
      tokenNumber,
      status: "pending",
    });

    // Populate references
    await appointment.populate([
      {
        path: "patient",
        populate: {
          path: "user",
          select: "name email",
        },
      },
      {
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      },
    ]);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
});





// GET ALL APPOINTMENTS (PATIENT)
export const getPatientAppointments = asyncHandler(async (req, res) => {
    await cancelExpiredAppointments();

    const patient = await Patient.findOne({
      user: req.user._id,
    });

    if (!patient) {
      throw new NotFoundError("Patient profile not found");
    }

    const appointments = await Appointment.find({
      patient: patient._id,
    })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
});



// GET APPOINTMENT STATS FOR CURRENT DOCTOR
export const getDoctorAppointmentStats = asyncHandler(async (req, res) => {
    await cancelExpiredAppointments();

    const doctor = await Doctor.findOne({
      user: req.user._id,
    });

    if (!doctor) {
      throw new NotFoundError("Doctor profile not found");
    }

    const appointments = await Appointment.find({
      doctor: doctor._id,
    }).select("status appointmentDate endTime");

    const now = new Date();
    const { startOfDay, endOfDay } = getDayRange(now);

    const stats = appointments.reduce(
      (summary, appointment) => {
        if (appointment.status === "cancelled") {
          return summary;
        }

        summary.total += 1;

        const appointmentEndDateTime = getAppointmentEndDateTime(
          appointment.appointmentDate,
          appointment.endTime
        );
        const isTodayAppointment =
          appointment.appointmentDate >= startOfDay &&
          appointment.appointmentDate <= endOfDay;
        const isUpcomingTodayAppointment =
          isTodayAppointment &&
          appointment.status !== "completed" &&
          appointmentEndDateTime &&
          appointmentEndDateTime >= now;

        if (appointment.status === "completed") {
          summary.completed += 1;
        } else if (appointment.status === "pending" || appointment.status === "confirmed") {
          summary.pending += 1;
        }

        if (isUpcomingTodayAppointment) {
          summary.inProgress += 1;
        }

        return summary;
      },
      {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
      }
    );

    res.status(200).json({
      success: true,
      stats,
    });
});




// GET TODAY'S UPCOMING PATIENTS FOR CURRENT DOCTOR
export const getDoctorUpcomingPatients = asyncHandler(async (req, res) => {
    await cancelExpiredAppointments();

    const doctor = await Doctor.findOne({
      user: req.user._id,
    });

    if (!doctor) {
      throw new NotFoundError("Doctor profile not found");
    }

    const { startOfDay, endOfDay } = getDayRange(new Date());

    const appointments = await Appointment.find({
      doctor: doctor._id,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: {
        $in: ["pending", "confirmed"],
      },
    })
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .select("appointmentDate startTime tokenNumber status patient");

    const sortedAppointments = appointments.sort((a, b) => {
      const aTokenNumber = Number(String(a.tokenNumber || "").replace(/\D/g, "")) || 0;
      const bTokenNumber = Number(String(b.tokenNumber || "").replace(/\D/g, "")) || 0;

      if (aTokenNumber !== bTokenNumber) {
        return aTokenNumber - bTokenNumber;
      }

      return String(a.startTime || "").localeCompare(String(b.startTime || ""));
    });

    res.status(200).json({
      success: true,
      appointments: sortedAppointments,
    });
});




// GET TODAY'S SCHEDULE FOR CURRENT DOCTOR
export const getDoctorTodaySchedule = asyncHandler(async (req, res) => {
    await cancelExpiredAppointments();

    const doctor = await Doctor.findOne({
      user: req.user._id,
    });

    if (!doctor) {
      throw new NotFoundError("Doctor profile not found");
    }

    const { startOfDay, endOfDay } = getDayRange(new Date());

    const appointments = await Appointment.find({
      doctor: doctor._id,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: {
        $ne: "cancelled",
      },
    })
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .select("appointmentDate startTime endTime tokenNumber status patient doctor")
      .sort({ appointmentDate: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      appointments,
    });
});





// GET A SINGLE APPOINTMENT DETAILS
export const getAppointmentDetails = asyncHandler(async (req, res) => {
    await cancelExpiredAppointments();

    const appointment = await Appointment.findById(
      req.params.appointmentId
    ).populate([
      {
        path: "patient",
        populate: {
          path: "user",
          select: "name email",
        },
      },
      {
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      },
    ]);

    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    res.status(200).json({
      success: true,
      appointment,
    });
});




// CANCEL APPOINTMENT
export const cancelAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
});






// UPDATE APPOINTMENT STATUS (DOCTOR/ADMIN)
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

    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    res.status(200).json({
      success: true,
      message: "Appointment status updated",
      appointment,
    });
});


// ADD CONSULTATION NOTES (by doctor after appointment)
export const addConsultationNotes = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { consultationNotes, diagnosis, prescription, followUpRequired, followUpNotes } = req.body;

  const appointment = await Appointment.findById(appointmentId)
    .populate("doctor", "user")
    .populate("patient", "user");

  if (!appointment) {
    throw new NotFoundError("Appointment not found");
  }

  // Verify doctor is updating their own appointment
  if (String(appointment.doctor.user) !== String(req.user._id)) {
    throw new ValidationError("You can only add notes to your own appointments");
  }

  // Update appointment with consultation details
  appointment.consultationNotes = consultationNotes || appointment.consultationNotes;
  appointment.diagnosis = diagnosis || appointment.diagnosis;
  appointment.prescription = prescription || appointment.prescription;
  appointment.followUpRequired = followUpRequired !== undefined ? followUpRequired : appointment.followUpRequired;
  appointment.followUpNotes = followUpNotes || appointment.followUpNotes;
  appointment.status = "completed";

  await appointment.save();

  res.status(200).json({
    success: true,
    message: "Consultation notes added successfully",
    appointment,
  });
});


// GET CONSULTATION NOTES FOR APPOINTMENT
export const getConsultationNotes = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  const appointment = await Appointment.findById(appointmentId)
    .populate("doctor")
    .populate("patient", "user");

  if (!appointment) {
    throw new NotFoundError("Appointment not found");
  }

  // Patient can view their own notes, doctor can view their own notes, admin can view all
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
