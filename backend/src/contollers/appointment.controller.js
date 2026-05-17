import Appointment from "../models/appointment.model.js";
import Patient from "../models/patient.model.js";
import Doctor from "../models/docter.model.js";

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
const buildDailySlots = () => {
  const slots = [];

  for (
    let startMinutes = WORKING_HOURS.startMinutes;
    startMinutes < WORKING_HOURS.endMinutes;
    startMinutes += SLOT_DURATION_IN_MINUTES
  ) {
    const endMinutes = startMinutes + SLOT_DURATION_IN_MINUTES;
    if (endMinutes > WORKING_HOURS.endMinutes) break;

    const startTime = formatMinutesToTime(startMinutes);
    if (EXCLUDED_SLOT_START_TIMES.has(startTime)) continue;

    slots.push({
      startTime,
      endTime: formatMinutesToTime(endMinutes),
      label: `${startTime} - ${formatMinutesToTime(endMinutes)}`,
      period:
        startMinutes < 12 * 60
          ? "Morning"
          : startMinutes < 17 * 60
            ? "Afternoon"
            : "Evening",
    });
  }

  return slots;
};



// get token no. according to slot
const getTokenNumberForSlot = (startTime) => {
  const dailySlots = buildDailySlots();
  const slotIndex = dailySlots.findIndex((slot) => slot.startTime === startTime);

  if (slotIndex === -1) {
    return null;
  }

  return `A${slotIndex + 1}`;
};



// get available slots
export const getAvailableSlots = async (req, res) => {
  try {
    await cancelExpiredAppointments();

    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: "doctorId and date are required",
      });
    }

    const doctor = await Doctor.findById(doctorId).populate("user", "name email");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const requestedDate = new Date(date);
    if (Number.isNaN(requestedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    const { startOfDay, endOfDay } = getDayRange(requestedDate);

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
    const availableSlots = buildDailySlots().filter((slot) => {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// BOOK APPOINTMENT
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, startTime, endTime } =
      req.body;

    // Validate required fields
    if (!doctorId || !appointmentDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Get patient info
    const patient = await Patient.findOne({
      user: req.user._id,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const { startOfDay, endOfDay } = getDayRange(appointmentDate);
    const appointmentStartDateTime = getAppointmentStartDateTime(
      appointmentDate,
      startTime
    );

    if (!appointmentStartDateTime) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment start time",
      });
    }

    if (appointmentStartDateTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "You cannot book an appointment in the past",
      });
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
      return res.status(400).json({
        success: false,
        message: "Time slot already booked for this doctor",
      });
    }

    const tokenNumber = getTokenNumberForSlot(startTime);
    if (!tokenNumber) {
      return res.status(400).json({
        success: false,
        message: "Invalid slot selected",
      });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





// GET ALL APPOINTMENTS (PATIENT)
export const getPatientAppointments = async (req, res) => {
  try {
    await cancelExpiredAppointments();

    const patient = await Patient.findOne({
      user: req.user._id,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET APPOINTMENT STATS FOR CURRENT DOCTOR
export const getDoctorAppointmentStats = async (req, res) => {
  try {
    await cancelExpiredAppointments();

    const doctor = await Doctor.findOne({
      user: req.user._id,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// GET TODAY'S UPCOMING PATIENTS FOR CURRENT DOCTOR
export const getDoctorUpcomingPatients = async (req, res) => {
  try {
    await cancelExpiredAppointments();

    const doctor = await Doctor.findOne({
      user: req.user._id,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// GET TODAY'S SCHEDULE FOR CURRENT DOCTOR
export const getDoctorTodaySchedule = async (req, res) => {
  try {
    await cancelExpiredAppointments();

    const doctor = await Doctor.findOne({
      user: req.user._id,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





// GET A SINGLE APPOINTMENT DETAILS
export const getAppointmentDetails = async (req, res) => {
  try {
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
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// CANCEL APPOINTMENT
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};






// UPDATE APPOINTMENT STATUS (DOCTOR/ADMIN)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment status updated",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
