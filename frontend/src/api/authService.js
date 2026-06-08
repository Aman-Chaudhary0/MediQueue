import api from "./axiosConfig.js";

const authService = {
  registerPatient: async (name, email, password) => {
    const response = await api.post("/auth/register", { name, email, password });
    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await api.post("/auth/verify-otp", { email, otp });
    return response.data;
  },

  verifyDoctorOtp: async (email, otp) => {
    const response = await api.post("/auth/verify-otp", { email, otp });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password-otp", { email });
    return response.data;
  },

  verifyForgotPasswordOtp: async (email, otp, newPassword) => {
    const response = await api.post("/auth/forgot-password-otp/verify", { email, otp, newPassword });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post("/auth/reset-password", { token, password });
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post("/auth/change-password", { currentPassword, newPassword });
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  getPatientProfile: async () => {
    const response = await api.get("/patient/me");
    return response.data;
  },

  createPatientRecord: async (age, mobileNo, gender, profilepic = "") => {
    const response = await api.post("/patient", { age, mobileNo, gender, profilepic });
    return response.data;
  },

  registerDoctor: async (name, email, password) => {
    const response = await api.post("/admin/register-doctor", { name, email, password });
    return response.data;
  },

  verifyDoctorRegistrationOtp: async (email, otp) => {
    const response = await api.post("/admin/verify-doctor-otp", { email, otp });
    return response.data;
  },

  getAllDoctors: async () => {
    const response = await api.get("/doctor");
    return response.data;
  },

  getAvailableSlots: async (doctorId, date) => {
    const response = await api.get("/appointments/available-slots", { params: { doctorId, date } });
    return response.data;
  },

  bookAppointment: async (doctorId, appointmentDate, startTime, endTime, reason, notes = "") => {
    const response = await api.post("/appointments/book", {
      doctorId, appointmentDate, startTime, endTime, reason, notes,
    });
    return response.data;
  },

  getPatientAppointments: async () => {
    const response = await api.get("/appointments/my-appointments");
    return response.data;
  },

  getDoctorAppointmentStats: async () => {
    const response = await api.get("/appointments/doctor/stats");
    return response.data;
  },

  getDoctorUpcomingPatients: async () => {
    const response = await api.get("/appointments/doctor/upcoming-patients");
    return response.data;
  },

  getDoctorTodaySchedule: async () => {
    const response = await api.get("/appointments/doctor/today-schedule");
    return response.data;
  },

  getAppointmentDetails: async (appointmentId) => {
    const response = await api.get(`/appointments/${appointmentId}`);
    return response.data;
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    const response = await api.put(`/appointments/${appointmentId}/status`, { status });
    return response.data;
  },

  addConsultationNotes: async (appointmentId, notesData) => {
    const response = await api.put(`/appointments/${appointmentId}/consultation-notes`, notesData);
    return response.data;
  },

  // Cancel appointment with optional reason
  cancelAppointment: async (appointmentId, reason = "") => {
    const response = await api.put(`/appointments/${appointmentId}/cancel`, { reason });
    return response.data;
  },

  // Reschedule appointment to a new date/time slot
  rescheduleAppointment: async (appointmentId, appointmentDate, startTime, endTime) => {
    const response = await api.post(`/appointments/${appointmentId}/reschedule`, {
      appointmentDate, startTime, endTime,
    });
    return response.data;
  },

  // Mark appointment as no-show (doctor/admin)
  markNoShow: async (appointmentId) => {
    const response = await api.patch(`/appointments/${appointmentId}/no-show`);
    return response.data;
  },

  // Send appointment reminder email (admin)
  sendAppointmentReminder: async (appointmentId) => {
    const response = await api.post(`/appointments/${appointmentId}/reminder`);
    return response.data;
  },

  // Submit rating and review after completed appointment (patient)
  submitReview: async (appointmentId, rating, review) => {
    const response = await api.post(`/appointments/${appointmentId}/review`, { rating, review });
    return response.data;
  },

  getLiveQueueStatus: async () => {
    const response = await api.get("/appointments/live-queue/status");
    return response.data;
  },

  getAdminDashboardStats: async () => {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
  },

  getAdminDoctors: async (page = 1, limit = 10, search = "") => {
    const response = await api.get("/admin/doctors", { params: { page, limit, search } });
    return response.data;
  },

  searchDoctors: async (query, page = 1, limit = 10) => {
    const response = await api.get("/doctor/search", { params: { query, page, limit } });
    return response.data;
  },

  getAdminAnalytics: async () => {
    const response = await api.get("/admin/analytics");
    return response.data;
  },

  updateDoctorApprovalStatus: async (doctorId, action) => {
    const response = await api.patch(`/admin/doctors/${doctorId}/approval`, { action });
    return response.data;
  },

  generatePlatformReport: async () => {
    const response = await api.get("/admin/reports/platform");
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getCurrentDoctorProfile: async () => {
    const response = await api.get("/doctor/me");
    return response.data;
  },

  getDoctorSchedule: async () => {
    const response = await api.get("/schedule");
    return response.data;
  },

  setDoctorSchedule: async (scheduleData) => {
    const response = await api.post("/schedule", scheduleData);
    return response.data;
  },

  updateConsultationFee: async (consultationFee) => {
    const response = await api.put("/schedule/fee/update", { consultationFee });
    return response.data;
  },

  updateDoctorAvailability: async (isAvailable) => {
    const response = await api.put("/schedule/availability/update", { isAvailable });
    return response.data;
  },
};

export default authService;
