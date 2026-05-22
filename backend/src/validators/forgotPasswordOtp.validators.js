import { ValidationError } from "../utils/errors.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{4,8}$/;

const ensureRequiredString = (value, message) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(message);
  }
};

const ensureEmail = (value, message = "Invalid email format") => {
  if (!EMAIL_REGEX.test(String(value).trim())) {
    throw new ValidationError(message);
  }
};

const ensureOtp = (value, message = "OTP must contain 4 to 8 digits") => {
  if (!OTP_REGEX.test(String(value).trim())) {
    throw new ValidationError(message);
  }
};

const ensureStrongPassword = (value) => {
  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
  if (!PASSWORD_REGEX.test(String(value || ""))) {
    throw new ValidationError(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    );
  }
};

const runValidation = (validator) => (req, res, next) => {
  try {
    validator(req);
    next();
  } catch (e) {
    next(e);
  }
};

export const validateForgotPasswordOtpInput = runValidation((req) => {
  ensureRequiredString(req.body.email, "Email is required");
  ensureEmail(req.body.email);
});

export const validateVerifyForgotPasswordOtpInput = runValidation((req) => {
  ensureRequiredString(req.body.email, "Email is required");
  ensureEmail(req.body.email);

  ensureRequiredString(req.body.otp, "OTP is required");
  ensureOtp(req.body.otp);

  ensureRequiredString(req.body.newPassword, "New password is required");
  ensureStrongPassword(req.body.newPassword);
});

