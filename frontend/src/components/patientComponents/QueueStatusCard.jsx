import React from 'react'

const QueueStatusCard = ({ item, getStatusStyle }) => {
    return (
        <div
            className="flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:items-center py-3 border-b last:border-none"
        >
            <div className="font-bold text-gray-800">
                <span className='mr-2 text-xs font-medium uppercase tracking-wide text-gray-500 sm:hidden'>Token</span>
                {item.token}
            </div>
            <div className="text-gray-700">
                <span className='mr-2 text-xs font-medium uppercase tracking-wide text-gray-500 sm:hidden'>Patient</span>
                {item.name}
            </div>
            <div>
                <span className='mr-2 text-xs font-medium uppercase tracking-wide text-gray-500 sm:hidden'>Status</span>
                <span
                    className={`px-3 py-1 rounded-xl font-semibold text-sm ${getStatusStyle(
                        item.status
                    )}`}
                >
                    {item.status}
                </span>
            </div>
        </div>
    )
}

export default QueueStatusCard
