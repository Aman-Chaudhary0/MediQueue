import User from "../models/user.model.js";
import OtpRegistration from "../models/otp.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { compareOtp, generateNumericOtp, hashOtp, isValidEmail } from "../utils/otp.js";
import { ValidationError } from "../utils/errors.js";
import { sendMail } from "../utils/email.js";
import { hashPassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

const PASSWORD_RESET_OTP_TTL_MS = 10 * 60 * 1000;

const issueAuthTokens = async (userId, res) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  // NOTE: This controller intentionally does not manage refresh token persistence/cookies,
  // because the existing system relies on auth.controller.js helpers.
  return { accessToken, refreshToken };
};

export const sendForgotPasswordOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    throw new ValidationError("Email is required");
  }
  if (!isValidEmail(email)) {
    throw new ValidationError("Invalid email address");
  }

  // Do not leak whether email exists
  const user = await User.findOne({ email });

  if (user) {
    const otp = generateNumericOtp({ digits: 6 });
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_OTP_TTL_MS);

    await OtpRegistration.findOneAndUpdate(
      { email },
      {
        email,
        otpHash,
        name: user.name || "",
        passwordHash: user.password, // keep existing password hash
        role: user.role || "patient",
        expiresAt,
      },
      { upsert: true, new: true }
    );

    // Send OTP email asynchronously (non-blocking)
    sendMail({
      to: email,
      subject: "MediQueue password reset OTP",
      text: `Your MediQueue password reset OTP is: ${otp}\n\nThis OTP expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
          <h2>Password Reset OTP</h2>
          <p>Your MediQueue password reset OTP is:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
          <p>This OTP expires in 10 minutes.</p>
        </div>
      `,
    }).catch((emailError) => {
      console.error(`Failed to send password reset OTP to ${email}:`, emailError.message);
      // Log but don't block password reset request
    });
  }

  res.status(200).json({
    success: true,
    message: "If an account exists for that email, an OTP has been sent.",
  });
});

export const verifyForgotPasswordOtp = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || typeof email !== "string") throw new ValidationError("Email is required");
  if (!isValidEmail(email)) throw new ValidationError("Invalid email address");
  if (!otp || typeof otp !== "string") throw new ValidationError("OTP is required");
  if (!newPassword || typeof newPassword !== "string") throw new ValidationError("New password is required");

  const otpRecord = await OtpRegistration.findOne({ email });

  if (!otpRecord) {
    throw new ValidationError("OTP not found or expired. Please request a new OTP.");
  }

  if (otpRecord.expiresAt.getTime() < Date.now()) {
    throw new ValidationError("OTP expired. Please request a new OTP.");
  }

  const isOtpValid = compareOtp({ otp, otpHash: otpRecord.otpHash });
  if (!isOtpValid) {
    throw new ValidationError("Invalid OTP");
  }

  const user = await User.findOne({ email });
  if (!user) {
    // Should not happen, but avoid leaking
    throw new ValidationError("OTP verification failed");
  }

  const passwordHash = await hashPassword(newPassword);

  user.password = passwordHash;
  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  user.suspiciousActivityCount = 0;

  // Cleanup OTP record
  await otpRecord.deleteOne();

  // Save user changes
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

