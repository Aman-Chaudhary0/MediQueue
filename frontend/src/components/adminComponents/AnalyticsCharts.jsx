import React from 'react'
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

const data = [
    { name: "Mon", appointments: 30 },
    { name: "Tue", appointments: 45 },
    { name: "Wed", appointments: 28 },
    { name: "Thu", appointments: 50 },
    { name: "Fri", appointments: 40 },
    { name: "Sat", appointments: 60 },
    { name: "Sun", appointments: 20 },
];

const doctors = [
    { name: "Dr A", patients: 20 },
    { name: "Dr B", patients: 35 },
    { name: "Dr C", patients: 25 },
    { name: "Dr D", patients: 40 },
];


const AnalyticsCharts = () => {

// ==========================================================================================================================================================================

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Line Chart */}
                <div className="bg-white p-5 rounded-xl shadow">
                    <h3 className="text-lg font-semibold mb-4">
                        Weekly Appointments
                    </h3>

                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={data}>
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

                {/* Bar Chart */}
                <div className="bg-white p-5 rounded-xl shadow">
                    <h3 className="text-lg font-semibold mb-4">
                        Doctor Performance
                    </h3>

                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={doctors}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="patients" fill="#22c55e" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
  )
}

export default AnalyticsCharts