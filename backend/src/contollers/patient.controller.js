import Patient from "../models/patient.model.js";


// CREATE PATIENT
export const createPatient = async (req, res) => {
  try {

    const { age, mobileNo, gender } = req.body;

    // req.user comes from auth middleware
    const patient = await Patient.create({
      user: req.user._id,
      age,
      mobileNo,
      gender,
    });

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET ALL PATIENTS
export const getPatients = async (req, res) => {
  try {

    const patients = await Patient.find()
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      patients,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET SINGLE PATIENT
export const getPatient = async (req, res) => {
  try {

    const patient = await Patient.findById(
      req.params.id
    ).populate("user", "name email");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// UPDATE PATIENT
export const updatePatient = async (req, res) => {
  try {

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Patient updated",
      patient,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// DELETE PATIENT
export const deletePatient = async (req, res) => {
  try {

    const patient = await Patient.findByIdAndDelete(
      req.params.id
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient deleted",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};