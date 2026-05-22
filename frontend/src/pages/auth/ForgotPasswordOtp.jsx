import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthHeader from "../../components/common/AuthHeader";
import authService from "../../api/authService";
import { assets } from "../../assets/assets";

const ForgotPasswordOtp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialEmail = useMemo(() => searchParams.get("email") || "", [searchParams]);

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is missing.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyForgotPasswordOtp(email, otp, newPassword);
      setSuccess(response?.message || "Password updated successfully.");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AuthHeader />

      <div className="flex w-full items-center justify-center px-4 py-8 lg:w-1/2 sm:py-0">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center lg:hidden">
            <img
              src={assets.homepage_logo}
              alt="logo"
              className="mx-auto mb-2 h-10 w-10 rounded-full"
            />
            <h1 className="text-xl font-semibold">
              Medi<span className="text-blue-800">Queue</span>
            </h1>
            <p className="text-xs italic">Your health, our priority</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg sm:p-8">
            <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
              Reset Password (OTP)
            </h2>
            <p className="mb-4 text-center text-xs italic sm:mb-6 sm:text-sm">
              Enter the OTP sent to your email to reset your password
            </p>

            {error ? (
              <div className="mb-4 rounded-md border border-red-400 bg-red-100 p-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="mb-4 rounded-md border border-green-400 bg-green-100 p-3 text-sm text-green-700">
                {success}
              </div>
            ) : null}

            <form className="space-y-4 sm:space-y-6" onSubmit={handleVerify}>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 sm:text-sm">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="your@email.com"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 sm:p-3 sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="otp" className="block text-xs font-medium text-gray-700 sm:text-sm">
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter OTP"
                  inputMode="numeric"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 sm:p-3 sm:text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-xs font-medium text-gray-700 sm:text-sm"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your new password"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 sm:p-3 sm:text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium text-gray-700 sm:text-sm"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Confirm your new password"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 sm:p-3 sm:text-base"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:py-3 sm:text-base"
              >
                {loading ? "Resetting..." : "Verify OTP & Reset"}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-600 sm:text-sm">
              Remembered your password?
              {" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline"
              >
                Back to login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordOtp;

