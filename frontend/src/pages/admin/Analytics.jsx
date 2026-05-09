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

const Analytics = () => {
    return (
        <div className="bg-gray-50 min-h-screen p-6">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Analytics Dashboard
                </h1>
                <p className="text-gray-500 text-sm">
                    Monitor system performance and insights
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">

                <div className="bg-white p-5 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Appointments</p>
                    <h2 className="text-2xl font-bold text-blue-600">320</h2>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Completed</p>
                    <h2 className="text-2xl font-bold text-green-600">250</h2>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Pending</p>
                    <h2 className="text-2xl font-bold text-yellow-500">50</h2>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Cancelled</p>
                    <h2 className="text-2xl font-bold text-red-500">20</h2>
                </div>
            </div>

            {/* Charts Section */}
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

            {/* Bottom Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                {/* Average Wait Time */}
                <div className="bg-white p-5 rounded-xl shadow">
                    <h3 className="text-lg font-semibold mb-2">
                        Average Wait Time
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                        18 mins
                    </p>
                </div>

                {/* Top Doctor */}
                <div className="bg-white p-5 rounded-xl shadow">
                    <h3 className="text-lg font-semibold mb-2">
                        Top Performing Doctor
                    </h3>
                    <p className="text-xl font-medium">Dr. Sharma</p>
                    <p className="text-gray-500 text-sm">
                        40 patients handled today
                    </p>
                </div>

            </div>

        </div>
    )
}

export default Analytics