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
            <div className="flex flex-col gap-1 pb-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <span className="text-gray-500 text-sm">{label}</span>
                <span className="font-medium text-gray-800 sm:text-right">{value}</span>
            </div>
        );
    }

    return (
        <div className='mx-auto max-w-7xl p-4 sm:p-6'>

            {/* ================================ TITLE ================== */}
            <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <h1 className='text-2xl sm:text-3xl font-bold'>Queue Management</h1>

                <button className='flex w-full items-center justify-center rounded border-2 border-blue-600 px-3 py-2 text-sm font-semibold text-blue-600 transition duration-300 hover:bg-blue-600 hover:text-white sm:w-auto'>
                    <RefreshCcw className="w-5 h-5 m-2" />
                    <span>Refresh Queue</span>
                </button>
            </div>

            {/* ============================ APPOINTMENTS INFO ============================= */}

            <div className='w-full py-8 sm:py-10'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                    <div className='flex w-full items-center gap-4 rounded-2xl border border-blue-300 bg-blue-50 p-5 sm:p-6'>
                        <Users className='h-12 w-12 shrink-0 rounded-full bg-blue-200 p-1 text-blue-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Total Appointments</p>
                            <p className='text-2xl font-bold'>24</p>
                        </div>
                    </div>

                    <div className='flex w-full items-center gap-4 rounded-2xl border border-green-300 bg-green-50 p-5 sm:p-6'>
                        <CircleCheck className='h-12 w-12 shrink-0 rounded-full bg-green-200 p-1 text-green-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Completed</p>
                            <p className='text-2xl font-bold'>12</p>
                        </div>
                    </div>

                    <div className='flex w-full items-center gap-4 rounded-2xl border border-orange-300 bg-orange-50 p-5 sm:p-6'>
                        <Clock className='h-12 w-12 shrink-0 rounded-full bg-orange-200 p-1 text-orange-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>In Progress</p>
                            <p className='text-2xl font-bold'>1</p>
                        </div>
                    </div>

                    <div className='flex w-full items-center gap-4 rounded-2xl border border-violet-300 bg-violet-50 p-5 sm:p-6'>
                        <ClipboardCheck className='h-12 w-12 shrink-0 rounded-full bg-violet-200 p-1 text-violet-900' />
                        <div className='min-w-0'>
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

            {/* ================================== upcoming queue ================================ */}
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full">

                {/* Header */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-blue-600 font-semibold">UPCOMING QUEUE</h2>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                            <Users size={16} /> {patients.length} Patients Waiting
                        </span>

                        <button className="flex w-full items-center justify-center gap-1 rounded-lg border px-3 py-2 text-blue-600 hover:bg-blue-50 sm:w-auto sm:py-1">
                            <RefreshCw size={16} /> Refresh
                        </button>
                    </div>
                </div>

                {/* Table Header */}
                <div className="hidden grid-cols-4 pb-2 text-sm font-medium text-gray-500 md:grid">
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
                            className={`rounded-lg p-4 md:grid md:grid-cols-4 md:items-center md:p-3 ${p.status === "Next" ? "bg-yellow-50" : "bg-gray-50 md:hover:bg-gray-50"
                                }`}
                        >
                            {/* Token */}
                            <div className="mb-3 md:mb-0">
                                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 md:hidden">Token No.</span>
                                <span className="font-semibold text-blue-600">{p.token}</span>
                            </div>

                            {/* Name + Age */}
                            <div className="mb-3 md:mb-0">
                                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 md:hidden">Patient Name</span>
                                <p className="font-medium">{p.name}</p>
                                <p className="text-xs text-gray-500">
                                    {p.age} yrs, {p.gender}
                                </p>
                            </div>

                            {/* Time */}
                            <div className="mb-3 md:mb-0">
                                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 md:hidden">Time</span>
                                <span className="text-gray-700">{p.time}</span>
                            </div>

                            {/* Status */}
                            <div>
                                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 md:hidden">Status</span>
                                <span
                                    className={`inline-flex w-fit rounded-full px-2 py-1 text-sm ${p.status === "Next"
                                        ? "bg-yellow-200 text-yellow-800"
                                        : "bg-blue-100 text-blue-600"
                                        }`}
                                >
                                    {p.status}
                                </span>
                            </div>
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
            <div className="mt-6 flex w-full flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 sm:px-6">

                {/* Left Side - Tips */}
                <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <Info className="text-blue-600 w-5 h-5" />
                    </div>
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold text-blue-700">Tips:</span>{" "}
                        Use <span className="font-medium">“Next Patient”</span> to move to the next in queue after completing consultation.
                    </p>
                </div>

            </div>


        </div>
    )
}

export default QueueManagement
