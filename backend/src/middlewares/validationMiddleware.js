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
  // Validate phone number (both mobileNo and mobileno variations)
  if (typeof req.body.mobileNo !== "undefined") {
    ensurePhoneNumber(req.body.mobileNo);
  }

  if (typeof req.body.mobileno !== "undefined") {
    ensurePhoneNumber(req.body.mobileno);
  }

  // Validate age
  if (typeof req.body.age !== "undefined" && req.body.age !== "") {
    const age = Number(req.body.age);
    if (isNaN(age) || age < 0 || age > 150) {
      throw new ValidationError("Age must be a valid number between 0 and 150");
    }
  }

  // Validate medical history (optional string)
  if (typeof req.body.medicalHistory !== "undefined" && req.body.medicalHistory !== null) {
    if (typeof req.body.medicalHistory !== "string") {
      throw new ValidationError("Medical history must be a text field");
    }
    if (req.body.medicalHistory.length > 2000) {
      throw new ValidationError("Medical history cannot exceed 2000 characters");
    }
  }

  // Validate allergies (optional string)
  if (typeof req.body.allergies !== "undefined" && req.body.allergies !== null) {
    if (typeof req.body.allergies !== "string") {
      throw new ValidationError("Allergies must be a text field");
    }
    if (req.body.allergies.length > 1000) {
      throw new ValidationError("Allergies cannot exceed 1000 characters");
    }
  }

  // Validate current medications (optional string)
  if (typeof req.body.currentMedications !== "undefined" && req.body.currentMedications !== null) {
    if (typeof req.body.currentMedications !== "string") {
      throw new ValidationError("Current medications must be a text field");
    }
    if (req.body.currentMedications.length > 2000) {
      throw new ValidationError("Current medications cannot exceed 2000 characters");
    }
  }

  // Validate emergency contact (optional object)
  if (typeof req.body.emergencyContact !== "undefined" && req.body.emergencyContact !== null) {
    let emergencyContactObj;
    
    // Handle string JSON from FormData
    if (typeof req.body.emergencyContact === "string") {
      try {
        emergencyContactObj = JSON.parse(req.body.emergencyContact);
      } catch (e) {
        throw new ValidationError("Emergency contact must be a valid object");
      }
    } else {
      emergencyContactObj = req.body.emergencyContact;
    }

    if (typeof emergencyContactObj !== "object") {
      throw new ValidationError("Emergency contact must be an object");
    }

    // Validate name (optional)
    if (emergencyContactObj.name !== undefined && emergencyContactObj.name !== "") {
      if (typeof emergencyContactObj.name !== "string" || emergencyContactObj.name.length > 100) {
        throw new ValidationError("Emergency contact name must be a text field not exceeding 100 characters");
      }
    }

    // Validate relationship (optional)
    if (emergencyContactObj.relationship !== undefined && emergencyContactObj.relationship !== "") {
      if (typeof emergencyContactObj.relationship !== "string" || emergencyContactObj.relationship.length > 50) {
        throw new ValidationError("Relationship must be a text field not exceeding 50 characters");
      }
    }

    // Validate phone (optional, but if present must be valid)
    if (emergencyContactObj.phone !== undefined && emergencyContactObj.phone !== "") {
      ensurePhoneNumber(emergencyContactObj.phone, "Emergency contact phone number is invalid");
    }
  }

  // Validate insurance details (optional object)
  if (typeof req.body.insuranceDetails !== "undefined" && req.body.insuranceDetails !== null) {
    let insuranceObj;
    
    // Handle string JSON from FormData
    if (typeof req.body.insuranceDetails === "string") {
      try {
        insuranceObj = JSON.parse(req.body.insuranceDetails);
      } catch (e) {
        throw new ValidationError("Insurance details must be a valid object");
      }
    } else {
      insuranceObj = req.body.insuranceDetails;
    }

    if (typeof insuranceObj !== "object") {
      throw new ValidationError("Insurance details must be an object");
    }

    // Validate provider (optional)
    if (insuranceObj.provider !== undefined && insuranceObj.provider !== "") {
      if (typeof insuranceObj.provider !== "string" || insuranceObj.provider.length > 100) {
        throw new ValidationError("Insurance provider must not exceed 100 characters");
      }
    }

    // Validate policy number (optional)
    if (insuranceObj.policyNumber !== undefined && insuranceObj.policyNumber !== "") {
      if (typeof insuranceObj.policyNumber !== "string" || insuranceObj.policyNumber.length > 50) {
        throw new ValidationError("Policy number must not exceed 50 characters");
      }
    }

    // Validate group number (optional)
    if (insuranceObj.groupNumber !== undefined && insuranceObj.groupNumber !== "") {
      if (typeof insuranceObj.groupNumber !== "string" || insuranceObj.groupNumber.length > 50) {
        throw new ValidationError("Group number must not exceed 50 characters");
      }
    }
  }
});

export const validateRescheduleInput = runValidation((req) => {
  ensureRequiredString(req.body.appointmentDate, "appointmentDate is required");
  ensureFutureOrTodayDate(req.body.appointmentDate);
  ensureRequiredString(req.body.startTime, "startTime is required");
  ensureRequiredString(req.body.endTime, "endTime is required");
});

export const validateReviewInput = runValidation((req) => {
  const rating = Number(req.body.rating);
  if (!req.body.rating || isNaN(rating) || rating < 1 || rating > 5) {
    throw new ValidationError("Rating must be a number between 1 and 5");
  }
  if (req.body.review !== undefined && String(req.body.review).length > 1000) {
    throw new ValidationError("Review cannot exceed 1000 characters");
  }
});
