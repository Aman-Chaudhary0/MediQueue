import { CircleCheck, ClipboardCheck, Clock, RefreshCcw, Users, Phone, Calendar, CheckCircle, SkipForward, FastForward, Settings, Info, RefreshCw } from 'lucide-react'

import React from 'react'

const CurrentPatient = () => {



 const patient = {
        token: "A10",
        name: "Rohit Kumar",
        age: 28,
        gender: "Male",
        phone: "9876543210",
        type: "Follow-up Consultation",
        time: "10:30 AM",
        date: "20 May 2024",
    };

    const details = {
        name: "Rohit Kumar",
        age: 28,
        gender: "Male",
        contact: "9876543210",
        token: "A10",
        arrival: "10:15 AM",
        type: "Follow-up",
        time: "10:30 AM",
        doctor: "Dr. Rajesh Sharma",
        notes: "Regular checkup",
        previousVisit: "10 Apr 2024",
    };

        function DetailRow({ label, value }) {
        return (
            <div className="flex flex-col gap-1 pb-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <span className="text-gray-500 text-sm">{label}</span>
                <span className="font-medium text-gray-800 sm:text-right">{value}</span>
            </div>
        );
    }




  return (
   <section>
                {/* ========================== current patient card =========================== */}
                <div className="bg-white shadow-lg rounded-2xl p-6 w-full">

                    {/* Heading */}
                    <h2 className="text-blue-600 font-semibold mb-4">CURRENT PATIENT</h2>

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        {/* Token Section */}
                        <div className="text-center lg:min-w-45">
                            <p className="text-gray-500 text-sm">TOKEN NO.</p>
                            <h1 className="text-4xl sm:text-5xl font-bold text-green-600">{patient.token}</h1>
                            <p className="text-green-600 text-sm mt-1">In Consultation</p>
                        </div>

                        {/* Avatar + Info */}
                        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left lg:flex-1">

                            {/* Avatar */}
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                alt="patient"
                                className="w-20 h-20 rounded-full"
                            />

                            {/* Details */}
                            <div className="min-w-0">
                                <h3 className="text-xl font-semibold">{patient.name}</h3>
                                <p className="text-gray-500 text-sm">
                                    {patient.age} yrs, {patient.gender}
                                </p>

                                <div className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-600 sm:justify-start">
                                    <Phone size={16} />
                                    {patient.phone}
                                </div>

                                <div className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-600 sm:justify-start">
                                    <Calendar size={16} />
                                    {patient.type}
                                </div>

                                <div className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-600 sm:justify-start">
                                    <Clock size={16} />
                                    {patient.time} • {patient.date}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4 mt-6">

                        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 sm:w-auto">
                            <CheckCircle size={18} />
                            Mark as Completed
                        </button>

                        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-yellow-500 px-4 py-2 text-yellow-600 hover:bg-yellow-50 sm:w-auto">
                            <FastForward size={18} />
                            Next Patient (A11)
                        </button>

                        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500 px-4 py-2 text-red-600 hover:bg-red-50 sm:w-auto">
                            <SkipForward size={18} />
                            Skip Patient
                        </button>
                    </div>
                </div>



                {/* ============================= PATIENT DETAILS =================================== */}
                <div className="bg-white shadow-lg rounded-2xl p-6 mt-6">

                    {/* Heading */}
                    <h2 className="text-blue-600 font-semibold mb-4">
                        PATIENT DETAILS
                    </h2>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Left Column */}
                        <div className="space-y-3">
                            <DetailRow label="Patient Name" value={details.name} />
                            <DetailRow label="Age / Gender" value={`${details.age} yrs / ${details.gender}`} />
                            <DetailRow label="Contact" value={details.contact} />
                            <DetailRow label="Token Number" value={details.token} />
                            <DetailRow label="Arrival Time" value={details.arrival} />
                        </div>

                        {/* Right Column */}
                        <div className="space-y-3">
                            <DetailRow label="Consultation Type" value={details.type} />
                            <DetailRow label="Appointment Time" value={details.time} />
                            <DetailRow label="Doctor" value={details.doctor} />
                            <DetailRow label="Notes" value={details.notes} />
                            <DetailRow label="Previous Visit" value={details.previousVisit} />
                        </div>
                    </div>

                    {/* Bottom Note */}
                    <div className="mt-6 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                        ⚠️ No previous prescriptions found for this patient.
                    </div>
                </div>
            </section>
  )
}

export default CurrentPatient