import { CircleCheck, ClipboardClock, Clock, Users } from 'lucide-react';
import React from 'react'
import { useState } from "react";



const DoctorDashboard = () => {
    const [date, setDate] = useState("");

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

    return (
        <div className='px-6 py-4 m-4'>
            {/* ========================  NAV TITLE ============================== */}
            <div className="flex justify-between">

                <div>


                    <h1 className="text-2xl font-semibold text-gray-800">
                        Welcome back, Dr. Rajesh Sharma!
                    </h1>
                    <p className="text-sm text-gray-500">
                        Here's what's happening with your appointments today.
                    </p>
                </div>


                {/* ==================================== select date ================================== */}
                <div className="w-full max-w-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Date
                    </label>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-auto border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {date && (
                        <p className="mt-2 text-sm text-gray-600">
                            Selected: <span className="font-medium">{date}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* ============================ APPOINTMENTS INFO ============================= */}

            <div className='w-full mx-auto px-4 py-15'>
                <div className='flex items-center space-x-8'>
                    <div className='flex border border-blue-300 items-center space-y-2 bg-blue-50 rounded-2xl p-8'>
                        <Users className='text-blue-900 bg-blue-200 rounded-full h-12 w-12 m-2 p-1' />
                        <div className='ml-2'>
                            <p className='text-xs font-semibold text-gray-600'>Total Appointments</p>
                            <p className='text-2xl font-bold'>24</p>
                        </div>
                    </div>

                    <div className='flex items-center border border-green-300 space-y-2 bg-green-50 rounded-2xl p-8'>
                        <CircleCheck className='text-green-900 bg-green-200 rounded-full h-12 w-12 m-2 p-1' />
                        <div>
                            <p className='text-xs font-semibold text-gray-600'>Completed</p>
                            <p className='text-2xl font-bold'>12</p>
                        </div>
                    </div>

                    <div className='flex items-center border border-orange-300 space-y-2 bg-orange-50 rounded-2xl p-8'>
                        <Clock className='text-orange-900 bg-orange-200 rounded-full h-12 w-12 m-2 p-1' />
                        <div>
                            <p className='text-xs font-semibold text-gray-600'>In Progress</p>
                            <p className='text-2xl font-bold'>1</p>
                        </div>
                    </div>

                    <div className='flex items-center border border-violet-300 space-y-2 bg-violet-50 rounded-2xl p-8'>
                        <ClipboardClock className='text-violet-900 bg-violet-200 rounded-full h-12 w-12 m-2 p-1' />
                        <div>
                            <p className='text-xs font-semibold text-gray-600'>Pending</p>
                            <p className='text-2xl font-bold'>11</p>
                        </div>
                    </div>
                </div>
            </div>


            {/* ================================ Upcoming Patients =============================== */}
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-5">

                {/* 🔹 Heading */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Upcoming Patients
                </h2>

                {/* 🔹 Header */}
                <div className="grid grid-cols-5 font-medium text-gray-600 border-b pb-2">
                    <div>Token No.</div>
                    <div>Patient Details</div>
                    <div>Time</div>
                    <div>Status</div>
                    <div>Action</div>
                </div>

                {/* 🔹 Rows */}
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-5 items-center py-3 border-b last:border-none"
                    >
                        <div className="font-semibold text-blue-800 text-2xl ">{item.token}</div>

                        {/* Patient Info */}
                        <div>
                            <p className="text-gray-800 font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-500">
                                {item.gender}, {item.age} yrs
                            </p>
                        </div>

                        <div className="text-gray-600">{item.time}</div>

                        {/* Status */}
                        <div>
                            <span
                                className='px-3 py-1 rounded-xl text-sm text-blue-600  bg-blue-100 font-semibold'
                            >
                                {item.status}
                            </span>
                        </div>

                        {/* Action */}
                        <div>
                            <button className=" text-blue-600 px-2 py-1 rounded hover:bg-blue-600 hover:text-white transition duration-300 border-2 text-sm border-blue-600 font-semibold">
                                View
                            </button>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    )
}

export default DoctorDashboard