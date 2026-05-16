import { MapPin } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const UpcomingAppointment = ({ appointment, loading, error }) => {
    const navigate = useNavigate()

// ==========================================================================================================================================================================

    return (
        <div className='mb-6 sm:mb-8 border-t border-gray-300 p-4 sm:p-8 shadow-2xl rounded' >
            <h2 className='text-lg sm:text-2xl font-semibold mb-4'>Upcoming Appointments</h2>
            {loading ? (
                <div className='rounded-lg bg-white p-6 text-center text-sm text-gray-600 shadow-md'>
                    Loading upcoming appointment...
                </div>
            ) : error ? (
                <div className='rounded-lg bg-red-50 p-6 text-center text-sm text-red-600 shadow-md'>
                    {error}
                </div>
            ) : !appointment ? (
                <div className='rounded-lg bg-white p-6 text-center text-sm text-gray-600 shadow-md'>
                    No pending upcoming appointments found.
                </div>
            ) : (
                <>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-4 p-3 sm:p-4 bg-white rounded-lg shadow-md mb-4'>
                        <img
                            src={appointment.photo || 'https://via.placeholder.com/100'}
                            alt={appointment.doctorName}
                            className='w-20 sm:w-24 h-20 sm:h-24 object-cover rounded-full mx-auto sm:mx-0'
                        />
                        <div className='flex-1 text-center sm:text-left'>
                            <h3 className='text-base sm:text-lg font-semibold'>{appointment.doctorName}</h3>
                            <p className='text-blue-600 text-sm sm:text-base'>{appointment.specialization}</p>
                            <p className='text-gray-600 text-xs sm:text-sm'> <span><MapPin className="w-3 sm:w-4 h-3 sm:h-4 inline-block mr-1" /></span>{appointment.hospital}</p>
                        </div>
                        <div className='text-center sm:text-right'>
                            <p className='text-xs sm:text-sm text-gray-600 font-bold'>Date: {appointment.date}</p>
                            <p className='text-xs sm:text-sm text-gray-600 font-bold'>Time: {appointment.time}</p>
                            <p className='text-blue-600 text-xl sm:text-2xl font-semibold'>{appointment.token}</p>
                        </div>
                    </div>
                    <button
                        type='button'
                        onClick={() => navigate(`/patient/appointment/${appointment.id}`)}
                        className='w-full sm:w-auto text-blue-600 px-4 py-2 text-sm sm:text-base rounded hover:bg-blue-600 hover:text-white transition duration-300 border-2 border-blue-600 font-semibold'
                    >
                        View Details
                    </button>
                </>
            )}
        </div>
    )
}

export default UpcomingAppointment
