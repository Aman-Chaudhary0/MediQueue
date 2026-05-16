import { BriefcaseMedical, Calendar, Clock, Users } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import authService from "../../api/authService";

const DoctorsInfo = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await authService.getAdminDashboardStats();
      setStats(response?.stats || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load dashboard stats");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // no polling needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formattedAvgWait = useMemo(() => {
    if (stats?.avgWaitTimeMinutes == null) return "—";
    return `${stats.avgWaitTimeMinutes}m`;
  }, [stats]);

  return (
    <div className="w-full py-8 sm:py-10">
      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex w-full items-center gap-4 rounded-2xl border border-blue-300 bg-blue-50 p-5 sm:p-6">
          <Users className="h-12 w-12 shrink-0 rounded-full bg-blue-200 p-1 text-blue-900" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-600">Total Patients</p>
            <p className="text-2xl font-bold">{loading ? "..." : stats?.totalPatients ?? "—"}</p>
          </div>
        </div>

        <div className="flex w-full items-center gap-4 rounded-2xl border border-green-300 bg-green-50 p-5 sm:p-6">
          <BriefcaseMedical className="h-12 w-12 shrink-0 rounded-full bg-green-200 p-1 text-green-900" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-600">Total Doctors</p>
            <p className="text-2xl font-bold">{loading ? "..." : stats?.totalDoctors ?? "—"}</p>
          </div>
        </div>

        <div className="flex w-full items-center gap-4 rounded-2xl border border-violet-300 bg-violet-50 p-5 sm:p-6">
          <Calendar className="h-12 w-12 shrink-0 rounded-full bg-violet-200 p-1 text-violet-900" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-600">Appointments Today</p>
            <p className="text-2xl font-bold">{loading ? "..." : stats?.appointmentsToday ?? "—"}</p>
          </div>
        </div>

        <div className="flex w-full items-center gap-4 rounded-2xl border border-orange-300 bg-orange-50 p-5 sm:p-6">
          <Clock className="h-12 w-12 shrink-0 rounded-full bg-orange-200 p-1 text-orange-900" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-600">Average wait time</p>
            <p className="text-2xl font-bold">{loading ? "..." : formattedAvgWait}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsInfo;
