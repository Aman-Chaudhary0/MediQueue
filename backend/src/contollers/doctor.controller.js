import Doctor from "../models/docter.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import imagekit from "../config/imagekit.js";


// CREATE DOCTOR PROFILE (by admin)
export const createDoctorProfile = async (req, res) => {
  try {
    const {
      userId,
      specialization,
      department,
      experience,
      mobileNo,
      hospital,
      consultationFee,
      qualifications = [],
      bio = "",
      profilePic = null,
    } = req.body;

    // Validation
    if (
      !userId ||
      !specialization ||
      !department ||
      !experience ||
      !mobileNo ||
      !hospital ||
      !consultationFee
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user exists and is a doctor
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "doctor") {
      return res.status(400).json({
        success: false,
        message: "User is not a doctor",
      });
    }

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ user: userId });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor profile already exists for this user",
      });
    }

    // Create doctor profile
    const doctor = await Doctor.create({
      user: userId,
      specialization,
      department,
      experience,
      mobileNo,
      hospital,
      consultationFee,
      qualifications,
      bio,
      profilePic,
    });

    // Populate user data
    await doctor.populate("user", "name email");

    res.status(201).json({
      success: true,
      message: "Doctor profile created successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// GET DOCTOR PROFILE
export const getDoctorProfile = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Hardening: prevent ObjectId cast errors for special route tokens like "me"
    if (doctorId === "me") {
      return res.status(400).json({
        success: false,
        message: "Invalid doctorId: 'me' (use GET/PUT /api/doctor/me)",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctorId",
      });
    }

    const doctor = await Doctor.findById(doctorId).populate(
      "user",
      "name email"
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// GET CURRENT DOCTOR PROFILE (for logged-in doctor)
export const getCurrentDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate(
      "user",
      "name email"
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message:
          "Doctor profile not found for this account. An admin must create the doctor profile first (POST /api/doctor with required fields).",
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// GET ALL DOCTORS
export const getAllDoctors = async (req, res) => {
  try {
    const { specialization, department, hospital, status } = req.query;

    // Build filter object
    const filter = {};
    if (specialization) filter.specialization = new RegExp(specialization, "i");
    if (department) filter.department = new RegExp(department, "i");
    if (hospital) filter.hospital = new RegExp(hospital, "i");
    if (status) filter.status = status;

    const doctors = await Doctor.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

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




// UPDATE DOCTOR PROFILE (by id, admin:any doctor, doctor:self only)
export const updateDoctorProfile = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const updates = req.body;

    // If someone accidentally hits PUT /api/doctor/me on this route,
    // prevent Cast-to-ObjectId errors.
    if (doctorId === "me") {
      return res.status(400).json({
        success: false,
        message: "Invalid doctorId: 'me' (use PUT /api/doctor/me)",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctorId",
      });
    }

    // Don't allow updating user field
    delete updates.user;

    const existingDoctor = await Doctor.findById(doctorId).populate("user", "role");
    if (!existingDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // If caller is a doctor, they can update only their own profile
    if (req.user?.role === "doctor" || req.user?.role === "patient") {
      if (String(existingDoctor.user?._id) !== String(req.user?._id)) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own doctor profile",
        });
      }
    }

    const doctor = await Doctor.findByIdAndUpdate(doctorId, updates, {
      new: true,
      runValidators: true,
    }).populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// UPDATE CURRENT DOCTOR PROFILE (PUT /me)
export const updateCurrentDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    // Build doctor updates from request body
    const doctorUpdates = {};
    if (typeof req.body.specialization !== "undefined") doctorUpdates.specialization = req.body.specialization;
    if (typeof req.body.department !== "undefined") doctorUpdates.department = req.body.department;
    if (typeof req.body.experience !== "undefined") doctorUpdates.experience = req.body.experience;
    if (typeof req.body.mobileNo !== "undefined") doctorUpdates.mobileNo = req.body.mobileNo;
    if (typeof req.body.consultationFee !== "undefined") doctorUpdates.consultationFee = req.body.consultationFee;
    if (typeof req.body.hospital !== "undefined") doctorUpdates.hospital = req.body.hospital;
    if (typeof req.body.bio !== "undefined") doctorUpdates.bio = req.body.bio;
    if (typeof req.body.status !== "undefined") doctorUpdates.status = req.body.status;

    // Update profile pic if a file is provided
    if (req.file) {
      if (!imagekit || typeof imagekit.upload !== "function") {
        return res.status(500).json({
          success: false,
          message:
            "ImageKit is not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT in backend/.env",
        });
      }

      const response = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/mediqueue",
      });

      doctorUpdates.profilePic = response.url;
    }

    // Apply updates
    if (Object.keys(doctorUpdates).length > 0) {
      await Doctor.updateOne({ _id: doctor._id }, { $set: doctorUpdates });
    }

    const updatedDoctor = await Doctor.findById(doctor._id).populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// UPDATE DOCTOR STATUS
export const updateDoctorStatus = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "on-leave"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'active', 'inactive', or 'on-leave'",
      });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor status updated successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// DELETE DOCTOR
export const deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findByIdAndDelete(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





// SEARCH DOCTORS
export const searchDoctors = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query",
      });
    }

    const doctors = await Doctor.find({
      $or: [
        { specialization: new RegExp(query, "i") },
        { department: new RegExp(query, "i") },
        { hospital: new RegExp(query, "i") },
      ],
    })
      .populate("user", "name email")
      .limit(10);

    res.status(200).json({
      success: true,
      results: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
