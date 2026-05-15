import { Megaphone } from 'lucide-react'
import React from 'react'
import { assets } from '../../assets/assets'

const LiveQueueCard = () => {

// ==========================================================================================================================================================================

    return (
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="w-full h-40 sm:h-48">
                <img
                    src={assets.live_queue}
                    alt="Doctor"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="grid grid-cols-1 text-center divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="p-4">
                    <p className="text-sm sm:text-base text-gray-500">Your Token</p>
                    <h2 className="text-3xl sm:text-4xl py-2 font-semibold text-blue-600">A12</h2>
                    <p className='mx-auto w-full max-w-35 rounded bg-blue-200 py-2 text-center text-sm font-semibold text-blue-600'>You</p>
                </div>

                <div className="p-4">
                    <p className="text-sm sm:text-base text-gray-500">Your Position</p>
                    <h2 className="text-3xl sm:text-4xl py-2 font-semibold">5</h2>
                    <p className='text-sm text-gray-500'>People ahead</p>
                </div>

                <div className="p-4">
                    <p className="text-sm sm:text-base text-gray-500">Est. Wait</p>
                    <h2 className="text-lg sm:text-xl py-2 font-semibold text-green-600">20-25 mins</h2>
                    <p className='text-sm text-gray-500'>Approx</p>
                </div>
            </div>

            <div className='flex px-4 py-5 sm:py-6 bg-blue-100 items-start sm:items-center gap-2'>
                <Megaphone className='text-blue-600 w-5 h-5 shrink-0' />
                <p className='text-sm text-gray-500'>You will get notified when it's your turn.</p>
            </div>
        </div>
    )
}

export default LiveQueueCard