import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../../components/common/AuthHeader";
import authService from "../../api/authService";
import { assets } from "../../assets/assets";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authService.forgotPassword(email);
      setSuccess(
        response?.message ||
          "If an account exists for that email, an OTP has been sent."
      );

      // move to OTP verification page
      setTimeout(() => {
        navigate(`/forgot-password-otp?email=${encodeURIComponent(email)}`);
      }, 600);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
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
            <img src={assets.homepage_logo} alt="logo" className="mx-auto mb-2 h-10 w-10 rounded-full" />
            <h1 className="text-xl font-semibold">Medi<span className="text-blue-800">Queue</span></h1>
            <p className="text-xs italic">Your health, our priority</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg sm:p-8">
            <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">Forgot Password</h2>
            <p className="mb-4 text-center text-xs italic sm:mb-6 sm:text-sm">
              Enter your email and we&apos;ll send you an OTP
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

            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
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
                  placeholder="Enter your email"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 sm:p-3 sm:text-base"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:py-3 sm:text-base"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>

            </form>

            <p className="mt-4 text-center text-xs text-gray-600 sm:text-sm">
              Remembered your password?{" "}
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

export default ForgotPassword;
