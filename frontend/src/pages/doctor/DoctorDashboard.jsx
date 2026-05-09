import { Clock, Users } from 'lucide-react';
import React from 'react'
import DoctorNav from '../../components/doctorComponents/DoctorNav';
import DocAppointmentsInfo from '../../components/doctorComponents/DocAppointmentsInfo';
import UpcomingPatientsCard from '../../components/doctorComponents/UpcomingPatientsCard';
import TodaySchedule from '../../components/doctorComponents/TodaySchedule';



const DoctorDashboard = () => {
    const data = [
        {
            token: "A01",
            name: "Ravi Kumar",
            gender: "Male",
            age: 32,
            time: "10:00 AM",
            status: "Waiting",
        },
        {
            token: "A02",
            name: "Anjali Singh",
            gender: "Female",
            age: 27,
            time: "10:10 AM",
            status: "Waiting",
        },
        {
            token: "A03",
            name: "Mohit Sharma",
            gender: "Male",
            age: 40,
            time: "10:20 AM",
            status: "Waiting",
        },
        {
            token: "A04",
            name: "Neha Verma",
            gender: "Female",
            age: 35,
            time: "10:30 AM",
            status: "Waiting",
        },
    ];


    const schedule = [
        { time: "9:00 AM", token: "A8", name: "Deepak Verma", status: "completed" },
        { time: "9:30 AM", token: "A9", name: "Anjali Gupta", status: "completed" },
        { time: "10:00 AM", token: "A10", name: "Rohit Kumar", status: "inprogress" },
        { time: "10:30 AM", token: "A11", name: "Neha Singh", status: "active" },
        { time: "11:00 AM", token: "A12", name: "Vikram Mehta", status: "upcoming" },
        { time: "11:30 AM", token: "A13", name: "Pooja Sharma", status: "upcoming" },
        { time: "12:00 PM", token: "A14", name: "Arjun Patel", status: "upcoming" },
        { time: "12:30 PM", token: "A15", name: "Sneha Reddy", status: "upcoming" },
        { time: "1:00 PM", name: "Lunch Break", status: "break" },
    ];

    const statusStyles = {
        completed: "bg-green-100 text-green-600",
        inprogress: "bg-green-100 text-green-700",
        upcoming: "bg-blue-100 text-blue-600",
        active: "bg-blue-100 text-blue-700 border border-blue-300",
        break: "bg-gray-100 text-gray-500",
    };


    return (
        <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6'>
            <DoctorNav />


            <DocAppointmentsInfo />


            {/* ================================ Upcoming Patients =============================== */}
            <div className="mb-8 w-full rounded-2xl bg-white p-4 shadow-md sm:p-5">

                {/* 🔹 Heading */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Upcoming Patients
                </h2>

                {/* 🔹 Header */}
                <div className="hidden grid-cols-4 border-b pb-2 font-medium text-gray-600 md:grid">
                    <div>Token No.</div>
                    <div>Patient Details</div>
                    <div>Time</div>
                    <div>Status</div>
                </div>

                {/* 🔹 Rows */}
                {data.map((item) => (
                    <UpcomingPatientsCard key={item.token} item={item} />
                ))}
            </div>

            <div className="w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">

                {/* Header */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Today's Schedule
                    </h2>
                    <button className="text-blue-600 text-sm font-medium hover:underline">
                        View Calendar
                    </button>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute bottom-0 left-[2.65rem] top-0 hidden w-0.5 bg-gray-200 sm:block"></div>

                    <div className="space-y-4">
                        {schedule.map((item, i) => (
                            <TodaySchedule
                                key={`${item.time}-${item.name}-${i}`}
                                item={item}
                                statusStyles={statusStyles}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 sm:grid-cols-2">

                    {/* Avg Time */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Clock className="text-blue-600" size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Average Consultation Time
                            </p>
                            <h3 className="text-lg font-semibold text-blue-600">
                                15 min
                            </h3>
                        </div>
                    </div>

                    {/* Patients Seen */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Users className="text-blue-600" size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Patients Seen
                            </p>
                            <h3 className="text-lg font-semibold text-blue-600">
                                12
                            </h3>
                        </div>
                    </div>

                </div>
            </div>


        </div>
    )
}

export default DoctorDashboard
