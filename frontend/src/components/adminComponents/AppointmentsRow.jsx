import React from 'react'

const statusStyles = {
    completed: "bg-green-100 text-green-600",
    pending: "bg-orange-100 text-orange-600",
    cancelled: "bg-red-100 text-red-600",
};


const AppointmentsRow = ({item}) => {

// ==========================================================================================================================================================================

  return (
     <div className="rounded-2xl border border-gray-100 p-4 shadow-sm lg:grid lg:grid-cols-4 lg:items-center lg:gap-4 lg:rounded-none lg:border-0 lg:border-b lg:px-6 lg:py-4 lg:shadow-none">
            <div className="mb-4 flex items-center gap-3 lg:mb-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                    {item.initials}
                </div>
                <div className="min-w-0">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">ID: {item.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:contents">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 lg:hidden">Doctor</p>
                    <p className="text-sm text-gray-800 lg:text-base">{item.doctor}</p>
                    <p className="text-xs text-gray-500">{item.specialization}</p>
                </div>

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 lg:hidden">Time</p>
                    <p className="text-sm text-gray-800 lg:text-base">{item.time}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 lg:hidden">Status</p>
                    <span
                        className={`mt-1 inline-flex rounded-lg px-3 py-1 text-xs capitalize lg:mt-0 ${statusStyles[item.status]}`}
                    >
                        {item.status}
                    </span>
                </div>
            </div>
        </div>
  )
}

export default AppointmentsRow