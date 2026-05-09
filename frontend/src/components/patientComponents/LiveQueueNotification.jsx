import { Bell, CircleCheck, Clock } from 'lucide-react'
import React from 'react'

const LiveQueueNotification = () => {
    return (
        <section className='mb-8'>
            <div className="flex items-center gap-2 mb-4">
                <Bell className="text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                    Notifications
                </h2>
            </div>

            <div className="w-full bg-white rounded-2xl shadow-md p-5">
                <div className="space-y-4">
                    {/* Notification 1 */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b">
                        <div className="flex items-start gap-3">
                            <CircleCheck className="text-green-600 shrink-0" />
                            <p className="text-gray-700 text-sm font-bold">
                                Your turn is coming soon <br /><span className='text-sm font-medium text-gray-600'>Token A15</span>
                            </p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap sm:ml-2">10:30 AM</span>
                    </div>

                    {/* Notification 2 */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <Clock className="text-blue-600  shrink-0" />
                            <p className="text-gray-700 text-sm font-bold">
                                Doctor is available now <br /> <span className='text-sm font-medium text-gray-600'>when it's your turn.</span>
                            </p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap sm:ml-2">10:15 AM</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LiveQueueNotification