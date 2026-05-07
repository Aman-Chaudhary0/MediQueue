import React from 'react'
import { CircleSlash, Clock, Bell, Users, Megaphone, CircleCheck, AlertCircle, FileText } from "lucide-react";
import { assets } from '../../assets/assets';
import { useState } from "react";





const LiveQueue = () => {

    // Fake data for queue Status
    const data = [
        { token: "A01", name: "Ravi Kumar", status: "Completed" },
        { token: "A02", name: "Anjali Singh", status: "In Progress" },
        { token: "A03", name: "Mohit Sharma", status: "Waiting" },
        { token: "A04", name: "Neha Verma", status: "Waiting" },
    ];


    // style of queue status
    const getStatusStyle = (status) => {
        if (status === "Completed")
            return "bg-green-100 text-green-700";
        if (status === "In Progress")
            return "bg-blue-100 text-blue-700";
        return "bg-yellow-100 text-yellow-700";
    };



    // array for general instructions 
    const instructions = [
        {
            icon: <Clock className="text-blue-600 w-6 h-6" />,
            title: "Be On Time",
            subtitle: "Arrive at least 10 minutes before your slot",
        },
        {
            icon: <Bell className="text-green-600 w-6 h-6" />,
            title: "Stay Alert",
            subtitle: "Keep checking your queue status regularly",
        },
        {
            icon: <FileText className="text-purple-600 w-6 h-6" />,
            title: "Carry Documents",
            subtitle: "Bring all required medical records",
        },
        {
            icon: <AlertCircle className="text-red-500 w-6 h-6" />,
            title: "Follow Guidelines",
            subtitle: "Wear mask and follow clinic rules",
        },
    ];


    const [doctor, setDoctor] = useState("");

    return (
        <div className="px-6 py-4 m-4 ">

            <div className='flex justify-between'>

                {/* ==============NAV TEXT ====================== */}
                <div className="flex flex-col">

                    <h1 className="text-2xl font-semibold text-gray-800">
                        Live Queue
                    </h1>
                    <p className="text-sm text-gray-500">
                        See your position in the queue and stay updated instantly
                    </p>
                </div>


                {/* ==================================== SELECT A DOCTOR =========================================== */}
                <div className="w-full max-w-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Doctor
                    </label>

                    <select
                        value={doctor}
                        onChange={(e) => setDoctor(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Choose a doctor --</option>
                        <option value="dr-sharma">Dr. Sharma</option>
                        <option value="dr-priya">Dr. Priya</option>
                        <option value="dr-khan">Dr. Khan</option>
                    </select>

                    {/* Optional: show selected */}
                    {doctor && (
                        <p className="mt-2 text-sm text-gray-600">
                            Selected: <span className="font-medium">{doctor}</span>
                        </p>
                    )}
                </div>
            </div>


            {/* =========================== SECTION 1 ========================================== */}
            <section className='grid grid-cols-1 lg:grid-cols-3 gap-6 my-8'>

                {/* ============================== PERSONAL QUEUE CQRD ======================================== */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="w-full h-40">
                        <img
                            src={assets.live_queue}
                            alt="Doctor"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-3 h-40 text-center divide-x">
                        <div className="p-4">
                            <p className="text-md text-gray-500">Your Token</p>
                            <h2 className="text-4xl py-2 font-semibold text-blue-600">A12</h2>
                            <p className='text-sm text-blue-600 font-semibold bg-blue-200 rounded w-9/10 py-2 text-center'>You</p>
                        </div>

                        <div className="p-4">
                            <p className="text-md text-gray-500">Your Position</p>
                            <h2 className="text-4xl py-2 font-semibold">5</h2>
                            <p className='text-sm text-gray-500'>People ahead</p>
                        </div>

                        <div className="p-4">
                            <p className="text-md text-gray-500">Est. Wait</p>
                            <h2 className="text-lg py-2 font-semibold text-green-600">20-25 mins</h2>
                            <p className='text-sm text-gray-500'>Approx</p>
                        </div>
                    </div>

                    <div className='flex px-4 py-6 bg-blue-100 items-center gap-2'>
                        <Megaphone className='text-blue-600 w-5 h-5 flex-shrink-0' />
                        <p className='text-sm text-gray-500'>You will get notified when it's your turn.</p>
                    </div>
                </div>

                {/* ================================================= QUEUE STATUS TABLE ============================================== */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-5">
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Queue Status
                        </h2>
                        <button className='bg-green-100 rounded px-4 py-1 text-green-600 font-bold text-sm'><span className='text-lg'>•</span> Live</button>
                    </div>

                    <div className="grid grid-cols-3 font-medium text-gray-600 border-b pb-2">
                        <div className='text-sm font-bold'>Token No.</div>
                        <div className='text-sm font-bold'>Patient Name</div>
                        <div className='text-sm font-bold'>Status</div>
                    </div>


                    {/* ======================================== INFO OF EACH APPOINTMENT ============================================ */}
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-3 items-center py-3 border-b last:border-none"
                        >
                            <div className="font-bold text-gray-800">{item.token}</div>
                            <div className="text-gray-700">{item.name}</div>
                            <div>
                                <span
                                    className={`px-3 py-1 rounded-xl font-semibold text-sm ${getStatusStyle(
                                        item.status
                                    )}`}
                                >
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ==================================================================SECTION 2 ================================================= */}
            <section className='mb-8'>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Queue Summary
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Total in Queue */}
                    <div className="flex items-center justify-between bg-blue-100 p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Users className="text-blue-600 bg-gray-100 rounded-full h-10 w-10 p-2" />
                            <p className="text-gray-600">Total in Queue</p>
                        </div>
                        <span className="font-bold text-2xl text-gray-800">12</span>
                    </div>

                    {/* Avg Wait Time */}
                    <div className="flex items-center justify-between bg-blue-100 p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Clock className="text-blue-600 bg-gray-100 rounded-full h-10 w-10 p-2" />
                            <p className="text-gray-600">Avg Wait Time</p>
                        </div>
                        <span className="font-bold text-2xl text-gray-800">22 mins</span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between bg-blue-100 p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                            <CircleSlash className="text-blue-600 bg-gray-100 rounded-full h-10 w-10 p-2" />
                            <p className="text-gray-600">Queue Status</p>
                        </div>
                        <span className="font-bold text-2xl text-gray-800">Normal</span>
                    </div>
                </div>
            </section>

            {/* ====================================================== SECTION 3 - NOTIFICATIONS =============================================== */}
            <section className='mb-8'>
                <div className="flex items-center gap-2 mb-4">
                    <Bell className="text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                        Notifications
                    </h2>
                </div>

                <div className="w-full bg-white rounded-2xl shadow-md p-5">
                    <div className="space-y-4">
                        {/* Notification 1 */}
                        <div className="flex items-center justify-between pb-4 border-b">
                            <div className="flex items-center gap-3">
                                <CircleCheck className="text-green-600 flex-shrink-0" />
                                <p className="text-gray-700 text-sm font-bold">
                                    Your turn is coming soon <br /><span className='text-sm font-medium text-gray-600'>Token A15</span>
                                </p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">10:30 AM</span>
                        </div>

                        {/* Notification 2 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Clock className="text-blue-600 flex-shrink-0" />
                                <p className="text-gray-700 text-sm font-bold">
                                    Doctor is available now <br /> <span className='text-sm font-medium text-gray-600'>when it's your turn.</span>
                                </p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">10:15 AM</span>
                        </div>
                    </div>
                </div>
            </section>


            {/* ============================================================ IMPORTANT INSTRUCTIONS ===================================================================== */}
            <div className="w-full max-w-5xl mx-auto">

                {/* 🔹 Heading */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Important Instructions
                </h2>

                {/* 🔹 4 Boxes Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {instructions.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-start gap-2 hover:shadow-lg transition"
                        >
                            <div className="bg-gray-100 p-2 rounded-lg">
                                {item.icon}
                            </div>

                            <h3 className="text-md font-semibold text-gray-800">
                                {item.title}
                            </h3>

                            <p className="text-sm text-gray-500">
                                {item.subtitle}
                            </p>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    )
}

export default LiveQueue