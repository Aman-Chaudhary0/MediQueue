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

import { sendMail } from "../utils/email.js";
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

// TEST EMAIL ENDPOINT (development only)
router.post("/test-email", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "Not available in production" });
  }

  const { to } = req.body;
  if (!to) {
    return res.status(400).json({ error: "Email 'to' required" });
  }

  try {
    console.log(`\n📧 Testing email to: ${to}`);
    const result = await sendMail({
      to,
      subject: "Test Email from MediQueue",
      text: "This is a test email to verify your Gmail OAuth2 configuration is working.",
      html: "<h2>Test Email from MediQueue</h2><p>If you received this, your email configuration is correct!</p>",
    });
    res.json({ success: true, message: "Test email sent", messageId: result.messageId });
  } catch (error) {
    console.error("\n❌ Email test failed:", error.message);
    res.status(500).json({ error: error.message });
  }
});


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
