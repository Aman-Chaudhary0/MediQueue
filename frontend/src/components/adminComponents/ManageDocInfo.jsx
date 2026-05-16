import { BriefcaseMedical, ShieldPlus, UserRoundCheck } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import authService from "../../api/authService";

const ManageDocInfo = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDoctors = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await authService.getAdminDoctors();
      const list = Array.isArray(response?.doctors) ? response.doctors : [];
      setDoctors(list);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load doctors");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizedStatus = (s) => String(s || "").trim().toLowerCase();

  const counts = useMemo(() => {
    const total = doctors.length;

    const active = doctors.filter((d) => {
      const st = normalizedStatus(d.status);
      return st === "active" || st === "on-duty" || st === "onduty" || st === "onduty-today";
    }).length;

    const onLeave = doctors.filter((d) => {
      const st = normalizedStatus(d.status);
      return st === "on-leave" || st === "on leave" || st === "onleave";
    }).length;

    // No separate "today" concept exists for doctors in current backend.
    // Use active as "On Duty Today" for now.
    const onDutyToday = active;

    return { total, active, onDutyToday, onLeave };
  }, [doctors]);

  return (
    <div className="w-full py-8 sm:py-10">
      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex w-full items-center gap-4 rounded-2xl border border-blue-300 bg-blue-50 p-5 sm:p-6">
          <BriefcaseMedical className="h-12 w-12 shrink-0 rounded-full bg-blue-200 p-1 text-blue-900" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-600">Total Doctors</p>
            <p className="text-2xl font-bold">{loading ? "..." : counts.total}</p>
          </div>
        </div>

        <div className="flex w-full items-center gap-4 rounded-2xl border border-green-300 bg-green-50 p-5 sm:p-6">
          <ShieldPlus className="h-12 w-12 shrink-0 rounded-full bg-green-200 p-1 text-green-900" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-600">Active Doctors</p>
            <p className="text-2xl font-bold">{loading ? "..." : counts.active}</p>
          </div>
        </div>

        <div className="flex w-full items-center gap-4 rounded-2xl border border-violet-300 bg-violet-50 p-5 sm:p-6">
          <UserRoundCheck className="h-12 w-12 shrink-0 rounded-full bg-violet-200 p-1 text-violet-900" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-600">On Duty Today</p>
            <p className="text-2xl font-bold">{loading ? "..." : counts.onDutyToday}</p>
          </div>
        </div>

        <div className="flex w-full items-center gap-4 rounded-2xl border border-orange-300 bg-orange-50 p-5 sm:p-6">
          <UserRoundCheck className="h-12 w-12 shrink-0 rounded-full bg-orange-200 p-1 text-orange-900" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-600">On leave</p>
            <p className="text-2xl font-bold">{loading ? "..." : counts.onLeave}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDocInfo;
