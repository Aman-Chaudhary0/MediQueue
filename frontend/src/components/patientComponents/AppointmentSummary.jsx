import { CalendarCheck, CircleDollarSign, UserRound } from 'lucide-react'
import React from 'react'

const AppointmentSummary = () => {
    return (
        <div className='mb-8 rounded-2xl border-t border-gray-300 p-4 shadow-2xl sm:p-8'>
            <h2 className='text-lg sm:text-2xl font-semibold mb-4'>Appointment Summary</h2>
            <div className='mb-4 flex flex-col items-center gap-4 rounded-lg bg-white p-4 text-center shadow-md sm:flex-row sm:text-left'>
                <UserRound className='h-20 w-20 rounded-full sm:h-24 sm:w-24' />
                <div>
                    <h3 className='text-lg font-semibold'>Dr. John Doe</h3>
                    <p className='text-sm text-gray-600'>Cardiologist</p>
                    <p className='text-sm text-gray-600'>City Hospital</p>
                    <p className='text-sm text-gray-600'>10 years experience</p>
                </div>
            </div>
            <div className='mb-4 flex items-start gap-4'>
                <CalendarCheck className='h-10 w-10 shrink-0 rounded-full text-green-600 sm:h-12 sm:w-12' />
                <div>

                    <h3 className='text-lg font-semibold mb-2 text-green-600'>Appointment Date & Time</h3>
                    <p className='text-sm italic'>September 15, 2024 at 10:00 AM</p>
                </div>
            </div>
            <div className='mb-4 flex items-start gap-4'>
                <CircleDollarSign className='h-10 w-10 shrink-0 rounded-full bg-orange-200 text-orange-600 sm:h-12 sm:w-12' />
                <div>
                    <h3 className='text-lg font-semibold mb-2 text-orange-600'>Consultation Fee</h3>
                    <p className='text-sm italic'>$100</p>
                </div>
            </div>
            <button className='w-full rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:w-auto'>Confirm Appointment</button>

        </div>
    )
}

export default AppointmentSummary