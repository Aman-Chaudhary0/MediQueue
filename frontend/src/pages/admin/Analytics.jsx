import React, { useEffect, useState } from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "../../api/authService";
import AdminAppointmentsInfo from "../../components/adminComponents/AdminAppointmentsInfo";
import AnalyticsCharts from "../../components/adminComponents/AnalyticsCharts";

const Analytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");

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

  const handleGenerateReport = async () => {
    try {
      setReportLoading(true);
      setReportError("");
      setReport(null);
      const res = await authService.generatePlatformReport();
      setReport(res?.report || null);
    } catch (err) {
      setReportError(err?.response?.data?.message || "Failed to generate report");
    } finally {
      setReportLoading(false);
    }
  };

  const avgWaitText =
    analytics?.stats?.avgWaitTimeMinutes != null
      ? `${analytics.stats.avgWaitTimeMinutes} mins`
      : "—";

  const topDoctor = Array.isArray(analytics?.doctorPerformance)
    ? analytics.doctorPerformance[0]
    : null;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-500 text-sm">Monitor system performance and insights</p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={reportLoading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-60 self-start sm:self-auto"
        >
          <FileText size={16} />
          {reportLoading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 text-center">
          {error}
        </div>
      ) : null}

      {reportError ? (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 text-center">
          {reportError}
        </div>
      ) : null}

      {report ? (
        <div className="mb-6 rounded-xl border border-blue-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Platform Report</h3>
            <span className="text-xs text-gray-400">
              Generated: {new Date(report.generatedAt).toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Doctors</p>
              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex justify-between"><span>Total</span><span className="font-semibold">{report.doctors.total}</span></div>
                <div className="flex justify-between"><span>Approved</span><span className="font-semibold text-green-600">{report.doctors.approved}</span></div>
                <div className="flex justify-between"><span>Pending</span><span className="font-semibold text-yellow-600">{report.doctors.pending}</span></div>
                <div className="flex justify-between"><span>Suspended</span><span className="font-semibold text-red-600">{report.doctors.suspended}</span></div>
              </div>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Patients</p>
              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex justify-between"><span>Total</span><span className="font-semibold">{report.patients.total}</span></div>
              </div>
            </div>
            <div className="rounded-lg bg-violet-50 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Appointments</p>
              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex justify-between"><span>Total</span><span className="font-semibold">{report.appointments.total}</span></div>
                <div className="flex justify-between"><span>Completed</span><span className="font-semibold text-green-600">{report.appointments.completed}</span></div>
                <div className="flex justify-between"><span>Pending</span><span className="font-semibold text-yellow-600">{report.appointments.pending}</span></div>
                <div className="flex justify-between"><span>Cancelled</span><span className="font-semibold text-red-600">{report.appointments.cancelled}</span></div>
              </div>
            </div>
          </div>
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
            {loading ? "" : topDoctor ? `${topDoctor.patients} patients handled` : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
