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
} from "../contollers/appointment.controller.js";

import { getLiveQueueStatusForPatient } from "../contollers/queue.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();


// ================================== PATIENT ROUTES=======================================

// Get available slots for a doctor on a selected date
router.get("/available-slots", protect, authorizeRoles("patient"), getAvailableSlots);

// book appointment
router.post("/book", protect, authorizeRoles("patient"), bookAppointment);

// Get all patient appointments
router.get(
    "/my-appointments",
    protect,
    authorizeRoles("patient"),
    getPatientAppointments
);

router.get(
    "/doctor/stats",
    protect,
    authorizeRoles("doctor"),
    getDoctorAppointmentStats
);

router.get(
    "/doctor/upcoming-patients",
    protect,
    authorizeRoles("doctor"),
    getDoctorUpcomingPatients
);

router.get(
    "/doctor/today-schedule",
    protect,
    authorizeRoles("doctor"),
    getDoctorTodaySchedule
);


// =============================== GENERAL ROUTES==========================================

// Live queue status for patient (real-time via polling)
router.get(
    "/live-queue/status",
    protect,
    authorizeRoles("patient"),
    getLiveQueueStatusForPatient
);

// Get appointment details
router.get("/:appointmentId", protect, getAppointmentDetails);

// Cancel appointment (patient can cancel their own)
router.put(
    "/:appointmentId/cancel",
    protect,
    authorizeRoles("patient"),
    cancelAppointment
);

// Update appointment status (doctor/admin)
router.put(
    "/:appointmentId/status",
    protect,
    authorizeRoles("doctor", "admin"),
    updateAppointmentStatus
);


export default router;
