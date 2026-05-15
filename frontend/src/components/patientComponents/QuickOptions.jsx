import { CalendarClock, File, MessageSquare, UserRound } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const QuickOptions = () => {
  const navigate = useNavigate()

  const onBookAppointment = () => navigate('/patient/book-appointment')
  const onLiveQueue = () => navigate('/patient/live-queue')
  const onAppointmentHistory = () => navigate('/patient/appointment-history')
  const onContactSupport = () => navigate('/contact-us')


// ==========================================================================================================================================================================

  return (
    <div className='mb-6 sm:mb-8 border-t border-gray-300 p-4 sm:p-8 shadow-2xl rounded'>
      <h2 className='text-lg sm:text-2xl font-semibold mb-4'>Quick Actions</h2>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4'>
        <div
          role='button'
          tabIndex={0}
          onClick={onBookAppointment}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onBookAppointment()
          }}
          className='flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-lg shadow-md hover:bg-blue-100 cursor-pointer transition duration-300'
        >
          <CalendarClock className='w-6 sm:w-8 h-6 sm:h-8 text-blue-600' />
          <p className='text-xs sm:text-sm text-gray-600 font-semibold text-center'>Book Appointment</p>
        </div>

        <div
          role='button'
          tabIndex={0}
          onClick={onLiveQueue}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onLiveQueue()
          }}
          className='flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-lg shadow-md hover:bg-blue-100 cursor-pointer transition duration-300'
        >
          <UserRound className='w-6 sm:w-8 h-6 sm:h-8 text-blue-600' />
          <p className='text-xs sm:text-sm text-gray-600 font-semibold text-center'>Live Queue</p>
        </div>

        <div
          role='button'
          tabIndex={0}
          onClick={onAppointmentHistory}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onAppointmentHistory()
          }}
          className='flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-lg shadow-md hover:bg-blue-100 cursor-pointer transition duration-300'
        >
          <File className='w-6 sm:w-8 h-6 sm:h-8 text-blue-600' />
          <p className='text-xs sm:text-sm text-gray-600 font-semibold text-center'>Appointments History</p>
        </div>

        <div
          role='button'
          tabIndex={0}
          onClick={onContactSupport}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onContactSupport()
          }}
          className='flex flex-col items-center space-y-2 p-3 sm:p-4 bg-white rounded-lg shadow-md hover:bg-blue-100 cursor-pointer transition duration-300'
        >
          <MessageSquare className='w-6 sm:w-8 h-6 sm:h-8 text-blue-600' />
          <p className='text-xs sm:text-sm text-gray-600 font-semibold text-center'>Contact Support</p>
        </div>
      </div>
    </div>
  )
}

export default QuickOptions
