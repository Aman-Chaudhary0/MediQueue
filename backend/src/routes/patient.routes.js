import express from "express";

import {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} from "../contollers/patient.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();


// CREATE
router.post("/", protect, createPatient);


// GET ALL
router.get("/", protect, getPatients);


// GET SINGLE
router.get("/:id", protect, getPatient);


// UPDATE
router.put("/:id", protect, updatePatient);


// DELETE
router.delete("/:id", protect, deletePatient);

export default router;
