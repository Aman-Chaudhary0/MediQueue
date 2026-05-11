import { Calendar, CircleCheck, CircleX, Clock } from 'lucide-react'
import React from 'react'
import RecentAppointments from '../../components/patientComponents/RecentAppointments'
import FilterNavbar from '../../components/patientComponents/FilterNavbar'

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
        <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6'>


            {/* ========================  NAV TITLE ============================== */}
            <div className="flex flex-col">

                <h1 className="text-2xl font-semibold text-gray-800">
                    Appointment History
                </h1>
                <p className="text-sm sm:text-base text-gray-500">
                    View your past appointments and consultation details.
                </p>
            </div>



            {/* ============================ APPOINTMENTS INFO ============================= */}

            <div className='w-full py-8 sm:py-10'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                    <div className='flex items-center gap-4 rounded-2xl border border-blue-300 bg-blue-50 p-5 sm:p-6'>
                        <Calendar className='h-12 w-12 shrink-0 rounded-full bg-blue-200 p-1 text-blue-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Total Appointments</p>
                            <p className='text-2xl font-bold'>18</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 rounded-2xl border border-green-300 bg-green-50 p-5 sm:p-6'>
                        <CircleCheck className='h-12 w-12 shrink-0 rounded-full bg-green-200 p-1 text-green-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Completed</p>
                            <p className='text-2xl font-bold'>14</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 rounded-2xl border border-orange-300 bg-orange-50 p-5 sm:p-6'>
                        <Clock className='h-12 w-12 shrink-0 rounded-full bg-orange-200 p-1 text-orange-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Upcoming</p>
                            <p className='text-2xl font-bold'>2</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 rounded-2xl border border-red-300 bg-red-50 p-5 sm:p-6'>
                        <CircleX className='h-12 w-12 shrink-0 rounded-full bg-red-200 p-1 text-red-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Cancelled/ Missed</p>
                            <p className='text-2xl font-bold'>2</p>
                        </div>
                    </div>
                </div>
            </div>


            <FilterNavbar />


           <div>
            {/* ============================== APPOINTMENTS HISTORY ======================================= */}
            <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Appointments</h2>

                <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-225 text-left border-collapse">
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
                                <RecentAppointments key={item.id} item={item} isTableRow={true} />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-4 lg:hidden">
                    {appointments.map((item) => (
                        <RecentAppointments key={item.id} item={item} isTableRow={false} />
                    ))}
                </div>
            </div>
        </div>



        </div>
    )
}

export default AppointmentHistory
