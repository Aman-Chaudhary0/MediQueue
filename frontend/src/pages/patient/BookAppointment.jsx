
import { useEffect, useState } from 'react'
import DoctorSelection from '../../components/patientComponents/DoctorSelection';
import ChooseDate from '../../components/patientComponents/ChooseDate';
import ChooseTimeSlot from '../../components/patientComponents/ChooseTimeSlot';
import AppointmentSummary from '../../components/patientComponents/AppointmentSummary';
import authService from '../../api/authService';

const BookAppointment = () => {
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [availableSlots, setAvailableSlots] = useState([])
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [slotsLoading, setSlotsLoading] = useState(false)
    const [slotsError, setSlotsError] = useState('')

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                if (!selectedDoctor?._id || !selectedDate) {
                    setAvailableSlots([])
                    setSelectedSlot(null)
                    setSlotsError('')
                    return
                }

                setSlotsLoading(true)
                setSlotsError('')

                const response = await authService.getAvailableSlots(
                    selectedDoctor._id,
                    selectedDate.toISOString()
                )

                setAvailableSlots(Array.isArray(response?.availableSlots) ? response.availableSlots : [])
                setSelectedSlot(null)
            } catch (err) {
                setAvailableSlots([])
                setSelectedSlot(null)
                setSlotsError(err?.response?.data?.message || 'Failed to load available slots')
            } finally {
                setSlotsLoading(false)
            }
        }

        fetchAvailableSlots()
    }, [selectedDoctor, selectedDate])



// ==========================================================================================================================================================================

    return (
        <div className='mx-auto max-w-7xl p-3 sm:p-6'>

            {/* ================ = Book Appointment Page ================ */}
            <h1 className='text-2xl sm:text-3xl font-bold mb-3 sm:mb-4'>Book an Appointment</h1>
            <p className='text-xs sm:text-sm italic mb-4 sm:mb-6'>Select a doctor and schedule your appointment</p>


            {/* =============================== Stepper ============================== */}
            <div className='flex flex-wrap items-center gap-2 sm:gap-4 mb-6 sm:mb-8 justify-center text-xs sm:text-sm'>
                <div className='flex items-center gap-1 sm:gap-2'>
                    <div className='w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gray-200 text-black flex items-center justify-center text-xs sm:text-sm'>1</div>
                    <p className='hidden sm:inline text-xs sm:text-sm'>Select Doctor</p>
                    <p className='sm:hidden text-xs'>Doctor</p>
                </div>
                <hr className='bg-gray-500 w-2 sm:w-4 h-0.5' />

                <div className='flex items-center gap-1 sm:gap-2'>
                    <div className='w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gray-200 text-black flex items-center justify-center text-xs sm:text-sm'>2</div>
                    <p className='hidden sm:inline text-xs sm:text-sm'>Choose Date</p>
                    <p className='sm:hidden text-xs'>Date</p>
                </div>
                <hr className='bg-gray-500 w-2 sm:w-4 h-0.5' />

                <div className='flex items-center gap-1 sm:gap-2'>
                    <div className='w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gray-200 text-black flex items-center justify-center text-xs sm:text-sm'>3</div>
                    <p className='hidden sm:inline text-xs sm:text-sm'>Select Time</p>
                    <p className='sm:hidden text-xs'>Time</p>
                </div>
                <hr className='bg-gray-500 w-2 sm:w-4 h-0.5' />

                <div className='flex items-center gap-1 sm:gap-2'>
                    <div className='w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gray-200 text-black flex items-center justify-center text-xs sm:text-sm'>4</div>
                    <p className='hidden sm:inline text-xs sm:text-sm'>Confirm Details</p>
                    <p className='sm:hidden text-xs'>Confirm</p>
                </div>

            </div>



            <DoctorSelection
                selectedDoctorId={selectedDoctor?._id}
                onSelectDoctor={setSelectedDoctor}
            />

            <ChooseDate
                selectedDate={selectedDate}
                onChangeDate={setSelectedDate}
                selectedDoctor={selectedDoctor}
                availableSlotsCount={availableSlots.length}
            />

            <ChooseTimeSlot
                selectedDoctor={selectedDoctor}
                selectedSlot={selectedSlot}
                availableSlots={availableSlots}
                loading={slotsLoading}
                error={slotsError}
                onSelectSlot={setSelectedSlot}
            />

            <AppointmentSummary
                selectedDoctor={selectedDoctor}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
            />

            {/* ========================= IMPORTANT NOTICE ==============================   */}

            <div className='mt-8 rounded-lg bg-yellow-100 p-4'>
                <h3 className='text-lg font-semibold mb-2 text-yellow-800'>Important Notice</h3>
                <p className='text-sm text-yellow-700'>Please arrive 15 minutes before your scheduled appointment time to complete any necessary paperwork and ensure a smooth check-in process. Thank you for choosing our healthcare services!</p>
            </div>
        </div>
    )
}

export default BookAppointment
