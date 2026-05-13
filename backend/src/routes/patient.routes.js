import express from "express";

import {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} from "../contollers/patient.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();


// CREATE
router.post("/", protect, authorizeRoles("patient"), createPatient);


// GET ALL
router.get("/", protect, getPatients);


// GET SINGLE
router.get("/:id", protect, getPatient);


// UPDATE
router.put("/:id", protect, authorizeRoles("patient"), updatePatient);


// DELETE
router.delete("/:id", protect,authorizeRoles("patient", "admin"), deletePatient);

export default router;
