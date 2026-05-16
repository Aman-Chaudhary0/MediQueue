import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AnalyticsCharts = ({ analytics }) => {
  const weeklyAppointments = useMemo(() => {
    const list = Array.isArray(analytics?.weeklyAppointments)
      ? analytics.weeklyAppointments
      : [];
    return list.map((x) => ({
      name: x.name,
      appointments: x.appointments,
    }));
  }, [analytics]);

  const doctorPerformance = useMemo(() => {
    const list = Array.isArray(analytics?.doctorPerformance)
      ? analytics.doctorPerformance
      : [];
    return list.map((x) => ({
      name: x.name,
      patients: x.patients,
    }));
  }, [analytics]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Weekly Appointments</h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklyAppointments}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="appointments"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Doctor Performance</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={doctorPerformance}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="patients" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
