import { CircleCheck, ClipboardCheck, Clock, RefreshCcw, Users, Phone, Calendar, CheckCircle, SkipForward, FastForward, Settings, Info, RefreshCw } from 'lucide-react'
import React from 'react'

const QueueManagement = () => {

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

    const patients = [
        { token: "A11", name: "Neha Singh", age: 32, gender: "Female", time: "10:45 AM", status: "Next" },
        { token: "A12", name: "Vikram Mehta", age: 45, gender: "Male", time: "11:00 AM", status: "Waiting" },
        { token: "A13", name: "Pooja Sharma", age: 29, gender: "Female", time: "11:15 AM", status: "Waiting" },
        { token: "A14", name: "Arjun Patel", age: 38, gender: "Male", time: "11:30 AM", status: "Waiting" },
        { token: "A15", name: "Sneha Reddy", age: 27, gender: "Female", time: "11:45 AM", status: "Waiting" },
        { token: "A16", name: "Karan Verma", age: 50, gender: "Male", time: "12:00 PM", status: "Waiting" },
        { token: "A17", name: "Anjali Gupta", age: 34, gender: "Female", time: "12:15 PM", status: "Waiting" },
        { token: "A18", name: "Deepak Sharma", age: 41, gender: "Male", time: "12:30 PM", status: "Waiting" },
    ];


    function DetailRow({ label, value }) {
        return (
            <div className="flex justify-between  pb-1">
                <span className="text-gray-500 text-sm">{label}</span>
                <span className="font-medium text-gray-800">{value}</span>
            </div>
        );
    }

    return (
        <div className='p-6 m-2'>

            {/* ================================ TITLE ================== */}
            <div className='flex items-center justify-between mb-8'>
                <h1 className='text-2xl font-bold'>Queue Management</h1>

                <button className='flex text-blue-600 px-2 rounded hover:bg-blue-600 hover:text-white transition duration-300 border-2 text-sm border-blue-600 font-semibold items-center'>
                    <RefreshCcw className="w-5 h-5 m-2" />
                    <span>Refresh Queue</span>
                </button>
            </div>

            {/* ============================ APPOINTMENTS INFO ============================= */}

            <div className='w-full mx-auto px-4 py-15'>
                <div className='flex items-center space-x-8'>
                    <div className='flex border border-blue-300 items-center space-y-2 w-full bg-blue-50 rounded-2xl p-8'>
                        <Users className='text-blue-900 bg-blue-200 rounded-full h-12 w-12 m-2 p-1' />
                        <div className='ml-2'>
                            <p className='text-xs font-semibold text-gray-600'>Total Appointments</p>
                            <p className='text-2xl font-bold'>24</p>
                        </div>
                    </div>

                    <div className='flex w-full items-center border border-green-300 space-y-2 bg-green-50 rounded-2xl p-8'>
                        <CircleCheck className='text-green-900 bg-green-200 rounded-full h-12 w-12 m-2 p-1' />
                        <div>
                            <p className='text-xs font-semibold text-gray-600'>Completed</p>
                            <p className='text-2xl font-bold'>12</p>
                        </div>
                    </div>

                    <div className='flex w-full items-center border border-orange-300 space-y-2 bg-orange-50 rounded-2xl p-8'>
                        <Clock className='text-orange-900 bg-orange-200 rounded-full h-12 w-12 m-2 p-1' />
                        <div>
                            <p className='text-xs font-semibold text-gray-600'>In Progress</p>
                            <p className='text-2xl font-bold'>1</p>
                        </div>
                    </div>

                    <div className='flex w-full items-center border border-violet-300 space-y-2 bg-violet-50 rounded-2xl p-8'>
                        <ClipboardCheck className='text-violet-900 bg-violet-200 rounded-full h-12 w-12 m-2 p-1' />
                        <div>
                            <p className='text-xs font-semibold text-gray-600'>Pending</p>
                            <p className='text-2xl font-bold'>11</p>
                        </div>
                    </div>
                </div>
            </div>


            <section>
                {/* ========================== current patient card =========================== */}
                <div className="bg-white shadow-lg rounded-2xl p-6 w-full">

                    {/* Heading */}
                    <h2 className="text-blue-600 font-semibold mb-4">CURRENT PATIENT</h2>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                        {/* Token Section */}
                        <div className="text-center">
                            <p className="text-gray-500 text-sm">TOKEN NO.</p>
                            <h1 className="text-5xl font-bold text-green-600">{patient.token}</h1>
                            <p className="text-green-600 text-sm mt-1">In Consultation</p>
                        </div>

                        {/* Avatar + Info */}
                        <div className="flex items-center gap-4 flex-1">

                            {/* Avatar */}
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                alt="patient"
                                className="w-20 h-20 rounded-full"
                            />

                            {/* Details */}
                            <div>
                                <h3 className="text-xl font-semibold">{patient.name}</h3>
                                <p className="text-gray-500 text-sm">
                                    {patient.age} yrs, {patient.gender}
                                </p>

                                <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                                    <Phone size={16} />
                                    {patient.phone}
                                </div>

                                <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                                    <Calendar size={16} />
                                    {patient.type}
                                </div>

                                <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                                    <Clock size={16} />
                                    {patient.time} • {patient.date}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4 mt-6">

                        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                            <CheckCircle size={18} />
                            Mark as Completed
                        </button>

                        <button className="flex items-center gap-2 border border-yellow-500 text-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-50">
                            <FastForward size={18} />
                            Next Patient (A11)
                        </button>

                        <button className="flex items-center gap-2 border border-red-500 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50">
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

            {/* ================================== upcoming queue ================================ */}
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-blue-600 font-semibold">UPCOMING QUEUE</h2>

                    <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                            <Users size={16} /> {patients.length} Patients Waiting
                        </span>

                        <button className="flex items-center gap-1 text-blue-600 border px-3 py-1 rounded-lg hover:bg-blue-50">
                            <RefreshCw size={16} /> Refresh
                        </button>
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-4 text-gray-500 text-sm font-medium pb-2">
                    <span>Token No.</span>
                    <span>Patient Name</span>
                    <span>Time</span>
                    <span>Status</span>
                </div>

                {/* List */}
                <div className="space-y-2">
                    {patients.map((p, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-4 items-center p-3 rounded-lg ${p.status === "Next" ? "bg-yellow-50" : "hover:bg-gray-50"
                                }`}
                        >
                            {/* Token */}
                            <span className="text-blue-600 font-semibold">{p.token}</span>

                            {/* Name + Age */}
                            <div>
                                <p className="font-medium">{p.name}</p>
                                <p className="text-xs text-gray-500">
                                    {p.age} yrs, {p.gender}
                                </p>
                            </div>

                            {/* Time */}
                            <span className="text-gray-700">{p.time}</span>

                            {/* Status */}
                            <span
                                className={`text-sm px-2 py-1 rounded-full w-fit ${p.status === "Next"
                                    ? "bg-yellow-200 text-yellow-800"
                                    : "bg-blue-100 text-blue-600"
                                    }`}
                            >
                                {p.status}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-6">
                    <button className="text-blue-600 text-sm hover:underline">
                        View All Patients →
                    </button>


                </div>
            </div>

            {/* ============================= tips + queue settings ============================= */}
            <div className="w-full bg-blue-50 border border-blue-100 rounded-xl px-6 py-4 flex items-center justify-between mt-6">

                {/* Left Side - Tips */}
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <Info className="text-blue-600 w-5 h-5" />
                    </div>
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold text-blue-700">Tips:</span>{" "}
                        Use <span className="font-medium">“Next Patient”</span> to move to the next in queue after completing consultation.
                    </p>
                </div>

                {/* Right Side - Button */}
                <button className="flex items-center gap-2 border border-blue-200 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-100 transition">
                    <Settings className="w-4 h-4" />
                    Queue Settings
                </button>
            </div>


        </div>
    )
}

export default QueueManagement