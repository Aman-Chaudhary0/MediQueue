import { ValidationError } from "../utils/errors.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
const PHONE_REGEX = /^\+?[0-9\s()-]{7,20}$/;
const OTP_REGEX = /^\d{4,8}$/;
const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

const toSafeString = (value) =>
  String(value)
    .replace(/\0/g, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .trim();

const assertNoDangerousKeys = (value, path = "input") => {
  if (!value || typeof value !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoDangerousKeys(item, `${path}[${index}]`));
    return;
  }

  Object.entries(value).forEach(([key, nestedValue]) => {
    if (key.startsWith("$") || key.includes(".")) {
      throw new ValidationError(`Invalid field name detected at ${path}.${key}`);
    }

    assertNoDangerousKeys(nestedValue, `${path}.${key}`);
  });
};

const sanitizeValue = (value) => {
  if (typeof value === "string") {
    return toSafeString(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, sanitizeValue(nestedValue)])
    );
  }

  return value;
};

const sanitizeObjectInPlace = (value) => {
  if (!value || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      value[index] = sanitizeValue(value[index]);
    }
    return value;
  }

  for (const key of Object.keys(value)) {
    value[key] = sanitizeValue(value[key]);
  }

  return value;
};

const getTrimmedString = (value) => (typeof value === "string" ? value.trim() : "");

const ensureRequiredString = (value, message) => {
  if (!getTrimmedString(value)) {
    throw new ValidationError(message);
  }
};

const ensureEmail = (value, message = "Invalid email format") => {
  if (!EMAIL_REGEX.test(getTrimmedString(value))) {
    throw new ValidationError(message);
  }
};

const ensureStrongPassword = (value) => {
  if (!PASSWORD_REGEX.test(String(value || ""))) {
    throw new ValidationError(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    );
  }
};

const ensurePhoneNumber = (value, message = "Invalid phone number") => {
  const normalized = getTrimmedString(value);
  const digitCount = normalized.replace(/\D/g, "").length;

  if (!PHONE_REGEX.test(normalized) || digitCount < 10 || digitCount > 15) {
    throw new ValidationError(message);
  }
};

const ensureObjectId = (value, message) => {
  if (!OBJECT_ID_REGEX.test(getTrimmedString(value))) {
    throw new ValidationError(message);
  }
};

const ensureFutureOrTodayDate = (value, message = "Appointment date cannot be in the past") => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ValidationError("Invalid appointment date");
  }

  const candidate = new Date(date);
  candidate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (candidate < today) {
    throw new ValidationError(message);
  }
};

const runValidation = (validator) => (req, res, next) => {
  try {
    validator(req);
    next();
  } catch (error) {
    next(error);
  }
};

export const sanitizeRequest = runValidation((req) => {
  sanitizeObjectInPlace(req.query);
  sanitizeObjectInPlace(req.params);
  sanitizeObjectInPlace(req.body);

  assertNoDangerousKeys(req.query, "query");
  assertNoDangerousKeys(req.params, "params");
  assertNoDangerousKeys(req.body, "body");
});

export const validateRegisterInput = runValidation((req) => {
  ensureRequiredString(req.body.name, "Name is required");
  ensureRequiredString(req.body.email, "Email is required");
  ensureEmail(req.body.email);
  ensureRequiredString(req.body.password, "Password is required");
  ensureStrongPassword(req.body.password);
});

export const validateLoginInput = runValidation((req) => {
  ensureRequiredString(req.body.email, "Email is required");
  ensureEmail(req.body.email);
  ensureRequiredString(req.body.password, "Password is required");
});

export const validateVerifyOtpInput = runValidation((req) => {
  ensureRequiredString(req.body.email, "Email is required");
  ensureEmail(req.body.email);

  if (!OTP_REGEX.test(getTrimmedString(req.body.otp))) {
    throw new ValidationError("OTP must contain 4 to 8 digits");
  }
});

export const validateForgotPasswordInput = runValidation((req) => {
  ensureRequiredString(req.body.email, "Email is required");
  ensureEmail(req.body.email);
});

export const validateResetPasswordInput = runValidation((req) => {
  ensureRequiredString(req.body.token, "Reset token is required");
  ensureRequiredString(req.body.password, "Password is required");
  ensureStrongPassword(req.body.password);
});

export const validateChangePasswordInput = runValidation((req) => {
  ensureRequiredString(req.body.currentPassword, "Current password is required");
  ensureRequiredString(req.body.newPassword, "New password is required");
  ensureStrongPassword(req.body.newPassword);

  if (String(req.body.currentPassword) === String(req.body.newPassword)) {
    throw new ValidationError("New password must be different from the current password");
  }
});

export const validateDoctorRegistrationInput = runValidation((req) => {
  ensureRequiredString(req.body.name, "Name is required");
  ensureRequiredString(req.body.email, "Email is required");
  ensureEmail(req.body.email);
  ensureRequiredString(req.body.password, "Password is required");
  ensureStrongPassword(req.body.password);
});

export const validateDoctorOtpVerificationInput = runValidation((req) => {
  ensureRequiredString(req.body.email, "Email is required");
  ensureEmail(req.body.email);

  if (!OTP_REGEX.test(getTrimmedString(req.body.otp))) {
    throw new ValidationError("OTP must contain 4 to 8 digits");
  }
});

export const validateContactInput = runValidation((req) => {
  ensureRequiredString(req.body.name, "Name is required");
  ensureRequiredString(req.body.email, "Email is required");
  ensureEmail(req.body.email);
  ensureRequiredString(req.body.phone, "Phone number is required");
  ensurePhoneNumber(req.body.phone);
  ensureRequiredString(req.body.message, "Message is required");
});

export const validateAvailableSlotsQuery = runValidation((req) => {
  ensureRequiredString(req.query.doctorId, "doctorId is required");
  ensureObjectId(req.query.doctorId, "Invalid doctorId");
  ensureRequiredString(req.query.date, "date is required");
  ensureFutureOrTodayDate(req.query.date);
});

export const validateAppointmentBookingInput = runValidation((req) => {
  ensureRequiredString(req.body.doctorId, "doctorId is required");
  ensureObjectId(req.body.doctorId, "Invalid doctorId");
  ensureRequiredString(req.body.appointmentDate, "appointmentDate is required");
  ensureFutureOrTodayDate(req.body.appointmentDate);
  ensureRequiredString(req.body.startTime, "startTime is required");
  ensureRequiredString(req.body.endTime, "endTime is required");
});

export const validateDoctorProfileInput = runValidation((req) => {
  if (typeof req.body.userId !== "undefined") {
    ensureObjectId(req.body.userId, "Invalid userId");
  }

  if (typeof req.body.mobileNo !== "undefined") {
    ensurePhoneNumber(req.body.mobileNo);
  }

  if (typeof req.body.consultationFee !== "undefined" && Number(req.body.consultationFee) < 0) {
    throw new ValidationError("Consultation fee must be a positive number");
  }

  if (typeof req.body.experience !== "undefined" && Number(req.body.experience) < 0) {
    throw new ValidationError("Experience must be a positive number");
  }
});

export const validatePatientProfileInput = runValidation((req) => {
  if (typeof req.body.mobileNo !== "undefined") {
    ensurePhoneNumber(req.body.mobileNo);
  }

  if (typeof req.body.mobileno !== "undefined") {
    ensurePhoneNumber(req.body.mobileno);
  }

  if (typeof req.body.age !== "undefined" && Number(req.body.age) < 0) {
    throw new ValidationError("Age must be a positive number");
  }
});
