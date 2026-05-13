import express from "express";

import {
    bookAppointment,
    getPatientAppointments,
    getAppointmentDetails,
    cancelAppointment,
    updateAppointmentStatus,
} from "../contollers/appointmentController.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();


// ================================== PATIENT ROUTES=======================================

// book appointment
router.post("/book", protect, authorizeRoles("patient"), bookAppointment);

// Get all patient appointments
router.get(
    "/my-appointments",
    protect,
    authorizeRoles("patient"),
    getPatientAppointments
);


// =============================== GENERAL ROUTES==========================================
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
