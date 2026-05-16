import api from "./axiosConfig.js";

// AUTH SERVICE
const authService = {
  // Register patient
  registerPatient: async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  // Login (patient, doctor, or admin)
  login: async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },



  // Logout
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // Get current user profile (patient)
  getPatientProfile: async () => {
    const response = await api.get("/patient/me");
    return response.data;
  },

  // Create patient record (after registration)
  createPatientRecord: async (age, mobileNo, gender, profilepic = "") => {
    const response = await api.post("/patient", {
      age,
      mobileNo,
      gender,
      profilepic,
    });
    return response.data;
  },

  // Admin: Register doctor
  registerDoctor: async (name, email, password) => {
    const response = await api.post("/admin/register-doctor", {
      name,
      email,
      password,
    });
    return response.data;
  },

  // Admin: Get all doctors
  getAllDoctors: async () => {
    const response = await api.get("/doctor");
    return response.data;
  },

  // Appointments: Get available time slots for doctor and date
  getAvailableSlots: async (doctorId, date) => {
    const response = await api.get("/appointments/available-slots", {
      params: {
        doctorId,
        date,
      },
    });
    return response.data;
  },

  // Appointments: Book appointment
  bookAppointment: async (doctorId, appointmentDate, startTime, endTime, reason, notes = "") => {
    const response = await api.post("/appointments/book", {
      doctorId,
      appointmentDate,
      startTime,
      endTime,
      reason,
      notes,
    });
    return response.data;
  },

  // Appointments: Get patient appointments
  getPatientAppointments: async () => {
    const response = await api.get("/appointments/my-appointments");
    return response.data;
  },
};

export default authService;
