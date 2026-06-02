import express from "express";

import {
  registerDoctor,
  verifyDoctorOtp,
  getAllUsers,
  getAllDoctors,
  deleteUser,
  getAdminDashboardStats,
  getAdminAnalytics,
  updateDoctorApprovalStatus,
  generatePlatformReport,
} from "../controllers/admin.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  validateDoctorOtpVerificationInput,
  validateDoctorRegistrationInput,
} from "../middlewares/validationMiddleware.js";
import { authenticatedApiRateLimiter } from "../middlewares/authRateLimit.middleware.js";

const router = express.Router();


// ADMIN ONLY ROUTES
// Register doctor (admin creates)
router.post(
  "/register-doctor",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("admin"),
  validateDoctorRegistrationInput,
  registerDoctor
);

router.post(
  "/verify-doctor-otp",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("admin"),
  validateDoctorOtpVerificationInput,
  verifyDoctorOtp
);


// Get all users
router.get(
  "/users",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("admin"),
  getAllUsers
);

// Get all doctors
router.get(
  "/doctors",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("admin"),
  getAllDoctors
);

// Delete user
router.delete(
  "/users/:userId",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("admin"),
  deleteUser
);

// Doctor approval/suspension workflow
router.patch(
  "/doctors/:doctorId/approval",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("admin"),
  updateDoctorApprovalStatus
);

// Admin dashboard stats
router.get(
  "/dashboard/stats",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("admin"),
  getAdminDashboardStats
);

// Admin analytics (charts + cards)
router.get(
  "/analytics",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("admin"),
  getAdminAnalytics
);

// Platform report
router.get(
  "/reports/platform",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("admin"),
  generatePlatformReport
);

export default router;
