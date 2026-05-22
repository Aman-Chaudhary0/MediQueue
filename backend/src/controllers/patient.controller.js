// Patient profile update + create/get
import Patient from "../models/patient.model.js";
import User from "../models/user.model.js";
import imagekit from "../config/imagekit.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { InternalServerError, NotFoundError } from "../utils/errors.js";


// GET LOGGED IN PATIENT PROFILE
export const getMyPatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id }).populate("user", "name email");
    if (!patient) {
      throw new NotFoundError("Patient not found for this user");
    }
    return res.status(200).json({
      success: true,
      patient,
    });
});






// CREATE PATIENT
export const createPatient = asyncHandler(async (req, res) => {
    const { age, mobileNo, gender, profilepic  } = req.body;

    // req.user comes from auth middleware
    const patient = await Patient.create({
      user: req.user._id,
      age,
      mobileNo,
      gender,
      profilepic
    });

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient,
    });
});





// GET ALL PATIENTS
export const getPatients = asyncHandler(async (req, res) => {
    const patients = await Patient.find()
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      patients,
    });
});





// GET SINGLE PATIENT
export const getPatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(
      req.params.id
    ).populate("user", "name email");

    if (!patient) {
      throw new NotFoundError("Patient not found");
    }

    res.status(200).json({
      success: true,
      patient,
    });
});





// UPDATE PATIENT
export const updatePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ _id: req.params.id, user: req.user._id });

    if (!patient) {
      throw new NotFoundError("Patient not found for this user");
    }

    // Build patient updates from request body (frontend sends: age, fullname, gender, mobileno)
    const patientUpdates = {};
    if (typeof req.body.age !== "undefined") patientUpdates.age = req.body.age;
    if (typeof req.body.gender !== "undefined") patientUpdates.gender = req.body.gender;
    if (typeof req.body.mobileno !== "undefined") patientUpdates.mobileNo = req.body.mobileno;

    // Update profile pic if a file is provided
    if (req.file) {
      if (!imagekit || typeof imagekit.upload !== "function") {
        throw new InternalServerError(
          "ImageKit is not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT in backend/.env"
        );
      }

      const response = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/mediqueue",
      });

      patientUpdates.profilepic = response.url;
    }

    // Update related user (fullname -> user.name)
    const userUpdates = {};
    if (typeof req.body.fullname !== "undefined") userUpdates.name = req.body.fullname;

    // Apply updates
    if (Object.keys(patientUpdates).length > 0) {
      await Patient.updateOne({ _id: patient._id }, { $set: patientUpdates });
    }

    if (Object.keys(userUpdates).length > 0) {
      await User.updateOne({ _id: patient.user }, { $set: userUpdates });
    }

    const updatedPatient = await Patient.findById(patient._id).populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Patient updated",
      patient: updatedPatient,
    });
});





// DELETE PATIENT
export const deletePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findByIdAndDelete(
      req.params.id
    );

    if (!patient) {
      throw new NotFoundError("Patient not found");
    }

    res.status(200).json({
      success: true,
      message: "Patient deleted",
    });
});
