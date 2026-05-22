import express from "express";
import { passwordResetRateLimiter } from "../middlewares/authRateLimit.middleware.js";
import { validateForgotPasswordOtpInput, validateVerifyForgotPasswordOtpInput } from "../validators/forgotPasswordOtp.validators.js";
import {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
} from "../controllers/forgotPasswordOtp.controller.js";

const router = express.Router();

router.post(
  "/forgot-password-otp",
  passwordResetRateLimiter,
  validateForgotPasswordOtpInput,
  sendForgotPasswordOtp
);

router.post(
  "/forgot-password-otp/verify",
  passwordResetRateLimiter,
  validateVerifyForgotPasswordOtpInput,
  verifyForgotPasswordOtp
);

export default router;

