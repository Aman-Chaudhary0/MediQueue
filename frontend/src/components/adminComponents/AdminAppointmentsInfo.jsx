import React, { useMemo } from "react";

const AdminAppointmentsInfo = ({ analytics, loading }) => {
  const cards = useMemo(() => {
    const stats = analytics?.stats || {};
    const appointmentsToday = stats?.appointmentsToday ?? null;

    // We only have avgWaitTimeMinutes + appointmentsToday from backend dashboard stats.
    // For completed/pending/cancelled we will approximate from appointmentsToday if analytics doesn't provide them.
    // If backend later adds more fields, this can be adjusted.
    const completed = stats?.completedToday ?? null;
    const pending = stats?.pendingToday ?? null;
    const cancelled = stats?.cancelledToday ?? null;

    return {
      total: appointmentsToday,
      completed,
      pending,
      cancelled,
    };
  }, [analytics]);

  const renderValue = (value) => {
    if (loading) return "...";
    if (value == null) return "—";
    return value;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
      <div className="bg-white p-5 rounded-xl shadow">
        <p className="text-gray-500 text-sm">Total Appointments</p>
        <h2 className="text-2xl font-bold text-blue-600">{renderValue(cards.total)}</h2>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <p className="text-gray-500 text-sm">Completed</p>
        <h2 className="text-2xl font-bold text-green-600">{renderValue(cards.completed)}</h2>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <p className="text-gray-500 text-sm">Pending</p>
        <h2 className="text-2xl font-bold text-yellow-500">{renderValue(cards.pending)}</h2>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <p className="text-gray-500 text-sm">Cancelled</p>
        <h2 className="text-2xl font-bold text-red-500">{renderValue(cards.cancelled)}</h2>
      </div>
    </div>
  );
};

export default AdminAppointmentsInfo;
