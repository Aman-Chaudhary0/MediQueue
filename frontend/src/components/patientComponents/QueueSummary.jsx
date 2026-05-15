import { CircleSlash, Clock, Users } from 'lucide-react'
import React from 'react'

const QueueSummary = () => {

// ==========================================================================================================================================================================

  return (
     <section className='mb-8'>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Queue Summary
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Total in Queue */}
                    <div className="flex items-center justify-between gap-4 bg-blue-100 p-4 rounded-xl">
                        <div className="flex min-w-0 items-center gap-3">
                            <Users className="text-blue-600 bg-gray-100 rounded-full h-10 w-10 p-2" />
                            <p className="text-sm sm:text-base text-gray-600">Total in Queue</p>
                        </div>
                        <span className="shrink-0 font-bold text-xl sm:text-2xl text-gray-800">12</span>
                    </div>

                    {/* Avg Wait Time */}
                    <div className="flex items-center justify-between gap-4 bg-blue-100 p-4 rounded-xl">
                        <div className="flex min-w-0 items-center gap-3">
                            <Clock className="text-blue-600 bg-gray-100 rounded-full h-10 w-10 p-2" />
                            <p className="text-sm sm:text-base text-gray-600">Avg Wait Time</p>
                        </div>
                        <span className="shrink-0 font-bold text-xl sm:text-2xl text-gray-800">22 mins</span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between gap-4 bg-blue-100 p-4 rounded-xl">
                        <div className="flex min-w-0 items-center gap-3">
                            <CircleSlash className="text-blue-600 bg-gray-100 rounded-full h-10 w-10 p-2" />
                            <p className="text-sm sm:text-base text-gray-600">Queue Status</p>
                        </div>
                        <span className="shrink-0 font-bold text-xl sm:text-2xl text-gray-800">Normal</span>
                    </div>
                </div>
                </section>
  )
}

export default QueueSummary