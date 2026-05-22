import express from "express";

import {
  changePassword,
  forgotPassword,
  register,
  resetPassword,
  verifyOtp,
  login,
  logoutUser,
  refreshTokenController,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  validateChangePasswordInput,
  validateForgotPasswordInput,
  validateLoginInput,
  validateRegisterInput,
  validateResetPasswordInput,
  validateVerifyOtpInput,
} from "../middlewares/validationMiddleware.js";

import {
  authenticatedApiRateLimiter,
  loginRateLimiter,
  passwordResetRateLimiter,
} from "../middlewares/authRateLimit.middleware.js";

const router = express.Router();


// PUBLIC ROUTES
router.post("/register", validateRegisterInput, register);
router.post("/verify-otp", validateVerifyOtpInput, verifyOtp);
router.post("/login", loginRateLimiter, validateLoginInput, login);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshTokenController);
router.post("/forgot-password", passwordResetRateLimiter, validateForgotPasswordInput, forgotPassword);
router.post("/reset-password", passwordResetRateLimiter, validateResetPasswordInput, resetPassword);

router.post("/change-password", protect, authenticatedApiRateLimiter, validateChangePasswordInput, changePassword);


// ADMIN ONLY ROUTE
router.get(
  "/admin-dashboard",
  protect,
  authenticatedApiRateLimiter,
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
  authenticatedApiRateLimiter,
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
  authenticatedApiRateLimiter,
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
  authenticatedApiRateLimiter,
  authorizeRoles("doctor", "admin"),
  (req, res) => {
    res.json({
      message: "Appointments data",
    });
  }
);

export default router;
