import express from "express";

import {
  createDoctorProfile,
  getDoctorProfile,
  getCurrentDoctorProfile,
  getAllDoctors,
  updateDoctorProfile,
  updateCurrentDoctorProfile,
  updateDoctorStatus,
  deleteDoctor,
  searchDoctors,
} from "../controllers/doctor.controller.js";

// multipart upload 
import upload from "../middlewares/upload.middleware.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { authenticatedApiRateLimiter } from "../middlewares/authRateLimit.middleware.js";
import {
  sanitizeRequest,
  validateDoctorProfileInput,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();


// PUBLIC ROUTES
// Get all doctors
router.get("/", getAllDoctors);

// Search doctors
router.get("/search", searchDoctors);

// DOCTOR ROUTES
// NOTE: must be declared before "/:doctorId" so "/me" doesn't get treated as doctorId="me"
router.get(
  "/me",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("doctor"),
  getCurrentDoctorProfile
);



// Get specific doctor
router.get("/:doctorId", getDoctorProfile);

/* Update current doctor profile */
router.put(
  "/me",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("doctor"),
  // expects multipart/form-data with file field name: profilepic
  upload.single("profilepic"),
  sanitizeRequest,
  validateDoctorProfileInput,
  updateCurrentDoctorProfile
);


// ADMIN ROUTES
// Create doctor profile (admin creates after registering doctor user)
router.post(
  "/",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("admin"),
  validateDoctorProfileInput,
  createDoctorProfile
);

// Update doctor profile (admin: any doctor, doctor: only own doctor record)
router.put(
  "/:doctorId",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("admin", "doctor"),
  validateDoctorProfileInput,
  updateDoctorProfile
);

// Update doctor status
router.patch(
  "/:doctorId/status",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("admin"),
  updateDoctorStatus
);

// Delete doctor
router.delete(
  "/:doctorId",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("admin"),
  deleteDoctor
);


export default router;
