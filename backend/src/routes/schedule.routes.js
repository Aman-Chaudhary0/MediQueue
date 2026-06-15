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

// Doctor: manage own schedule
router.post("/", protect, authenticatedApiRateLimiter, authorizeRoles("doctor"), setDoctorSchedule);
router.get("/", protect, authenticatedApiRateLimiter, authorizeRoles("doctor"), getDoctorSchedule);

// IMPORTANT: specific string paths must come BEFORE /:doctorId
router.put("/fee/update", protect, authenticatedApiRateLimiter, authorizeRoles("doctor"), updateConsultationFee);
router.put("/availability/update", protect, authenticatedApiRateLimiter, authorizeRoles("doctor"), updateDoctorAvailability);
router.get("/fee/:doctorId", getConsultationFee);

// Param route last
router.get("/:doctorId", getFullWeekSchedule);

export default router;
