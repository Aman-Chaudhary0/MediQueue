import React from 'react'

const ChooseTimeSlot = () => {

// ==========================================================================================================================================================================

    return (
        < div className='mb-8 rounded-2xl border-t border-gray-300 p-4 shadow-2xl sm:p-8' >
            <h2 className='text-lg sm:text-2xl font-semibold mb-4'>3. Select Time Slot</h2>
            <div className='flex flex-col space-y-6'>
                <div>
                    <h3 className='text-lg font-semibold mb-2'>Morning</h3>
                    <div className='flex flex-wrap gap-3'>
                        <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>9:00 AM</button>
                        <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>10:00 AM</button>
                        <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>11:00 AM</button>
                    </div>
                </div>
                <div>
                    <h3 className='text-lg font-semibold mb-2'>Afternoon</h3>
                    <div className='flex flex-wrap gap-3'>
                        <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>1:00 PM</button>
                        <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>2:00 PM</button>
                        <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>3:00 PM</button>
                    </div>
                </div>
                <div>
                    <h3 className='text-lg font-semibold mb-2'>Evening</h3>
                    <div className='flex flex-wrap gap-3'>
                        <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>5:00 PM</button>
                        <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>6:00 PM</button>
                        <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>7:00 PM</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChooseTimeSlot