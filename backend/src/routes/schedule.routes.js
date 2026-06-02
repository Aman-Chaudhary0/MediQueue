import express from "express";
import {
  setDoctorSchedule,
  getDoctorSchedule,
  getFullWeekSchedule,
  updateConsultationFee,
  getConsultationFee,
  updateDoctorAvailability,
} from "../controllers/schedule.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { authenticatedApiRateLimiter } from "../middlewares/authRateLimit.middleware.js";

const router = express.Router();

// Doctor routes - manage their own schedule
router.post(
  "/",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("doctor"),
  setDoctorSchedule
);

router.get(
  "/",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("doctor"),
  getDoctorSchedule
);

// Public route - view doctor's schedule
router.get("/:doctorId", getFullWeekSchedule);

// Consultation fee routes
router.put(
  "/fee/update",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("doctor"),
  updateConsultationFee
);

router.get("/fee/:doctorId", getConsultationFee);

// Availability status
router.put(
  "/availability/update",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("doctor"),
  updateDoctorAvailability
);

export default router;
