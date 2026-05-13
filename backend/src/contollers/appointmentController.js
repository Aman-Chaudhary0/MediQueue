import Appointment from "../models/appointmentModel.js";
import Patient from "../models/patient.model.js";


// BOOK APPOINTMENT
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, startTime, endTime, fees } =
      req.body;

    // Validate required fields
    if (!doctorId || !appointmentDate || !startTime || !endTime || !fees) {
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

    // Check for appointment conflicts (same doctor, same time slot)
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "Time slot already booked for this doctor",
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      startTime,
      endTime,
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
        select: "name email",
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
      .populate("doctor", "name email")
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
        select: "name email",
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
