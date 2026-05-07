import { Calendar, CircleCheck, CircleX, Clock, Search } from 'lucide-react'
import React from 'react'



const appointments = [
    {
        id: 1,
        doctorName: "Dr. Amit Sharma",
        hospital: "City Care Hospital",
        specialization: "Cardiologist",
        date: "14 May 2026 ",
        time: "11:15 AM",
        token: "A12",
        status: "Completed",
        photo: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        id: 2,
        doctorName: "Dr. Priya Verma",
        hospital: "Sunrise Clinic",
        specialization: "Dermatologist",
        date: "14 May 2026 ",
        time: "11:15 AM",
        token: "B07",
        status: "Pending",
        photo: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        id: 3,
        doctorName: "Dr. Raj Mehta",
        hospital: "Apollo Hospital",
        specialization: "Orthopedic",
        date: "14 May 2026 ",
        time: "11:15 AM",
        token: "C03",
        status: "Cancelled",
        photo: "https://randomuser.me/api/portraits/men/55.jpg",
    },
];




const AppointmentHistory = () => {
    return (
        <div className='px-6 py-4 m-4'>


            {/* ========================  NAV TITLE ============================== */}
            <div className="flex flex-col">

                <h1 className="text-2xl font-semibold text-gray-800">
                    Appointment History
                </h1>
                <p className="text-sm text-gray-500">
                    View your past appointments and consultation details.
                </p>
            </div>



            {/* ============================ APPOINTMENTS INFO ============================= */}

            <div className='w-full mx-auto px-4 py-15'>
                <div className='flex items-center space-x-8'>
                    <div className='flex border border-blue-300 items-center space-y-2 bg-blue-50 rounded-2xl p-8'>
                        <Calendar className='text-blue-900 bg-blue-200 rounded-full h-12 w-12 m-2 p-1' />
                        <div className='ml-2'>
                            <p className='text-xs font-semibold text-gray-600'>Total Appointments</p>
                            <p className='text-2xl font-bold'>18</p>
                        </div>
                    </div>

                    <div className='flex items-center border border-green-300 space-y-2 bg-green-50 rounded-2xl p-8'>
                        <CircleCheck className='text-green-900 bg-green-200 rounded-full h-12 w-12 m-2 p-1' />
                        <div>
                            <p className='text-xs font-semibold text-gray-600'>Completed</p>
                            <p className='text-2xl font-bold'>14</p>
                        </div>
                    </div>

                    <div className='flex items-center border border-orange-300 space-y-2 bg-orange-50 rounded-2xl p-8'>
                        <Clock className='text-orange-900 bg-orange-200 rounded-full h-12 w-12 m-2 p-1' />
                        <div>
                            <p className='text-xs font-semibold text-gray-600'>Upcoming</p>
                            <p className='text-2xl font-bold'>2</p>
                        </div>
                    </div>

                    <div className='flex items-center border border-red-300 space-y-2 bg-red-50 rounded-2xl p-8'>
                        <CircleX className='text-red-900 bg-red-200 rounded-full h-12 w-12 m-2 p-1' />
                        <div>
                            <p className='text-xs font-semibold text-gray-600'>Cancelled/ Missed</p>
                            <p className='text-2xl font-bold'>2</p>
                        </div>
                    </div>
                </div>
            </div>



            {/* =================================== FILTER NAVBAR =============================== */}
            <div className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between">

                {/* 🔹 Logo / Title */}
                <h1 className="text-xl font-semibold text-gray-800">
                    MediQueue
                </h1>

                {/* 🔹 Search Box */}
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search by doctor or hospital..."
                        className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Icon */}
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>

                {/* 🔹 Right Side (optional) */}
                <div className="hidden sm:block text-sm text-gray-600">
                    Welcome, User
                </div>

            </div>


            {/* ============================== APPOINTMENTS HISTORY ======================================= */}
            <div className="p-6 bg-white rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">Recent Appointments</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 text-sm">
                                <th className="p-3">Doctor</th>
                                <th className="p-3">Specialization</th>
                                <th className="p-3">Date & Time</th>
                                <th className="p-3">Token No.</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {appointments.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">

                                    {/* Doctor Column */}
                                    <td className="p-3 flex items-center gap-3">
                                        <img
                                            src={item.photo}
                                            alt="doctor"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <p className="font-medium">{item.doctorName}</p>
                                            <p className="text-sm text-gray-500">{item.hospital}</p>
                                        </div>
                                    </td>

                                    {/* Specialization */}
                                    <td className="p-3 text-md text-gray-500">{item.specialization}</td>

                                    {/* Date & Time */}
                                    <td className="p-3 text-md text-gray-800">{item.date} <br />  <span className="p-3 text-sm font-semibold text-gray-500 text-left">{item.time}</span></td>



                                    {/* Token */}
                                    <td className="p-3 ">
                                        <span className='bg-blue-100 py-3 px-5 text-blue-600 text-center rounded-2xl text-xl font-bold'>
                                            {item.token}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="p-3">
                                        <span
                                            className={`px-3 py-2 rounded-xl text-sm font-bold
                                                    ${item.status === "Completed"
                                                    ? "bg-green-100 text-green-500 "
                                                    : item.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    {/* Action */}
                                    <td className="p-3">
                                        <button className=' text-blue-600 px-2 py-1 rounded hover:bg-blue-600 hover:text-white transition duration-300 border-2 text-sm border-blue-600 font-semibold'>View Details</button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default AppointmentHistory