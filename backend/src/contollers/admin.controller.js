
import User from "../models/user.model.js";
import Doctor from "../models/docter.model.js";
import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import bcrypt from "bcrypt";


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
  // Validate format using regex
  const match = String(timeValue).match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/i);

  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  // Convert to 24-hour format
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};



// Helper to get start and end of current day
const getTodayRange = () => {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
};



// GET ADMIN DASHBOARD STATS
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


    // Send response
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

// ===================== ADMIN ANALYTICS =====================

export const getAdminAnalytics = async (req, res) => {
  try {
    // Get ALL appointments with status + timing (for avg wait time)
    const appointmentsAllTime = await Appointment.find({})
      .select("status startTime endTime doctor");

    // Count by status (all-time)
    const completedToday = appointmentsAllTime.filter((a) => a.status === "completed").length;
    const pendingToday = appointmentsAllTime.filter((a) => a.status === "pending").length;
    const cancelledToday = appointmentsAllTime.filter((a) => a.status === "cancelled").length;

    // Calculate average wait time from completed appointments (all-time)
    const completedAppointments = appointmentsAllTime.filter((a) => a.status === "completed");
    const durations = completedAppointments
      .map((a) => {
        const startMins = parseTimeToMinutes(a.startTime);
        const endMins = parseTimeToMinutes(a.endTime);
        if (startMins == null || endMins == null) return null;
        const diff = endMins - startMins;
        return diff >= 0 ? diff : null;
      })
      .filter((v) => typeof v === "number");

    const avgWaitTimeMinutes = durations.length > 0
      ? Math.round(durations.reduce((sum, v) => sum + v, 0) / durations.length)
      : 0;

    // Get appointments by doctor (all time for performance metric)
    // Appointment.doctor stores a Doctor _id (ref: "Doctor"), and Doctor.user stores the User _id.
    const appointmentsByDoctor = await Appointment.aggregate([
      {
        $group: {
          _id: "$doctor",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctorInfo",
        },
      },
      { $unwind: { path: "$doctorInfo", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "doctorInfo.user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          doctorName: { $arrayElemAt: ["$userInfo.name", 0] },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 7,
      },
    ]);

    // Get weekly appointments (last 7 days) broken down by day
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyAppointments = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $let: {
              vars: { dow: { $dayOfWeek: "$appointmentDate" } },
              in: {
                $arrayElemAt: [
                  ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                  "$$dow"
                ]
              }
            }
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Format weekly appointments for chart
    const weeklyData = weeklyAppointments.map((item) => ({
      name: item._id,
      appointments: item.count,
    }));

    // Format doctor performance for chart
    const doctorPerformance = appointmentsByDoctor.map((doc) => ({
      name: doc.doctorName || "Unknown",
      patients: doc.count,
    }));

    res.status(200).json({
      success: true,
      analytics: {
        stats: {
          // Frontend still calls these “Today”, but they are now all-time (till now)
          appointmentsToday: appointmentsAllTime.length,
          completedToday,
          pendingToday,
          cancelledToday,
          avgWaitTimeMinutes,
        },
        weeklyAppointments: weeklyData,
        doctorPerformance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
