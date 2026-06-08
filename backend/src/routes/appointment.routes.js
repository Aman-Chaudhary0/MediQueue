import express from "express";

import {
  bookAppointment,
  getAvailableSlots,
  getPatientAppointments,
  getDoctorAppointmentStats,
  getDoctorUpcomingPatients,
  getDoctorTodaySchedule,
  getAppointmentDetails,
  cancelAppointment,
  rescheduleAppointment,
  markNoShow,
  sendAppointmentReminder,
  submitReview,
  updateAppointmentStatus,
  addConsultationNotes,
  getConsultationNotes,
} from "../controllers/appointment.controller.js";

import { getLiveQueueStatusForPatient } from "../controllers/queue.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { authenticatedApiRateLimiter } from "../middlewares/authRateLimit.middleware.js";
import {
  validateAppointmentBookingInput,
  validateAvailableSlotsQuery,
  validateRescheduleInput,
  validateReviewInput,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();


// ================================== PATIENT ROUTES =======================================

router.get(
  "/available-slots",
  protect, authenticatedApiRateLimiter, authorizeRoles("patient"),
  validateAvailableSlotsQuery,
  getAvailableSlots
);

router.post(
  "/book",
  protect, authenticatedApiRateLimiter, authorizeRoles("patient"),
  validateAppointmentBookingInput,
  bookAppointment
);

router.get(
  "/my-appointments",
  protect, authenticatedApiRateLimiter, authorizeRoles("patient"),
  getPatientAppointments
);

router.get(
  "/live-queue/status",
  protect, authenticatedApiRateLimiter, authorizeRoles("patient"),
  getLiveQueueStatusForPatient
);


// ================================== DOCTOR ROUTES =======================================

router.get(
  "/doctor/stats",
  protect, authenticatedApiRateLimiter, authorizeRoles("doctor"),
  getDoctorAppointmentStats
);

router.get(
  "/doctor/upcoming-patients",
  protect, authenticatedApiRateLimiter, authorizeRoles("doctor"),
  getDoctorUpcomingPatients
);

router.get(
  "/doctor/today-schedule",
  protect, authenticatedApiRateLimiter, authorizeRoles("doctor"),
  getDoctorTodaySchedule
);


// ================================== GENERAL ROUTES =======================================

router.get("/:appointmentId", protect, authenticatedApiRateLimiter, getAppointmentDetails);

router.put(
  "/:appointmentId/cancel",
  protect, authenticatedApiRateLimiter, authorizeRoles("patient", "doctor", "admin"),
  cancelAppointment
);

router.post(
  "/:appointmentId/reschedule",
  protect, authenticatedApiRateLimiter, authorizeRoles("patient", "admin"),
  validateRescheduleInput,
  rescheduleAppointment
);

router.patch(
  "/:appointmentId/no-show",
  protect, authenticatedApiRateLimiter, authorizeRoles("doctor", "admin"),
  markNoShow
);

router.post(
  "/:appointmentId/reminder",
  protect, authenticatedApiRateLimiter, authorizeRoles("admin"),
  sendAppointmentReminder
);

router.post(
  "/:appointmentId/review",
  protect, authenticatedApiRateLimiter, authorizeRoles("patient"),
  validateReviewInput,
  submitReview
);

router.put(
  "/:appointmentId/status",
  protect, authenticatedApiRateLimiter, authorizeRoles("doctor", "admin"),
  updateAppointmentStatus
);

router.put(
  "/:appointmentId/consultation-notes",
  protect, authenticatedApiRateLimiter, authorizeRoles("doctor"),
  addConsultationNotes
);

router.get(
  "/:appointmentId/consultation-notes",
  protect, authenticatedApiRateLimiter, authorizeRoles("patient", "doctor", "admin"),
  getConsultationNotes
);


export default router;
