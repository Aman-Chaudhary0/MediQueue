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
  try {
    // Validate inputs
    if (typeof otp !== "string" || otp.length === 0) {
      console.error("❌ Invalid OTP input: not a non-empty string");
      return false;
    }
    
    if (typeof otpHash !== "string" || otpHash.length === 0) {
      console.error("❌ Invalid OTP hash in database");
      return false;
    }

    // Trim whitespace from OTP input to handle frontend typos/spacing
    const trimmedOtp = otp.trim();
    const candidateHash = hashOtp(trimmedOtp);
    
    // Log for debugging
    console.log(`\n🔍 OTP Comparison Debug:`);
    console.log(`   User input OTP: "${otp}" (trimmed: "${trimmedOtp}", length: ${trimmedOtp.length})`);
    console.log(`   Candidate hash: ${candidateHash.substring(0, 16)}...`);
    console.log(`   Database hash:  ${otpHash.substring(0, 16)}...`);
    console.log(`   Hash lengths: candidate=${candidateHash.length}, database=${otpHash.length}`);
    
    // Ensure both hashes are the same length before comparison
    if (candidateHash.length !== otpHash.length) {
      console.error(`❌ Hash length mismatch: ${candidateHash.length} vs ${otpHash.length}`);
      return false;
    }
    
    // constant-time compare
    const isMatch = crypto.timingSafeEqual(Buffer.from(candidateHash), Buffer.from(otpHash));
    console.log(`   Match result: ${isMatch ? '✓ MATCH' : '✗ NO MATCH'}`);
    return isMatch;
  } catch (error) {
    console.error("❌ Error comparing OTP:", error.message);
    return false;
  }
}

