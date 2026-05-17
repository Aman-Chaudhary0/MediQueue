import Appointment from "../models/appointment.model.js";
import Patient from "../models/patient.model.js";

const SLOT_DURATION_IN_MINUTES = 30;

// Extract numeric part from token (e.g. A10 -> 10). Returns 0 if invalid.
const getTokenNumberIndex = (tokenNumber) => {
  const num = Number(String(tokenNumber || "").replace(/\D/g, "")) || 0;
  return num;
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


// Convert "h:mm AM/PM" to total minutes from start of day (e.g. 9:30 AM -> 570). Returns null if invalid.s
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


// Convert appointment date + "h:mm AM/PM" to Date object. Returns null if invalid.
const getAppointmentEndDateTime = (appointmentDateValue, endTime) => {
  const appointmentDate = new Date(appointmentDateValue);
  if (Number.isNaN(appointmentDate.getTime())) return null;

  const parsedTime = parseTimeTo24Hour(endTime);
  if (!parsedTime) return null;

  const endDateTime = new Date(appointmentDate);
  endDateTime.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
  return endDateTime;
};



// Similar to above but for start time
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



// Estimate waiting time based on number of patients ahead and a fixed slot duration.
const computeEstimatedWaiting = (aheadCount, servingTokenIndex) => {
  // Simple estimate: each appointment = SLOT_DURATION_IN_MINUTES (~30 mins).
  const baseMinutes = aheadCount * SLOT_DURATION_IN_MINUTES;
  // Add small uncertainty window.
  const min = Math.max(0, baseMinutes - 5);
  const max = Math.max(0, baseMinutes + 10);

  // If currently serving token is ahead, use serving token index just to avoid all-zeros
  // (keeps estimate non-empty when aheadCount is 0 but system hasn't updated yet).
  const wiggle = servingTokenIndex ? 0 : 3;
  return { minMinutes: min + wiggle, maxMinutes: max + wiggle };
};





// GET LIVE QUEUE STATUS FOR PATIENT
export const getLiveQueueStatusForPatient = async (req, res) => {
  try {
    await cancelExpiredAppointments();

    const patient = await Patient.findOne({ user: req.user._id }).select("_id");
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const now = new Date();
    const { startOfDay, endOfDay } = getDayRange(now);

    // Consider only today's pending/confirmed appointments for queue.
    // Pick the nearest one that hasn't ended yet.
    const candidateAppointments = await Appointment.find({
      patient: patient._id,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["pending", "confirmed"] },
    })
      .select("doctor appointmentDate startTime endTime tokenNumber status")
      .populate("doctor", "_id");

    const upcomingAppointments = candidateAppointments
      .map((a) => {
        const endDateTime = getAppointmentEndDateTime(a.appointmentDate, a.endTime);
        return { ...a.toObject(), endDateTime };
      })
      .filter((a) => a.endDateTime && a.endDateTime >= now)
      .sort((a, b) => {
        const aEnd = a.endDateTime ? a.endDateTime.getTime() : 0;
        const bEnd = b.endDateTime ? b.endDateTime.getTime() : 0;
        return aEnd - bEnd;
      });

    const yourAppointment = upcomingAppointments[0] || null;
    if (!yourAppointment) {
      return res.status(200).json({
        success: true,
        live: false,
        message: "No active queue found for your next appointment today.",
      });
    }

    const doctorId = yourAppointment.doctor;

    // Queue for this doctor today: all pending/confirmed appointments ordered by token.
    const doctorQueueAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["pending", "confirmed"] },
    })
      .populate({ path: "patient", populate: { path: "user", select: "name" } })
      .select("appointmentDate startTime endTime tokenNumber status patient");

    const queueSorted = doctorQueueAppointments
      .map((a) => {
        const endDateTime = getAppointmentEndDateTime(a.appointmentDate, a.endTime);
        const startDateTime = getAppointmentStartDateTime(a.appointmentDate, a.startTime);
        return {
          ...a.toObject(),
          endDateTime,
          startDateTime,
          tokenIndex: getTokenNumberIndex(a.tokenNumber),
          patientName: a.patient?.user?.name || "Patient",
        };
      })
      .filter((a) => a.endDateTime && a.endDateTime >= now)
      .sort((a, b) => {
        if (a.tokenIndex !== b.tokenIndex) return a.tokenIndex - b.tokenIndex;
        return String(a.startTime || "").localeCompare(String(b.startTime || ""));
      });

    const yourTokenIndex = getTokenNumberIndex(yourAppointment.tokenNumber);

    const positionInQueue = queueSorted.findIndex(
      (a) =>
        getTokenNumberIndex(a.tokenNumber) === yourTokenIndex &&
        String(a.patient?._id || "") === String(patient._id)
    );

    const yourTokenNumber = yourAppointment.tokenNumber || `A${yourTokenIndex}`;
    const yourPosition = positionInQueue === -1 ? null : positionInQueue + 1;
    const aheadCount = positionInQueue === -1 ? null : positionInQueue;

    // Determine currently serving:
    // - If any appointment is confirmed and now is within [start, end], serve that.
    // - Else, serve the first pending/confirmed appointment in queueSorted.
    const currentlyServing = (() => {
      const inProgress = queueSorted.find((a) => {
        const startOk = a.startDateTime && a.startDateTime <= now;
        const endOk = a.endDateTime && a.endDateTime >= now;
        return a.status === "confirmed" && startOk && endOk;
      });
      if (inProgress) return inProgress;
      return queueSorted[0] || null;
    })();

    const servingTokenNumber = currentlyServing?.tokenNumber || null;
    const servingTokenIndex = currentlyServing ? getTokenNumberIndex(currentlyServing.tokenNumber) : 0;
    const servingPatientName = currentlyServing?.patientName || null;

    const { minMinutes, maxMinutes } = computeEstimatedWaiting(
      aheadCount == null ? 0 : aheadCount,
      servingTokenIndex
    );

    const formattedRange = `${minMinutes}-${maxMinutes} mins`;

    res.status(200).json({
      success: true,
      live: true,
      doctorId,
      yourTokenNumber,
      yourPosition,
      aheadCount,
      currentlyServing: servingTokenNumber
        ? {
            tokenNumber: servingTokenNumber,
            patientName: servingPatientName,
            status: currentlyServing.status,
          }
        : null,
      estimatedWaitingTime: {
        minMinutes,
        maxMinutes,
        text: formattedRange,
      },
      queue: queueSorted.slice(0, 20).map((a) => ({
        tokenNumber: a.tokenNumber,
        patientName: a.patientName,
        status: a.status === "confirmed" ? "In Progress" : "Waiting",
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
