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
} from "../middlewares/validationMiddleware.js";

const router = express.Router();


// ================================== PATIENT ROUTES=======================================

// Get available slots for a doctor on a selected date
router.get(
    "/available-slots",
    protect,
    authenticatedApiRateLimiter,
    authorizeRoles("patient"),
    validateAvailableSlotsQuery,
    getAvailableSlots
);

// book appointment
router.post(
    "/book",
    protect,
    authenticatedApiRateLimiter,
    authorizeRoles("patient"),
    validateAppointmentBookingInput,
    bookAppointment
);

// Get all patient appointments
router.get(
    "/my-appointments",
    protect,
    authenticatedApiRateLimiter,
    authorizeRoles("patient"),
    getPatientAppointments
);

router.get(
    "/doctor/stats",
    protect,
    authenticatedApiRateLimiter,
    authorizeRoles("doctor"),
    getDoctorAppointmentStats
);

router.get(
    "/doctor/upcoming-patients",
    protect,
    authenticatedApiRateLimiter,
    authorizeRoles("doctor"),
    getDoctorUpcomingPatients
);

router.get(
    "/doctor/today-schedule",
    protect,
    authenticatedApiRateLimiter,
    authorizeRoles("doctor"),
    getDoctorTodaySchedule
);


// =============================== GENERAL ROUTES==========================================

// Live queue status for patient (real-time via polling)
router.get(
    "/live-queue/status",
    protect,
    authenticatedApiRateLimiter,
    authorizeRoles("patient"),
    getLiveQueueStatusForPatient
);

// Get appointment details
router.get("/:appointmentId", protect, authenticatedApiRateLimiter, getAppointmentDetails);

// Cancel appointment (patient can cancel their own)
router.put(
    "/:appointmentId/cancel",
    protect,
    authenticatedApiRateLimiter,
    authorizeRoles("patient"),
    cancelAppointment
);

// Update appointment status (doctor/admin)
router.put(
    "/:appointmentId/status",
    protect,
    authenticatedApiRateLimiter,
    authorizeRoles("doctor", "admin"),
    updateAppointmentStatus
);

// Add consultation notes and complete appointment (doctor)
router.put(
    "/:appointmentId/consultation-notes",
    protect,
    authenticatedApiRateLimiter,
    authorizeRoles("doctor"),
    addConsultationNotes
);

// Get consultation notes (patient/doctor/admin)
router.get(
    "/:appointmentId/consultation-notes",
    protect,
    authenticatedApiRateLimiter,
    authorizeRoles("patient", "doctor", "admin"),
    getConsultationNotes
);


export default router;
