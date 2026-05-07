import React from 'react'
import { CalendarClock, CalendarDays, CircleCheck, CircleX, Clock, File, MapPin, MessagesSquare, UsersRound } from 'lucide-react'
import { assets } from '../../assets/assets'

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



const Dashboard = () => {
    return (

        // ============================= DASHBOARD ================================ 
        <div className='p-6 m-2'>
            <div className='flex items-center justify-between mb-8'>
                <div>
                    <h1 className='text-2xl font-bold'>Welcome back, Aman!</h1>
                    <p className='text-gray-600'>Here's what's happening with your health appointments. </p>
                </div>
                <button className='flex items-center space-x-2 bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300'>
                    <CalendarClock className="w-5 h-5" />
                    <span>Book Appointment</span>
                </button>
            </div>


            {/* // ============================= UPCOMING APPOINTMENTS ================================ */}


            <div className='mb-8 border-t border-gray-300 p-8 shadow-2xl rounded' >
                <h2 className='text-2xl font-semibold mb-4'>Upcoming Appointments</h2>
                <div className='flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md mb-4'>
                    <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Doctor" className='w-24 h-24 object-cover rounded-full' />
                    <div className='flex-1'>
                        <h3 className='text-lg font-semibold'>Dr. John Doe</h3>
                        <p className='text-blue-600'>Cardiologist</p>
                        <p className='text-gray-600'> <span><MapPin className="w-4 h-4 inline-block mr-1" /></span>City Hospital, New York</p>
                    </div>
                    <div className='text-right'>
                        <p className='text-gray-600 font-bold'>Date: 2024-07-15</p>
                        <p className='text-gray-600 font-bold'>Time: 10:30 AM</p>
                        <p className='text-blue-600 text-2xl font-semibold'>A15 </p>
                    </div>
                </div>
                <button className='text-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition duration-300 border-2 border-blue-600 font-semibold'>View Details</button>
            </div>


            {/* //   ============== LIVE QUEUE STATUS ============== */}

            <div className='flex items-start space-x-8 mb-8 border-t border-gray-300 p-8 shadow-2xl rounded'>
                <div className='w-2/3'>
                    <h2 className='text-2xl font-semibold mb-4'>Live Queue Status</h2>
                    <div className='flex items-center space-x-4 mb-4 p-4 '>
                        <div className='flex-1 bg-green-100 rounded-lg shadow-md p-4 text-center'>
                            <h3 className='text-lg font-semibold'>Currently Serving</h3>
                            <p className='text-green-600 text-3xl font-semibold'>A10 </p>
                            <p className='text-gray-600'>Dr. John Doe</p>
                        </div>
                        <div className='flex-1 bg-blue-100 rounded-lg shadow-md p-4 text-center'>
                            <h3 className='text-lg font-semibold'>Your Token</h3>
                            <p className='text-blue-600 text-3xl font-semibold'>A15 </p>
                            <p className='text-gray-600'>You are <span className='font-bold text-blue-500'>5th</span> in queue</p>
                        </div>
                    </div>

                    <div className='flex my-4 items-center space-x-2 p-4 bg-white rounded-lg shadow-md mb-4'>
                        <Clock className='w-10 h-10 inline-block mr-1 text-blue-600' />
                        <div className='mx-2'>
                            <p >Estimated Waiting Time</p>
                            <p className='text-lg font-bold'>20-25 mins</p>
                        </div>
                    </div>


                    <button className=' text-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition duration-300 border-2 border-blue-600 font-semibold'>View Live Queue</button>
                </div>
                <div className='w-1/3 relative'>
                    <img src={assets.persons_sit} alt="Hospital Lobby" className='w-full h-64 object-cover rounded-lg shadow-md' />
                    <button className='absolute top-2 right-2 bg-red-200 text-red-600  px-1 rounded hover:bg-red-400 transition duration-300'>Live</button>
                </div>
            </div>





            {/* ==================== QUICK OPTIONS ==================== */}

            <div className='mb-8 border-t border-gray-300 p-8 shadow-2xl rounded'>
                <h2 className='text-2xl font-semibold mb-4'>Quick Actions</h2>
                <div className='grid grid-cols-4 gap-4'>
                    <div className='flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-md hover:bg-blue-100 cursor-pointer transition duration-300'>
                        <CalendarClock className='w-8 h-8 text-blue-600' />
                        <p className='text-gray-600 font-semibold'>Book Appointment</p>
                    </div>
                    <div className='flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-md hover:bg-blue-100 cursor-pointer transition duration-300'>
                        <UsersRound className='w-8 h-8 text-blue-600' />
                        <p className='text-gray-600 font-semibold'>Live Queue</p>
                    </div>
                    <div className='flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-md hover:bg-blue-100 cursor-pointer transition duration-300'>
                        <File className='w-8 h-8 text-blue-600' />
                        <p className='text-gray-600 font-semibold'>My Prescriptions</p>
                    </div>
                    <div className='flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-md hover:bg-blue-100 cursor-pointer transition duration-300'>
                        <MessagesSquare className='w-8 h-8 text-blue-600' />
                        <p className='text-gray-600 font-semibold'>Contact Support</p>
                    </div>
                </div>
            </div>

            {/* ======================== APPOINTMENTS DETAILS =============== */}


            <div className='mb-8 border-t border-gray-300 p-8 shadow-2xl rounded'>
                <h2 className='text-2xl font-semibold mb-4'>Appointment Summary</h2>
                <div className='grid grid-cols-4 gap-4'>
                    <div className='flex flex-col items-;eft space-y-2 p-4 bg-violet-100 rounded-lg shadow-md hover:bg-violet-200 cursor-pointer transition duration-300'>
                        <CalendarDays className='w-8 h-8 text-violet-600' />
                        <p className=' text-md text-gray-600 font-semibold'>Total Appointments</p>
                        <p className=' text-2xl font-bold'>25</p>
                        <p className=' text-sm text-gray-600 font-semibold'>This Year</p>
                    </div>

                    <div className='flex flex-col items-left space-y-2 p-4 bg-yellow-100 rounded-lg shadow-md hover:bg-yellow-200 cursor-pointer transition duration-300'>
                        <Clock className='w-8 h-8 text-yellow-600' />
                        <p className=' text-lg text-gray-600 font-semibold'>Upcoming Appointments</p>
                        <p className='text-2xl font-bold'>5</p>
                        <p className='text-sm text-gray-600 font-semibold'>Appointments</p>
                    </div>

                    <div className='flex flex-col items-left space-y-2 p-4 bg-green-100 rounded-lg shadow-md hover:bg-green-200 cursor-pointer transition duration-300'>
                        <CircleCheck className='w-8 h-8 text-green-600' />
                        <p className=' text-lg text-gray-600 font-semibold'>Completed Appointments</p>
                        <p className=' text-2xl font-bold'>15</p>
                        <p className='text-sm text-gray-600 font-semibold'>Appointments</p>

                    </div>

                    <div className='flex flex-col items-cenlefter space-y-2 p-4 bg-red-100 rounded-lg shadow-md hover:bg-red-200 cursor-pointer transition duration-300'>
                        <CircleX className='w-8 h-8 text-red-600' />
                        <p className=' text-lg text-gray-600 font-semibold'>Cancelled Appointments</p>
                        <p className='text-2xl font-bold'>5</p>
                        <p className='text-sm text-gray-600 font-semibold'>Appointments</p>

                    </div>
                </div>
            </div>

            {/* ================= RECENT APPOINTMENTS =============================== */}


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

export default Dashboard