import React from 'react'

const UpcomingPatientsCard = ({ item }) => {
    return (
        <div
            className="mb-3 rounded-xl border border-gray-100 bg-gray-50 p-4 last:mb-0 md:mb-0 md:grid md:grid-cols-4 md:items-center md:gap-4 md:rounded-none md:border-0 md:border-b md:bg-transparent md:px-0 md:py-4 md:last:border-none"
        >
            <div className="mb-3 md:mb-0">
                <span className='mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 md:hidden'>Token</span>
                <div className="text-2xl font-semibold text-blue-800">
                    {item.token}
                </div>
            </div>

            {/* Patient Info */}
            <div className="mb-3 md:mb-0">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 md:hidden">Patient Details</p>
                <p className="text-gray-800 font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">
                    {item.gender}, {item.age} yrs
                </p>
            </div>

            <div className="mb-3 text-gray-600 md:mb-0">
                <span className='mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 md:hidden'>Time</span>
                {item.time}
            </div>

            {/* Status */}
            <div>
                <span className='mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 md:hidden'>Status</span>
                <span
                    className='inline-flex w-fit rounded-xl bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600'
                >
                    {item.status}
                </span>
            </div>

        </div>
    )
}

export default UpcomingPatientsCard
