import api from "./axiosConfig.js";

/**
 * Patient Service
 * Handles all patient-related API calls including profile management
 */
const patientService = {
  /**
   * Get current logged-in patient's profile
   * @returns {Promise} Patient profile data
   */
  getMyProfile: async () => {
    const response = await api.get("/patient/me");
    return response.data;
  },

  /**
   * Get patient profile by ID
   * @param {string} patientId - Patient ID
   * @returns {Promise} Patient profile data
   */
  getPatientById: async (patientId) => {
    const response = await api.get(`/patient/${patientId}`);
    return response.data;
  },

  /**
   * Get all patients (Admin only)
   * @returns {Promise} Array of patient profiles
   */
  getAllPatients: async () => {
    const response = await api.get("/patient");
    return response.data;
  },

  /**
   * Create a new patient record
   * @param {Object} patientData - Patient data object
   * @returns {Promise} Created patient data
   */
  createPatient: async (patientData) => {
    const formData = new FormData();

    // Add basic info
    formData.append("age", patientData.age || "");
    formData.append("mobileNo", patientData.mobileNo || "");
    formData.append("gender", patientData.gender || "other");
    formData.append("profilepic", patientData.profilepic || "");

    // Add medical profile info
    formData.append("medicalHistory", patientData.medicalHistory || "");
    formData.append("allergies", patientData.allergies || "");
    formData.append("currentMedications", patientData.currentMedications || "");

    // Add emergency contact
    if (patientData.emergencyContact) {
      formData.append("emergencyContact", JSON.stringify(patientData.emergencyContact));
    }

    // Add insurance details
    if (patientData.insuranceDetails) {
      formData.append("insuranceDetails", JSON.stringify(patientData.insuranceDetails));
    }

    const response = await api.post("/patient", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Update patient profile
   * @param {string} patientId - Patient ID
   * @param {Object} patientData - Updated patient data
   * @param {File} profilePicFile - Optional profile picture file
   * @returns {Promise} Updated patient data
   */
  updatePatient: async (patientId, patientData, profilePicFile = null) => {
    const formData = new FormData();

    // Add basic info
    if (patientData.fullname) formData.append("fullname", patientData.fullname);
    if (patientData.age !== undefined) formData.append("age", patientData.age);
    if (patientData.mobileNo) formData.append("mobileno", patientData.mobileNo);
    if (patientData.gender) formData.append("gender", patientData.gender);

    // Add medical profile info
    if (patientData.medicalHistory !== undefined) {
      formData.append("medicalHistory", patientData.medicalHistory);
    }
    if (patientData.allergies !== undefined) {
      formData.append("allergies", patientData.allergies);
    }
    if (patientData.currentMedications !== undefined) {
      formData.append("currentMedications", patientData.currentMedications);
    }

    // Add emergency contact
    if (patientData.emergencyContact) {
      formData.append("emergencyContact", JSON.stringify(patientData.emergencyContact));
    }

    // Add insurance details
    if (patientData.insuranceDetails) {
      formData.append("insuranceDetails", JSON.stringify(patientData.insuranceDetails));
    }

    // Add profile picture if provided
    if (profilePicFile) {
      formData.append("profilepic", profilePicFile);
    }

    const response = await api.put(`/patient/${patientId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Update only medical profile information
   * @param {string} patientId - Patient ID
   * @param {Object} medicalData - Medical data to update
   * @returns {Promise} Updated patient data
   */
  updateMedicalProfile: async (patientId, medicalData) => {
    const response = await api.put(`/patient/${patientId}`, {
      medicalHistory: medicalData.medicalHistory,
      allergies: medicalData.allergies,
      currentMedications: medicalData.currentMedications,
      emergencyContact: medicalData.emergencyContact,
      insuranceDetails: medicalData.insuranceDetails,
    });
    return response.data;
  },

  /**
   * Update emergency contact information
   * @param {string} patientId - Patient ID
   * @param {Object} emergencyContactData - Emergency contact object
   * @returns {Promise} Updated patient data
   */
  updateEmergencyContact: async (patientId, emergencyContactData) => {
    const response = await api.put(`/patient/${patientId}`, {
      emergencyContact: emergencyContactData,
    });
    return response.data;
  },

  /**
   * Update insurance details
   * @param {string} patientId - Patient ID
   * @param {Object} insuranceData - Insurance details object
   * @returns {Promise} Updated patient data
   */
  updateInsuranceDetails: async (patientId, insuranceData) => {
    const response = await api.put(`/patient/${patientId}`, {
      insuranceDetails: insuranceData,
    });
    return response.data;
  },

  /**
   * Delete patient record
   * @param {string} patientId - Patient ID
   * @returns {Promise} Deletion confirmation
   */
  deletePatient: async (patientId) => {
    const response = await api.delete(`/patient/${patientId}`);
    return response.data;
  },
};

export default patientService;
