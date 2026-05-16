import Appointment from "../models/appointment.model.js";
import Patient from "../models/patient.model.js";
import Doctor from "../models/docter.model.js";

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

    const availableSlots = buildDailySlots().filter(
      (slot) => !bookedSlotKeys.has(`${slot.startTime}-${slot.endTime}`)
    );

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





// GET A SINGLE APPOINTMENT DETAILS
export const getAppointmentDetails = async (req, res) => {
  try {
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
