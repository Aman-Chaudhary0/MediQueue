
import User from "../models/user.model.js";
import Doctor from "../models/docter.model.js";
import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import OtpRegistration from "../models/otp.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ConflictError, NotFoundError, ValidationError } from "../utils/errors.js";
import { hashPassword } from "../utils/password.js";
import { compareOtp, generateNumericOtp, hashOtp, isValidEmail } from "../utils/otp.js";
import { sendMail } from "../utils/email.js";

const getDoctorVerificationUrl = (email) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  return `${frontendUrl.replace(/\/$/, "")}/doctor-email-verification?email=${encodeURIComponent(email)}`;
};


// ADMIN: REGISTER DOCTOR
export const registerDoctor = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;


    // Validate required fields
    if (!name || !email || !password) {
      throw new ValidationError("Please provide name, email, and password");
    }

    if (!isValidEmail(email)) {
      throw new ValidationError("Invalid email address");
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    const otp = generateNumericOtp({ digits: 6 });
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OtpRegistration.findOneAndUpdate(
      { email },
      {
        email,
        otpHash,
        name,
        passwordHash: hashedPassword,
        role: "doctor",
        expiresAt,
      },
      { upsert: true, new: true }
    );

    const verificationUrl = getDoctorVerificationUrl(email);

    // Send verification email asynchronously (non-blocking)
    sendMail({
      to: email,
      subject: "Verify your MediQueue doctor account",
      text: `Hello Dr. ${name},\n\nAn admin invited you to MediQueue. Your OTP is: ${otp}\n\nThis OTP expires in 10 minutes.\n\nComplete verification here: ${verificationUrl}\n\nIf you were not expecting this invitation, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
          <h2>Verify your MediQueue doctor account</h2>
          <p>Hello Dr. ${name},</p>
          <p>An administrator created your doctor account invitation. Use the OTP below to verify your email and activate your account.</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
          <p>This OTP expires in 10 minutes.</p>
          <p>
            <a href="${verificationUrl}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
              Verify Doctor Account
            </a>
          </p>
        </div>
      `,
    }).catch((emailError) => {
      console.error(`Failed to send doctor verification email to ${email}:`, emailError.message);
      // Log but don't block doctor registration
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully. Verify the doctor's email to complete doctor registration.",
      pendingDoctor: {
        name,
        email,
        role: "doctor",
      },
      verificationUrl,
    });
});

export const verifyDoctorOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new ValidationError("Email and OTP are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    const otpRecord = await OtpRegistration.findOne({ email });

    if (!otpRecord || otpRecord.role !== "doctor") {
      throw new ValidationError("OTP not found or expired for this doctor invitation");
    }

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      throw new ValidationError("OTP expired. Please send a new verification OTP.");
    }

    const isOtpValid = compareOtp({ otp, otpHash: otpRecord.otpHash });
    if (!isOtpValid) {
      throw new ValidationError("Invalid OTP");
    }

    const doctorUser = await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.passwordHash,
      role: "doctor",
    });

    await Doctor.create({
      user: doctorUser._id,
      status: "inactive",
      isAvailable: false,
      verificationStatus: "pending",
    });

    await OtpRegistration.deleteOne({ email });

    res.status(201).json({
      success: true,
      message: "Doctor email verified and doctor account created successfully.",
      user: {
        _id: doctorUser._id,
        name: doctorUser.name,
        email: doctorUser.email,
        role: doctorUser.role,
      },
    });
});

export const updateDoctorApprovalStatus = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const { action } = req.body;

    const actionMap = {
      approve: {
        verificationStatus: "approved",
        status: "active",
        isAvailable: true,
        message: "Doctor approved successfully",
      },
      reject: {
        verificationStatus: "rejected",
        status: "inactive",
        isAvailable: false,
        message: "Doctor rejected successfully",
      },
      suspend: {
        verificationStatus: "suspended",
        status: "inactive",
        isAvailable: false,
        message: "Doctor suspended successfully",
      },
      deactivate: {
        status: "inactive",
        isAvailable: false,
        message: "Doctor deactivated successfully",
      },
      reactivate: {
        verificationStatus: "approved",
        status: "active",
        isAvailable: true,
        message: "Doctor reactivated successfully",
      },
    };

    const updates = actionMap[action];
    if (!updates) {
      throw new ValidationError("Invalid action");
    }

    const updateFields = {
      status: updates.status,
      isAvailable: updates.isAvailable,
    };

    if (updates.verificationStatus) {
      updateFields.verificationStatus = updates.verificationStatus;
    }

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      {
        $set: updateFields,
      },
      { new: true, runValidators: true }
    ).populate("user", "name email role");

    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    res.status(200).json({
      success: true,
      message: updates.message,
      doctor,
    });
});






// GET ALL USERS (ADMIN ONLY)
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });
});





// GET DOCTORS ONLY
export const getAllDoctors = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search || "";

    // Build search filter for users
    const userFilter = { role: "doctor" };
    if (searchQuery) {
      userFilter.$or = [
        { name: new RegExp(searchQuery, "i") },
        { email: new RegExp(searchQuery, "i") },
      ];
    }

    // Get user IDs that match search
    const matchingUsers = await User.find(userFilter).select("_id");
    const userIds = matchingUsers.map((u) => u._id);

    // Get doctor IDs that match specialty search
    let doctorIds = [];
    if (searchQuery) {
      const matchingDoctors = await Doctor.find({
        $or: [
          { specialization: new RegExp(searchQuery, "i") },
          { department: new RegExp(searchQuery, "i") },
          { hospital: new RegExp(searchQuery, "i") },
        ],
      }).select("user");
      doctorIds = matchingDoctors.map((d) => d.user);
    }

    // Combine IDs (user name match OR doctor specialty match)
    const combinedIds = searchQuery
      ? Array.from(new Set([...userIds, ...doctorIds]))
      : userIds;

    // Get total count
    const total = combinedIds.length;

    // Get paginated results with doctor details
    const doctors = await User.find({ _id: { $in: combinedIds } })
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Populate doctor details if needed
    const doctorsWithDetails = await Promise.all(
      doctors.map(async (user) => {
        const doctorProfile = await Doctor.findOne({ user: user._id });
        return {
          ...user.toObject(),
          doctorProfile,
        };
      })
    );

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      doctors: doctorsWithDetails,
    });
});

export const generatePlatformReport = asyncHandler(async (req, res) => {
    const [
      totalDoctors,
      pendingDoctors,
      approvedDoctors,
      suspendedDoctors,
      totalPatients,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      cancelledAppointments,
    ] = await Promise.all([
      Doctor.countDocuments({}),
      Doctor.countDocuments({ verificationStatus: "pending" }),
      Doctor.countDocuments({
        $or: [{ verificationStatus: "approved" }, { verificationStatus: { $exists: false } }],
      }),
      Doctor.countDocuments({ verificationStatus: "suspended" }),
      Patient.countDocuments({}),
      Appointment.countDocuments({}),
      Appointment.countDocuments({ status: "completed" }),
      Appointment.countDocuments({ status: "pending" }),
      Appointment.countDocuments({ status: "cancelled" }),
    ]);

    const report = {
      generatedAt: new Date(),
      doctors: {
        total: totalDoctors,
        pending: pendingDoctors,
        approved: approvedDoctors,
        suspended: suspendedDoctors,
      },
      patients: {
        total: totalPatients,
      },
      appointments: {
        total: totalAppointments,
        completed: completedAppointments,
        pending: pendingAppointments,
        cancelled: cancelledAppointments,
      },
    };

    res.status(200).json({
      success: true,
      report,
    });
});





// DELETE USER (ADMIN ONLY)
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
});



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
export const getAdminDashboardStats = asyncHandler(async (req, res) => {
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
});

// ===================== ADMIN ANALYTICS =====================

export const getAdminAnalytics = asyncHandler(async (req, res) => {
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
});
