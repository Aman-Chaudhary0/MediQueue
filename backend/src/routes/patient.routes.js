import express from "express";

import {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
  getMyPatient,
} from "../controllers/patient.controller.js";

// multipart upload (multer -> memory storage)
import upload from "../middlewares/upload.middleware.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { authenticatedApiRateLimiter } from "../middlewares/authRateLimit.middleware.js";
import {
  sanitizeRequest,
  validatePatientProfileInput,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();


// CREATE
router.post(
  "/",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("patient"),
  validatePatientProfileInput,
  createPatient
);


// GET ALL
router.get("/", protect, authenticatedApiRateLimiter, getPatients);


// GET MY PATIENT (current logged-in user)
router.get("/me", protect, authenticatedApiRateLimiter, getMyPatient);

// GET SINGLE
router.get("/:id", protect, authenticatedApiRateLimiter, getPatient);


// UPDATE
router.put(
  "/:id",
  protect,
  authenticatedApiRateLimiter,
  authorizeRoles("patient"),
  // expects multipart/form-data with file field name: profilepic
  upload.single("profilepic"),
  sanitizeRequest,
  validatePatientProfileInput,
  updatePatient
);


// DELETE
router.delete("/:id", protect, authenticatedApiRateLimiter, authorizeRoles("patient", "admin"), deletePatient);

export default router;
