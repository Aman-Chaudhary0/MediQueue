import { CalendarDays, CircleCheck, CircleX, Clock } from 'lucide-react'
import React from 'react'

const DashAppointmentSummary = ({ stats, loading, error }) => {
    const summaryStats = stats || {
        total: 0,
        upcoming: 0,
        completed: 0,
        cancelled: 0,
    }

// ==========================================================================================================================================================================

  return (
     <div className='mb-6 sm:mb-8 border-t border-gray-300 p-4 sm:p-8 shadow-2xl rounded'>
                <h2 className='text-lg sm:text-2xl font-semibold mb-4'>Appointment Summary</h2>
                {error ? <p className='mb-4 text-sm text-red-600'>{error}</p> : null}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
                    <div className='flex flex-col items-center space-y-2 p-3 sm:p-4 bg-violet-100 rounded-lg shadow-md hover:bg-violet-200 cursor-pointer transition duration-300'>
                        <CalendarDays className='w-6 sm:w-8 h-6 sm:h-8 text-violet-600' />
                        <p className='text-xs sm:text-sm text-gray-600 font-semibold text-center'>Total Appointments</p>
                        <p className='text-lg sm:text-2xl font-bold'>{loading ? '...' : summaryStats.total}</p>
                        <p className='text-xs text-gray-600 font-semibold'>This Year</p>
                    </div>

                    <div className='flex flex-col items-center space-y-2 p-3 sm:p-4 bg-yellow-100 rounded-lg shadow-md hover:bg-yellow-200 cursor-pointer transition duration-300'>
                        <Clock className='w-6 sm:w-8 h-6 sm:h-8 text-yellow-600' />
                        <p className='text-xs sm:text-sm text-gray-600 font-semibold text-center'>Upcoming Appointments</p>
                        <p className='text-lg sm:text-2xl font-bold'>{loading ? '...' : summaryStats.upcoming}</p>
                        <p className='text-xs text-gray-600 font-semibold'>Appointments</p>
                    </div>

                    <div className='flex flex-col items-center space-y-2 p-3 sm:p-4 bg-green-100 rounded-lg shadow-md hover:bg-green-200 cursor-pointer transition duration-300'>
                        <CircleCheck className='w-6 sm:w-8 h-6 sm:h-8 text-green-600' />
                        <p className='text-xs sm:text-sm text-gray-600 font-semibold text-center'>Completed Appointments</p>
                        <p className='text-lg sm:text-2xl font-bold'>{loading ? '...' : summaryStats.completed}</p>
                        <p className='text-xs text-gray-600 font-semibold'>Appointments</p>

                    </div>

                    <div className='flex flex-col items-center space-y-2 p-3 sm:p-4 bg-red-100 rounded-lg shadow-md hover:bg-red-200 cursor-pointer transition duration-300'>
                        <CircleX className='w-6 sm:w-8 h-6 sm:h-8 text-red-600' />
                        <p className='text-xs sm:text-sm text-gray-600 font-semibold text-center'>Cancelled Appointments</p>
                        <p className='text-lg sm:text-2xl font-bold'>{loading ? '...' : summaryStats.cancelled}</p>
                        <p className='text-xs text-gray-600 font-semibold'>Appointments</p>

                    </div>
                </div>
            </div>
  )
}

export default DashAppointmentSummary
