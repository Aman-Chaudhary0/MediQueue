import React from 'react'

const ChooseTimeSlot = ({ selectedDoctor, selectedSlot, availableSlots, loading, error, onSelectSlot }) => {
    const groupedSlots = availableSlots.reduce((acc, slot) => {
        const period = slot.period || 'Available'
        if (!acc[period]) acc[period] = []
        acc[period].push(slot)
        return acc
    }, {})

// ==========================================================================================================================================================================

    return (
        < div className='mb-8 rounded-2xl border-t border-gray-300 p-4 shadow-2xl sm:p-8' >
            <h2 className='text-lg sm:text-2xl font-semibold mb-4'>3. Select Time Slot</h2>
            {!selectedDoctor ? (
                <div className='rounded-lg bg-white p-6 text-center text-sm text-gray-600 shadow-md'>
                    Select a doctor to view available time slots.
                </div>
            ) : loading ? (
                <div className='rounded-lg bg-white p-6 text-center text-sm text-gray-600 shadow-md'>
                    Loading time slots...
                </div>
            ) : error ? (
                <div className='rounded-lg bg-red-50 p-6 text-center text-sm text-red-600 shadow-md'>
                    {error}
                </div>
            ) : availableSlots.length === 0 ? (
                <div className='rounded-lg bg-white p-6 text-center text-sm text-gray-600 shadow-md'>
                    No slots available for the selected date.
                </div>
            ) : (
                <div className='flex flex-col space-y-6'>
                    {Object.entries(groupedSlots).map(([period, slots]) => (
                        <div key={period}>
                            <h3 className='text-lg font-semibold mb-2'>{period}</h3>
                            <div className='flex flex-wrap gap-3'>
                                {slots.map((slot) => (
                                    <button
                                        key={`${slot.startTime}-${slot.endTime}`}
                                        type='button'
                                        onClick={() => onSelectSlot?.(slot)}
                                        className={`rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                                            selectedSlot?.startTime === slot.startTime && selectedSlot?.endTime === slot.endTime
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                    >
                                        {slot.startTime}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ChooseTimeSlot
