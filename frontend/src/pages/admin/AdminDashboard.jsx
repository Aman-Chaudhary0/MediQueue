import React from 'react'
import { Search, Bell, Users, BriefcaseMedical, Calendar, Clock } from "lucide-react";

const appointments = [
    {
        name: "Emma Thompson",
        id: "#PT2458",
        initials: "ET",
        doctor: "Dr. James Smith",
        specialization: "Cardiologist",
        time: "09:30 AM",
        date: "May 15, 2025",
        status: "completed",
    },
    {
        name: "Michael Johnson",
        id: "#PT2457",
        initials: "MJ",
        doctor: "Dr. Sarah Williams",
        specialization: "Dermatologist",
        time: "10:15 AM",
        date: "May 15, 2025",
        status: "pending",
    },
    {
        name: "Olivia Lee",
        id: "#PT2456",
        initials: "OL",
        doctor: "Dr. Robert Brown",
        specialization: "Neurologist",
        time: "11:00 AM",
        date: "May 15, 2025",
        status: "pending",
    },
    {
        name: "William Lopez",
        id: "#PT2455",
        initials: "WL",
        doctor: "Dr. Emily Davis",
        specialization: "Pediatrician",
        time: "11:45 AM",
        date: "May 15, 2025",
        status: "completed",
    },
    {
        name: "Sophia Carter",
        id: "#PT2454",
        initials: "SC",
        doctor: "Dr. Michael Jones",
        specialization: "Orthopedic",
        time: "01:30 PM",
        date: "May 15, 2025",
        status: "cancelled",
    },
];

const statusStyles = {
    completed: "bg-green-100 text-green-600",
    pending: "bg-orange-100 text-orange-600",
    cancelled: "bg-red-100 text-red-600",
};

function AppointmentRow({ item }) {
    return (
        <div className="rounded-2xl border border-gray-100 p-4 shadow-sm lg:grid lg:grid-cols-4 lg:items-center lg:gap-4 lg:rounded-none lg:border-0 lg:border-b lg:px-6 lg:py-4 lg:shadow-none">
            <div className="mb-4 flex items-center gap-3 lg:mb-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                    {item.initials}
                </div>
                <div className="min-w-0">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">ID: {item.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:contents">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 lg:hidden">Doctor</p>
                    <p className="text-sm text-gray-800 lg:text-base">{item.doctor}</p>
                    <p className="text-xs text-gray-500">{item.specialization}</p>
                </div>

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 lg:hidden">Time</p>
                    <p className="text-sm text-gray-800 lg:text-base">{item.time}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 lg:hidden">Status</p>
                    <span
                        className={`mt-1 inline-flex rounded-lg px-3 py-1 text-xs capitalize lg:mt-0 ${statusStyles[item.status]}`}
                    >
                        {item.status}
                    </span>
                </div>
            </div>
        </div>
    );
}

const AdminDashboard = () => {
    return (
        <div className="mx-auto max-w-7xl p-4 sm:p-6">

            {/* ==================================  NAvbar ========================================= */}
            <nav className="flex w-full flex-col gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between">

                {/* Left Section */}
                <div className='flex flex-col gap-4'>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Admin Dashboard
                        </h1>
                        <p className="text-sm text-gray-500 ">
                            Welcome back, Aman! Here's what's happening today.
                        </p>
                    </div>


                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto">
                            Manage Doctors
                        </button>
                        <button className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto">
                            Analytics
                        </button>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">

                    {/* Search Box */}
                    <div className="relative w-full lg:w-auto">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search patients, doctors, appointments..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
                        />
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-start">
                        {/* Notification Icon */}
                        <button className="relative rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100">
                            <Bell size={20} className="text-gray-700" />

                            {/* Notification Dot */}
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
                        </button>

                        {/* Profile Tab */}
                        <div className="flex min-w-0 items-center gap-3 rounded-xl bg-gray-50 px-3 py-2 cursor-pointer transition hover:bg-gray-100">

                            <img
                                src="https://i.pravatar.cc/100"
                                alt="profile"
                                className="h-11 w-11 rounded-full object-cover"
                            />

                            <div className="min-w-0">
                                <h3 className="truncate text-sm font-semibold text-gray-800">
                                    Aman Sharma
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Admin
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </nav>



            {/* ============================ Patients and doctors info ============================= */}

            <div className='w-full py-8 sm:py-10'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                    <div className='flex w-full items-center gap-4 rounded-2xl border border-blue-300 bg-blue-50 p-5 sm:p-6'>
                        <Users className='h-12 w-12 shrink-0 rounded-full bg-blue-200 p-1 text-blue-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Total Patients</p>
                            <p className='text-2xl font-bold'>2,458</p>
                        </div>
                    </div>

                    <div className='flex w-full items-center gap-4 rounded-2xl border border-green-300 bg-green-50 p-5 sm:p-6'>
                        <BriefcaseMedical className='h-12 w-12 shrink-0 rounded-full bg-green-200 p-1 text-green-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Total Doctors</p>
                            <p className='text-2xl font-bold'>86</p>
                        </div>
                    </div>

                    <div className='flex w-full items-center gap-4 rounded-2xl border border-violet-300 bg-violet-50 p-5 sm:p-6'>
                        <Calendar className='h-12 w-12 shrink-0 rounded-full bg-violet-200 p-1 text-violet-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Appointments Today</p>
                            <p className='text-2xl font-bold'>125</p>
                        </div>
                    </div>

                    <div className='flex w-full items-center gap-4 rounded-2xl border border-orange-300 bg-orange-50 p-5 sm:p-6'>
                        <Clock className='h-12 w-12 shrink-0 rounded-full bg-orange-200 p-1 text-orange-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Average wait time</p>
                            <p className='text-2xl font-bold'>24m</p>
                        </div>
                    </div>
                </div>
            </div>



            {/* ======================= recent appointments ========================= */}
            <div className="w-full rounded-2xl border border-gray-100 bg-white shadow-sm">

                {/* Header */}
                <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Recent Appointments
                    </h2>

                    <button className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50 sm:w-auto sm:py-1.5">
                        View All
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="hidden grid-cols-4 gap-4 rounded-t-xl bg-gray-50 px-6 py-3 text-left text-sm text-gray-500 lg:grid">
                        <div className="font-medium">Patient Name</div>
                        <div className="font-medium">Doctor</div>
                        <div className="font-medium">Time</div>
                        <div className="font-medium">Status</div>
                    </div>

                    <div className="space-y-4 lg:space-y-0">
                        {appointments.map((item, i) => (
                            <AppointmentRow key={i} item={item} />
                        ))}
                    </div>
                </div>
            </div>


        </div>
    )
}

export default AdminDashboard
