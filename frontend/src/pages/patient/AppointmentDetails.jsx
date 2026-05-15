import React from 'react'
import { useParams } from "react-router-dom";

const AppointmentDetails = () => {
    const appointment = {
        patientName: "Aman Kumar",
        doctorName: "Dr. Sharma",
        specialization: "Cardiologist",
        hospital: "City Care Hospital",
        date: "12 May 2026",
        time: "10:30 AM",
        token: "A15",
        status: "pending", // pending | completed | cancelled
        fees: 500,
    };

    const getStatusStyle = () => {
        if (appointment.status === "completed")
            return "bg-green-100 text-green-600";
        if (appointment.status === "pending")
            return "bg-yellow-100 text-yellow-600";
        return "bg-red-100 text-red-600";
    };


// ==========================================================================================================================================================================

    return (
        <div className="bg-gray-50 min-h-screen p-6">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Appointment Details
                </h1>
                <p className="text-gray-500 text-sm">
                    View complete information about your appointment
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">

                {/* Top Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">
                            {appointment.doctorName}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {appointment.specialization}
                        </p>
                    </div>

                    <span
                        className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusStyle()}`}
                    >
                        {appointment.status.toUpperCase()}
                    </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <p className="text-gray-500 text-sm">Patient Name</p>
                        <p className="font-medium">{appointment.patientName}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Token Number</p>
                        <p className="font-medium">{appointment.token}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Date</p>
                        <p className="font-medium">{appointment.date}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Time</p>
                        <p className="font-medium">{appointment.time}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Hospital</p>
                        <p className="font-medium">{appointment.hospital}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Consultation Fees</p>
                        <p className="font-medium">â‚¹{appointment.fees}</p>
                    </div>

                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8">

                    {appointment.status === "pending" && (
                        <button className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
                            Cancel Appointment
                        </button>
                    )}

                    <button className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100">
                        Back
                    </button>
                </div>

            </div>
        </div>
    )
}

export default AppointmentDetails