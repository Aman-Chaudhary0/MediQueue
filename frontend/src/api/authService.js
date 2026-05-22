import api from "./axiosConfig.js";

// AUTH SERVICE
const authService = {
  // Register patient (OTP sent to email)
  registerPatient: async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  // Verify OTP and finish registration (returns tokens)
  verifyOtp: async (email, otp) => {
    const response = await api.post("/auth/verify-otp", {
      email,
      otp,
    });
    return response.data;
  },

  verifyDoctorOtp: async (email, otp) => {
    const response = await api.post("/auth/verify-otp", {
      email,
      otp,
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

  // Forgot password - OTP based (replaces reset link flow)
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password-otp", { email });
    return response.data;
  },

  // Verify OTP and reset password
  verifyForgotPasswordOtp: async (email, otp, newPassword) => {
    const response = await api.post("/auth/forgot-password-otp/verify", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  },



  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
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

  verifyDoctorRegistrationOtp: async (email, otp) => {
    const response = await api.post("/admin/verify-doctor-otp", {
      email,
      otp,
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
  bookAppointment: async (
    doctorId,
    appointmentDate,
    startTime,
    endTime,
    reason,
    notes = ""
  ) => {
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

  // Appointments: Get doctor dashboard stats
  getDoctorAppointmentStats: async () => {
    const response = await api.get("/appointments/doctor/stats");
    return response.data;
  },

  // Appointments: Get today's upcoming patients for doctor dashboard
  getDoctorUpcomingPatients: async () => {
    const response = await api.get("/appointments/doctor/upcoming-patients");
    return response.data;
  },

  // Appointments: Get today's full schedule for doctor dashboard
  getDoctorTodaySchedule: async () => {
    const response = await api.get("/appointments/doctor/today-schedule");
    return response.data;
  },

  // Appointments: Get single appointment details
  getAppointmentDetails: async (appointmentId) => {
    const response = await api.get(`/appointments/${appointmentId}`);
    return response.data;
  },

  // Appointments: Update appointment status
  updateAppointmentStatus: async (appointmentId, status) => {
    const response = await api.put(`/appointments/${appointmentId}/status`, {
      status,
    });
    return response.data;
  },

  // Appointments: Cancel appointment
  cancelAppointment: async (appointmentId) => {
    const response = await api.put(`/appointments/${appointmentId}/cancel`);
    return response.data;
  },

  // Live queue: get real-time queue status for current patient
  getLiveQueueStatus: async () => {
    const response = await api.get("/appointments/live-queue/status");
    return response.data;
  },

  // Admin dashboard stats
  getAdminDashboardStats: async () => {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
  },

  // Admin: doctors list with pagination and search
  getAdminDoctors: async (page = 1, limit = 10, search = "") => {
    const response = await api.get("/admin/doctors", {
      params: {
        page,
        limit,
        search,
      },
    });
    return response.data;
  },

  // Search doctors by specialization, department, or hospital
  searchDoctors: async (query, page = 1, limit = 10) => {
    const response = await api.get("/doctor/search", {
      params: {
        query,
        page,
        limit,
      },
    });
    return response.data;
  },

  // Admin analytics (charts + cards)
  getAdminAnalytics: async () => {
    const response = await api.get("/admin/analytics");
    return response.data;
  },

  // Admin: delete user (admin deletes by userId)
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
};

export default authService;
