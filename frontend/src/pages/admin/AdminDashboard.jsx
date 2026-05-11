import React from 'react'
import { Search, Bell, Users, BriefcaseMedical, Calendar, Clock } from "lucide-react";
import AdminDashNav from '../../components/adminComponents/AdminDashNav';
import DoctorsInfo from '../../components/adminComponents/DoctorsInfo';
import AppointmentsRow from '../../components/adminComponents/AppointmentsRow';

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




const AdminDashboard = () => {
    return (
        <div className="mx-auto max-w-7xl p-4 sm:p-6">

            <AdminDashNav />

            <DoctorsInfo />


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
                            <AppointmentsRow key={i} item={item} />
                        ))}
                    </div>
                </div>
            </div>


        </div>
    )
}

export default AdminDashboard
