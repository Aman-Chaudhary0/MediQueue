
import User from "../models/user.model.js";
import Doctor from "../models/docter.model.js";
import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";


// ADMIN: REGISTER DOCTOR
export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create doctor user
    const doctor = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
    });

    // Create empty doctor profile document immediately
    // so /api/doctor/me works after registration.
    await Doctor.create({ user: doctor._id });

    // Remove password from response
    const userResponse = {
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      role: doctor.role,
    };

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};






// GET ALL USERS (ADMIN ONLY)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





// GET DOCTORS ONLY
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");

    res.status(200).json({
      success: true,
      totalDoctors: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





// DELETE USER (ADMIN ONLY)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================== ADMIN DASHBOARD STATS =====================

const parseTimeToMinutes = (timeValue) => {
  // expects "h:mm AM/PM" like "9:30 AM"
  if (!timeValue) return null;
  const match = String(timeValue).match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const getTodayRange = () => {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
};

export const getAdminDashboardStats = async (req, res) => {
  try {
    const { startOfDay, endOfDay } = getTodayRange();

    const [doctorsCount, patientsCount, appointmentsToday] = await Promise.all([
      User.countDocuments({ role: "doctor" }),
      Patient.countDocuments({}),
      Appointment.find({
        appointmentDate: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: "cancelled" },
      }).select("startTime endTime status"),
    ]);

    // Average consultation time from completed appointments today
    const completedToday = appointmentsToday.filter((a) => a.status === "completed");

    const durations = completedToday
      .map((a) => {
        const startMins = parseTimeToMinutes(a.startTime);
        const endMins = parseTimeToMinutes(a.endTime);
        if (startMins == null || endMins == null) return null;
        const diff = endMins - startMins;
        return diff >= 0 ? diff : null;
      })
      .filter((v) => typeof v === "number");

    const avgMinutes =
      durations.length > 0
        ? Math.round(durations.reduce((sum, v) => sum + v, 0) / durations.length)
        : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalPatients: patientsCount,
        totalDoctors: doctorsCount,
        appointmentsToday: appointmentsToday.length,
        avgWaitTimeMinutes: avgMinutes,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
