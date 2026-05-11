import React from 'react'

import AdminAppointmentsInfo from '../../components/adminComponents/AdminAppointmentsInfo';
import AnalyticsCharts from '../../components/adminComponents/AnalyticsCharts';


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
           <AdminAppointmentsInfo />
            {/* Charts Section */}
           <AnalyticsCharts />

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