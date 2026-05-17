import React, { useEffect, useState } from "react";
import authService from "../../api/authService";
import AdminAppointmentsInfo from "../../components/adminComponents/AdminAppointmentsInfo";
import AnalyticsCharts from "../../components/adminComponents/AnalyticsCharts";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await authService.getAdminAnalytics();
        setAnalytics(res?.analytics || null);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load analytics");
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const avgWaitText =
    analytics?.stats?.avgWaitTimeMinutes != null
      ? `${analytics.stats.avgWaitTimeMinutes} mins`
      : "—";

  const topDoctor = Array.isArray(analytics?.doctorPerformance)
    ? analytics.doctorPerformance[0]
    : null;



    // ====================================================================
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Analytics Dashboard
        </h1>
        <p className="text-gray-500 text-sm">Monitor system performance and insights</p>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 text-center">
          {error}
        </div>
      ) : null}

      <AdminAppointmentsInfo analytics={analytics} loading={loading} />

      <AnalyticsCharts analytics={analytics} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Average Wait Time</h3>
          <p className="text-3xl font-bold text-blue-600">
            {loading ? "..." : avgWaitText}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Top Performing Doctor</h3>
          <p className="text-xl font-medium">
            {loading ? "..." : topDoctor?.name || "—"}
          </p>
          <p className="text-gray-500 text-sm">
            {loading
              ? ""
              : topDoctor
                ? `${topDoctor.patients} patients handled in last 7 days`
                : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
