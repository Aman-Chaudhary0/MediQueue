import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../api/authService";
import { useAuth } from "../../context/AuthContext";

const PASSWORD_HINT =
  "Use at least 8 characters with uppercase, lowercase, number, and special character.";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.changePassword(
        formData.currentPassword,
        formData.newPassword
      );

      setSuccess(response?.message || "Password changed successfully.");
      setTimeout(() => {
        logout();
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
        >
          Back
        </button>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-800">Change Password</h1>
          <p className="mt-2 text-sm text-gray-500">
            Update the password for {user?.email || "your account"}.
          </p>

          {error ? (
            <div className="mt-4 rounded-md border border-red-400 bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mt-4 rounded-md border border-green-400 bg-green-100 p-3 text-sm text-green-700">
              {success}
            </div>
          ) : null}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="mt-1 text-xs text-gray-500">{PASSWORD_HINT}</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
