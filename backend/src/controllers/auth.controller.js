import User from "../models/user.model.js";
import Patient from "../models/patient.model.js";
import Doctor from "../models/docter.model.js";
import jwt from "jsonwebtoken";
import dns from "dns";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { sendMail } from "../utils/email.js";
import OtpRegistration from "../models/otp.model.js";
import { compareOtp, generateNumericOtp, hashOtp, isValidEmail } from "../utils/otp.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  ConflictError,
  UnauthorizedError,
  ValidationError,
} from "../utils/errors.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_WINDOW_MS = 15 * 60 * 1000;
const SUSPICIOUS_ACTIVITY_LOCK_WINDOW_MS = 30 * 60 * 1000;
const PASSWORD_RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
const ACCESS_TOKEN_COOKIE_MAX_AGE_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const getPasswordResetUrl = (token) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  return `${frontendUrl.replace(/\/$/, "")}/reset-password?token=${token}`;
};

const createPasswordResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  return {
    rawToken,
    hashedToken,
    expiresAt: new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS),
  };
};

const isAccountLocked = (user) => user?.lockUntil && new Date(user.lockUntil).getTime() > Date.now();

const setAccessTokenCookie = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
  });
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

const persistRefreshToken = async (userId, refreshToken) => {
  await User.updateOne(
    { _id: userId },
    {
      $set: {
        refreshTokenHash: hashToken(refreshToken),
        refreshTokenExpiresAt: new Date(Date.now() + REFRESH_TOKEN_COOKIE_MAX_AGE_MS),
      },
    }
  );
};

const clearRefreshSession = async (userId) => {
  await User.updateOne(
    { _id: userId },
    {
      $unset: {
        refreshTokenHash: 1,
        refreshTokenExpiresAt: 1,
      },
    }
  );
};

const lockAccountForSuspiciousActivity = async (userId) => {
  await User.updateOne(
    { _id: userId },
    {
      $set: {
        lockUntil: new Date(Date.now() + SUSPICIOUS_ACTIVITY_LOCK_WINDOW_MS),
      },
      $inc: {
        suspiciousActivityCount: 1,
      },
      $unset: {
        refreshTokenHash: 1,
        refreshTokenExpiresAt: 1,
      },
    }
  );
};

const issueAuthTokens = async (userId, res) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  await persistRefreshToken(userId, refreshToken);
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  return { accessToken, refreshToken };
};

const resetLoginLock = async (userId) => {
  await User.updateOne(
    { _id: userId },
    {
      $set: { failedLoginAttempts: 0, lockUntil: null },
    }
  );
};

const registerFailedLoginAttempt = async (user) => {
  const failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
  const update = {
    failedLoginAttempts,
  };

  if (failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
    update.lockUntil = new Date(Date.now() + LOGIN_LOCK_WINDOW_MS);
  }

  await User.updateOne({ _id: user._id }, { $set: update });

  return update;
};


async function hasMailServerForDomain(email) {
  const domain = email.split("@")[1]?.trim().toLowerCase();
  if (!domain) return false;

  try {
    // If no MX records, domain likely won't accept mail.
    const mx = await dns.promises.resolveMx(domain);
    return Array.isArray(mx) && mx.length > 0;
  } catch {
    return false;
  }
}

// REGISTER (OTP-based, valid emails only)
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || typeof name !== "string") {
      throw new ValidationError("Name is required");
    }
    if (!email || typeof email !== "string") {
      throw new ValidationError("Email is required");
    }
    if (!isValidEmail(email)) {
      throw new ValidationError("Invalid email address");
    }
    if (!password || typeof password !== "string") {
      throw new ValidationError("Password is required");
    }

    // deny already registered users
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    // Domain check: only send OTP if the domain has mail servers (MX records)
    const ok = await hasMailServerForDomain(email);
    if (!ok) {
      throw new ValidationError("Email domain not found. Please enter a valid email address.");
    }

    // Hash password for later account creation (after OTP verification)
    const passwordHash = await hashPassword(password);

    // Generate OTP and store hashed OTP
    const otp = generateNumericOtp({ digits: 6 });
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await OtpRegistration.findOneAndUpdate(
      { email },
      {
        email,
        otpHash,
        name,
        passwordHash,
        role: "patient",
        expiresAt,
      },
      { upsert: true, new: true }
    );

    // Send OTP email (if email fails, do not create user; inform client)
    await sendMail({
      to: email,
      subject: "Your MediQueue OTP",
      text: `Hi ${name},\n\nYour OTP for MediQueue registration is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\n— MediQueue Team`,
    });

    return res.status(200).json({
      success: true,
      message: "If the email address is correct, OTP has been sent. Please check your inbox.",
      email,
    });
});



// LOGIN
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    if (isAccountLocked(user)) {
      throw new UnauthorizedError("Account is temporarily locked due to repeated failed login attempts. Please try again later.");
    }

    // compare password
    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) {
      await registerFailedLoginAttempt(user);
      throw new UnauthorizedError("Invalid credentials");
    }

    if (user.failedLoginAttempts || user.lockUntil) {
      await resetLoginLock(user._id);
    }

    // Generate access and refresh tokens
    const { accessToken } = await issueAuthTokens(user._id, res);

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
});





// LOGOUT USER
export const logoutUser = asyncHandler(async (req, res) => {
    if (req.user?._id) {
      await clearRefreshSession(req.user._id);
    } else if (req.cookies.refreshToken) {
      try {
        const decoded = jwt.verify(
          req.cookies.refreshToken,
          process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        );
        await clearRefreshSession(decoded.id);
      } catch {
        // Ignore invalid refresh token during logout.
      }
    }

    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
});





export const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || typeof email !== "string") {
      throw new ValidationError("Email is required");
    }
    if (!isValidEmail(email)) {
      throw new ValidationError("Invalid email address");
    }
    if (!otp || typeof otp !== "string") {
      throw new ValidationError("OTP is required");
    }

    const otpRecord = await OtpRegistration.findOne({ email });

    // If OTP isn't in DB, treat it as "OTP not requested / invalid email / expired"
    // (This avoids leaking account-existence info; client can still show a generic warning.)
    if (!otpRecord) {
      throw new ValidationError("OTP not found or expired. Please click Verify again to resend OTP.");
    }

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      throw new ValidationError("OTP expired. Please click Verify again to resend OTP.");
    }

    const isOtpValid = compareOtp({ otp, otpHash: otpRecord.otpHash });
    if (!isOtpValid) {
      throw new ValidationError("Invalid OTP");
    }

    // create user based on the pending role
    const user = await User.create({
      name: otpRecord.name,
      email,
      password: otpRecord.passwordHash,
      role: otpRecord.role,
    });

    if (otpRecord.role === "doctor") {
      await Doctor.create({
        user: user._id,
      });
    } else {
      await Patient.create({
        user: user._id,
      });
    }

    // delete otp record
    await OtpRegistration.deleteOne({ email });

    // login (issue tokens + cookies)
    const { accessToken } = await issueAuthTokens(user._id, res);

    return res.status(201).json({
      success: true,
      message: "OTP verified. Registration complete",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
});


// REFRESH TOKEN
export const refreshTokenController = asyncHandler(async (req, res) => {
    let token;

    // Get refresh token from Bearer header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Get refresh token from cookies if not in header
    if (!token && req.cookies.refreshToken) {
      token = req.cookies.refreshToken;
    }

    if (!token) {
      throw new UnauthorizedError("No refresh token provided");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    } catch (error) {
      clearAuthCookies(res);
      throw error;
    }

    if (decoded.type !== "refresh") {
      clearAuthCookies(res);
      throw new UnauthorizedError("Invalid refresh token");
    }

    const user = await User.findById(decoded.id).select("refreshTokenHash refreshTokenExpiresAt lockUntil");

    if (!user?.refreshTokenHash || !user?.refreshTokenExpiresAt) {
      clearAuthCookies(res);
      throw new UnauthorizedError("Refresh session not found");
    }

    if (new Date(user.refreshTokenExpiresAt).getTime() <= Date.now()) {
      await clearRefreshSession(decoded.id);
      clearAuthCookies(res);
      throw new UnauthorizedError("Refresh token expired");
    }

    if (user.refreshTokenHash !== hashToken(token)) {
      await lockAccountForSuspiciousActivity(decoded.id);
      clearAuthCookies(res);
      throw new UnauthorizedError("Suspicious activity detected. Your account has been temporarily locked.");
    }

    const { accessToken, refreshToken } = await issueAuthTokens(decoded.id, res);

    res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
      accessToken,
      refreshTokenExpiresAt: new Date(Date.now() + REFRESH_TOKEN_COOKIE_MAX_AGE_MS).toISOString(),
    });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const { rawToken, hashedToken, expiresAt } = createPasswordResetToken();
    const resetUrl = getPasswordResetUrl(rawToken);

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          passwordResetToken: hashedToken,
          passwordResetExpiresAt: expiresAt,
        },
      }
    );

    await sendMail({
      to: user.email,
      subject: "Reset your MediQueue password",
      text: `Hello ${user.name},\n\nUse the link below to reset your MediQueue password:\n${resetUrl}\n\nThis link expires in 15 minutes.\n\nIf you did not request this, you can ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
          <h2>Reset your MediQueue password</h2>
          <p>Hello ${user.name},</p>
          <p>Click the button below to reset your password. This link expires in 15 minutes.</p>
          <p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
              Reset Password
            </a>
          </p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  }

  res.status(200).json({
    success: true,
    message: "If an account exists for that email, a password reset link has been sent.",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    throw new ValidationError("Password reset token is invalid or has expired");
  }

  const passwordHash = await hashPassword(password);

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        password: passwordHash,
        failedLoginAttempts: 0,
        lockUntil: null,
        suspiciousActivityCount: 0,
      },
      $unset: {
        passwordResetToken: 1,
        passwordResetExpiresAt: 1,
        refreshTokenHash: 1,
        refreshTokenExpiresAt: 1,
      },
    }
  );

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  if (isAccountLocked(user)) {
    throw new UnauthorizedError("Account is temporarily locked. Please try again later or reset your password.");
  }

  const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);

  if (!isCurrentPasswordValid) {
    await registerFailedLoginAttempt(user);
    throw new UnauthorizedError("Current password is incorrect");
  }

  const passwordHash = await hashPassword(newPassword);

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        password: passwordHash,
        failedLoginAttempts: 0,
        lockUntil: null,
        suspiciousActivityCount: 0,
      },
      $unset: {
        refreshTokenHash: 1,
        refreshTokenExpiresAt: 1,
        passwordResetToken: 1,
        passwordResetExpiresAt: 1,
      },
    }
  );

  clearAuthCookies(res);

  res.status(200).json({
    success: true,
    message: "Password changed successfully. Please log in again.",
  });
});
