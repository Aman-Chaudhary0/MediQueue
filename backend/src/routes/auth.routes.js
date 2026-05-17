import express from "express";

import {
  register,
  verifyOtp,
  login,
  logoutUser,
  refreshTokenController,
} from "../contollers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();


// PUBLIC ROUTES
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshTokenController);


// ADMIN ONLY ROUTE
router.get(
  "/admin-dashboard",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);


// DOCTOR ONLY ROUTE
router.get(
  "/doctor-dashboard",
  protect,
  authorizeRoles("doctor"),
  (req, res) => {
    res.json({
      message: "Welcome Doctor",
    });
  }
);


// PATIENT ONLY ROUTE
router.get(
  "/patient-dashboard",
  protect,
  authorizeRoles("patient"),
  (req, res) => {
    res.json({
      message: "Welcome Patient",
    });
  }
);


// MULTIPLE ROLES
router.get(
  "/appointments",
  protect,
  authorizeRoles("doctor", "admin"),
  (req, res) => {
    res.json({
      message: "Appointments data",
    });
  }
);

export default router;
