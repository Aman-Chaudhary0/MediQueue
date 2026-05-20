import { CalendarCheck, CircleDollarSign, UserRound } from 'lucide-react'
import React, { useState } from 'react'
import authService from '../../api/authService'

const AppointmentSummary = ({ selectedDoctor, selectedDate, selectedSlot }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const canBook = selectedDoctor && selectedDate && selectedSlot

    const navigateToDashboard = () => {
        window.location.assign('/patient/dashboard')
    }

    const handleBookAppointment = async () => {
        try {
            if (!canBook) {
                setError('Please select a doctor, date, and time slot first.')
                return
            }

            setLoading(true)
            setError('')
            setSuccess('')

            await authService.bookAppointment(
                selectedDoctor._id,
                selectedDate.toISOString(),
                selectedSlot.startTime,
                selectedSlot.endTime,
                '',
                ''
            )

            setSuccess('Appointment booked successfully.')
            navigateToDashboard()
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to book appointment')
        } finally {
            setLoading(false)
        }
    }


// ========================================================================================================================

    return (
        <div className='mb-8 rounded-2xl border-t border-gray-300 p-4 shadow-2xl sm:p-8'>
            <h2 className='text-lg sm:text-2xl font-semibold mb-4'>Appointment Summary</h2>
            <div className='mb-4 flex flex-col items-center gap-4 rounded-lg bg-white p-4 text-center shadow-md sm:flex-row sm:text-left'>
                {selectedDoctor?.profilePic ? (
                    <img
                        src={selectedDoctor.profilePic}
                        alt={selectedDoctor?.user?.name || 'Doctor'}
                        className='h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24'
                    />
                ) : (
                    <UserRound className='h-20 w-20 rounded-full sm:h-24 sm:w-24' />
                )}
                <div>
                    <h3 className='text-lg font-semibold'>{selectedDoctor?.user?.name || 'Select a doctor'}</h3>
                    <p className='text-sm text-gray-600'>{selectedDoctor?.specialization || selectedDoctor?.department || 'Specialization not added'}</p>
                    <p className='text-sm text-gray-600'>{selectedDoctor?.hospital || 'Hospital not added'}</p>
                    <p className='text-sm text-gray-600'>
                        {selectedDoctor?.experience ? `${selectedDoctor.experience} years experience` : 'Experience not added'}
                    </p>
                </div>
            </div>
            <div className='mb-4 flex items-start gap-4'>
                <CalendarCheck className='h-10 w-10 shrink-0 rounded-full text-green-600 sm:h-12 sm:w-12' />
                <div>

                    <h3 className='text-lg font-semibold mb-2 text-green-600'>Appointment Date & Time</h3>
                    <p className='text-sm italic'>
                        {selectedDate && selectedSlot
                            ? `${selectedDate.toLocaleDateString()} at ${selectedSlot.startTime}`
                            : 'Choose a date and time slot'}
                    </p>
                </div>
            </div>
            <div className='mb-4 flex items-start gap-4'>
                <CircleDollarSign className='h-10 w-10 shrink-0 rounded-full bg-orange-200 text-orange-600 sm:h-12 sm:w-12' />
                <div>
                    <h3 className='text-lg font-semibold mb-2 text-orange-600'>Consultation Fee</h3>
                    <p className='text-sm italic'>
                        {selectedDoctor?.consultationFee ? `Rs. ${selectedDoctor.consultationFee}` : 'Not added'}
                    </p>
                </div>
            </div>
            {error ? <p className='mb-3 text-sm text-red-600'>{error}</p> : null}
            {success ? <p className='mb-3 text-sm text-green-700'>{success}</p> : null}
            <button
                type='button'
                onClick={handleBookAppointment}
                disabled={!canBook || loading}
                className={`w-full rounded-md px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 sm:w-auto ${
                    !canBook || loading ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {loading ? 'Booking...' : 'Confirm Appointment'}
            </button>

        </div>
    )
}

export default AppointmentSummary
