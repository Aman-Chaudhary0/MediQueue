import express from "express";

import {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
  getMyPatient,
} from "../contollers/patient.controller.js";

// multipart upload (multer -> memory storage)
import upload from "../middlewares/upload.middleware.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();


// CREATE
router.post("/", protect, authorizeRoles("patient"), createPatient);


// GET ALL
router.get("/", protect, getPatients);


// GET MY PATIENT (current logged-in user)
router.get("/me", protect, getMyPatient);

// GET SINGLE
router.get("/:id", protect, getPatient);


// UPDATE
router.put(
  "/:id",
  protect,
  authorizeRoles("patient"),
  // expects multipart/form-data with file field name: profilepic
  upload.single("profilepic"),
  updatePatient
);


// DELETE
router.delete("/:id", protect,authorizeRoles("patient", "admin"), deletePatient);

export default router;
