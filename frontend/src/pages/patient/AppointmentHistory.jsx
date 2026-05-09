import { Calendar, CircleCheck, CircleX, Clock } from 'lucide-react'
import React from 'react'
import RecentAppointments from '../../components/patientComponents/RecentAppointments'
import FilterNavbar from '../../components/patientComponents/FilterNavbar'







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


            <RecentAppointments />



        </div>
    )
}

export default AppointmentHistory
