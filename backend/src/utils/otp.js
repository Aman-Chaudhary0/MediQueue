import crypto from "crypto";

export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  // Simple, practical regex for email validation (not RFC-perfect)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function generateNumericOtp({ digits = 6 } = {}) {
  const d = Number(digits);
  if (!Number.isFinite(d) || d < 4 || d > 8) {
    throw new Error("digits must be between 4 and 8");
  }

  const max = 10 ** d;
  const otp = Math.floor(Math.random() * max).toString().padStart(d, "0");
  return otp;
}

export function hashOtp(otp) {
  if (typeof otp !== "string" || otp.length === 0) {
    throw new Error("otp must be a non-empty string");
  }

  // Use sha256 hash; store only hash in DB
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export function compareOtp({ otp, otpHash }) {
  const candidateHash = hashOtp(otp);
  // constant-time compare
  return crypto.timingSafeEqual(Buffer.from(candidateHash), Buffer.from(otpHash));
}
