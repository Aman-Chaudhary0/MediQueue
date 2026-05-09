import { Clock } from 'lucide-react'

import React from 'react'
import { assets } from '../../assets/assets'

const LiveQueueStatus = () => {
    return (
        <div className='flex flex-col lg:flex-row lg:items-start lg:space-x-8 mb-6 sm:mb-8 border-t border-gray-300 p-4 sm:p-8 shadow-2xl rounded gap-6'>
            <div className='w-full lg:w-2/3'>
                <h2 className='text-lg sm:text-2xl font-semibold mb-4'>Live Queue Status</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 p-2 sm:p-4'>
                    <div className='bg-green-100 rounded-lg shadow-md p-4 text-center'>
                        <h3 className='text-sm sm:text-lg font-semibold'>Currently Serving</h3>
                        <p className='text-green-600 text-2xl sm:text-3xl font-semibold'>A10 </p>
                        <p className='text-xs sm:text-sm text-gray-600'>Dr. John Doe</p>
                    </div>
                    <div className='bg-blue-100 rounded-lg shadow-md p-4 text-center'>
                        <h3 className='text-sm sm:text-lg font-semibold'>Your Token</h3>
                        <p className='text-blue-600 text-2xl sm:text-3xl font-semibold'>A15 </p>
                        <p className='text-xs sm:text-sm text-gray-600'>You are <span className='font-bold text-blue-500'>5th</span> in queue</p>
                    </div>
                </div>

                <div className='flex my-3 sm:my-4 items-center space-x-2 p-3 sm:p-4 bg-white rounded-lg shadow-md mb-4'>
                    <Clock className='w-8 sm:w-10 h-8 sm:h-10 inline-block mr-1 text-blue-600 shrink-0' />
                    <div className='mx-2'>
                        <p className='text-xs sm:text-sm'>Estimated Waiting Time</p>
                        <p className='text-base sm:text-lg font-bold'>20-25 mins</p>
                    </div>
                </div>


                <button className='w-full sm:w-auto text-blue-600 px-4 py-2 text-sm sm:text-base rounded hover:bg-blue-600 hover:text-white transition duration-300 border-2 border-blue-600 font-semibold'>View Live Queue</button>
            </div>
            <div className='w-full lg:w-1/3 relative'>
                <img src={assets.persons_sit} alt="Hospital Lobby" className='w-full h-48 sm:h-64 object-cover rounded-lg shadow-md' />
                <button className='absolute top-2 right-2 bg-red-200 text-red-600 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded hover:bg-red-400 transition duration-300'>Live</button>
            </div>
        </div>

    )
}

export default LiveQueueStatus