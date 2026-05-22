import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import AuthHeader from "../../components/common/AuthHeader";
import authService from "../../api/authService";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, login } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (user?.role === "admin") navigate("/admin/dashboard", { replace: true });
    else if (user?.role === "doctor") navigate("/doctor/dashboard", { replace: true });
    else if (user?.role === "patient") navigate("/patient/dashboard", { replace: true });
    else navigate("/", { replace: true });
  }, [isAuthenticated, user, navigate]);

  if (isAuthenticated) return null;

  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // OTP modal state
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");

  // Flow state: user can "Register" only after OTP verified
  const [emailVerified, setEmailVerified] = useState(false);

  const isEmailValid = useMemo(() => {
    if (!formData.email) return false;
    // Lightweight validation; backend still validates strictly
    return /\S+@\S+\.\S+/.test(formData.email);
  }, [formData.email]);

  const isFormValidForOtp = useMemo(() => {
    // Backend /auth/register needs name, email, password (OTP stored but user not created yet)
    if (!formData.name || !formData.email || !formData.password || !formData.confirm_password) return false;
    if (formData.password !== formData.confirm_password) return false;
    if (formData.password.length < 8) return false;
    return isEmailValid;
  }, [formData, isEmailValid]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setError("");
    setSuccess("");

    // If user edits email/name/password after verifying, require re-verification
    if (id === "email" || id === "name" || id === "password" || id === "confirm_password") {
      setEmailVerified(false);
    }
  };

  const openOtpModalAndSendOtp = async (e) => {
    e?.preventDefault?.();
    setError("");
    setSuccess("");
    setOtpError("");
    setOtpSuccess("");

    if (!isFormValidForOtp) {
      setError("Please enter a valid name, email, and matching password before verifying.");
      return;
    }

    setLoading(true);
    try {
      // This triggers OTP send + stores otp payload in OtpRegistration.
      const response = await authService.registerPatient(
        formData.name,
        formData.email,
        formData.password
      );

      if (response.success) {
        setSuccess("OTP sent. Enter OTP to finish registration.");
        setPendingEmail(formData.email);
        setOtpValue("");
        setOtpError("");
        setOtpSuccess("");
        setOtpOpen(true);
      } else {
        setError(response.message || "Could not send OTP. Please try again.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to verify email. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");
    setOtpSuccess("");

    if (!otpValue || otpValue.trim().length < 4) {
      setOtpError("Enter the OTP sent to your email.");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await authService.verifyOtp(pendingEmail, otpValue.trim());

      if (response.success) {
        // Backend sets cookies + returns accessToken
        login(response.user, response.accessToken);

        setEmailVerified(true);
        setOtpSuccess("OTP verified! Redirecting...");
        setTimeout(() => {
          window.location.href = "/patient/dashboard";
        }, 600);
      } else {
        setOtpError(response.message || "Invalid OTP.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "OTP verification failed. Please try again.";
      setOtpError(errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <AuthHeader />

      {/* ================================ Register FORM =========================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 sm:py-0">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6 text-center">
            <img
              src={assets.homepage_logo}
              alt="logo"
              className="w-10 h-10 mx-auto mb-2 rounded-full"
            />
            <h1 className="text-xl font-semibold">
              Medi<span className="text-blue-800">Queue</span>
            </h1>
            <p className="text-xs italic">Your health, our priority</p>
          </div>

          <div className="p-6 sm:p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-center">
              Create Account
            </h2>
            <p className="text-xs sm:text-sm italic mb-4 sm:mb-6 text-center">
              Verify your email using OTP to finish registration
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                {success}
              </div>
            )}

            <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  placeholder="Enter Your Full Name"
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <div className="flex gap-2 mt-1">
                  <input
                    placeholder="Enter Your Email"
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="flex-1 p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                  <button
                    type="button"
                    onClick={openOtpModalAndSendOtp}
                    disabled={loading || !isFormValidForOtp}
                    className="shrink-0 bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    aria-label="Verify Email"
                    title="Send OTP to this email"
                  >
                    {loading ? "Sending..." : emailVerified ? "Verified" : "Verify"}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  placeholder="Enter your password"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use 8+ characters with uppercase, lowercase, number, and special character.
                </p>
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  placeholder="Confirm your password"
                  type="password"
                  id="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-xs sm:text-sm text-blue-900">
                New accounts are registered as patients by default.
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (emailVerified) {
                      navigate("/patient/dashboard", { replace: true });
                    } else {
                      setError("Please verify your email using OTP before registering.");
                    }
                  }}
                  disabled={!emailVerified}
                  className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {emailVerified ? "Registered ✓" : "Register (after OTP verification)"}
                </button>
              </div>

              <p className="text-center text-xs sm:text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:underline"
                >
                  Login here
                </button>
              </p>
            </form>
          </div>

          {/* ===================== Info Box =========================== */}
          <div className="mt-4 sm:mt-6 p-6 sm:p-8 bg-white rounded-lg shadow-lg text-center">
            <p className="text-xs sm:text-sm font-semibold mb-3">Are you a Doctor?</p>
            <p className="text-xs sm:text-sm mb-3">
              Contact an administrator to create your account
            </p>
            <button
              type="button"
              onClick={() => navigate("/contact-us")}
              className="w-full bg-gray-600 text-white py-2 sm:py-3 px-4 text-sm sm:text-base rounded-md hover:bg-gray-700 transition-colors"
            >
              Contact Admin
            </button>
          </div>
        </div>
      </div>

      {/* ===================== OTP Modal =========================== */}
      {otpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">Verify OTP</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Enter the OTP sent to{" "}
                  <span className="font-semibold">{pendingEmail}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!otpLoading) setOtpOpen(false);
                }}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form className="mt-4 space-y-3" onSubmit={handleVerifyOtp}>
              {otpError && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                  {otpError}
                </div>
              )}

              {otpSuccess && (
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                  {otpSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  OTP
                </label>
                <input
                  value={otpValue}
                  onChange={(e) => {
                    setOtpValue(e.target.value);
                    setOtpError("");
                  }}
                  placeholder="Enter 6-digit OTP"
                  inputMode="numeric"
                  className="w-full mt-1 p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </button>

              <p className="text-center text-xs text-gray-500">
                Didn’t receive OTP? (OTP is sent on clicking Verify.)
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
