import React from 'react'

const TodaySchedule = ({ item, statusStyles }) => {

// ==========================================================================================================================================================================

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">

            {/* Time */}
            <div className="w-full text-sm text-gray-600 sm:w-20">
                {item.time}
            </div>

            {/* Dot */}
            <div className="relative hidden w-6 items-center justify-center sm:flex">
                <div
                    className={`w-3 h-3 rounded-full ${item.status === "completed" || item.status === "inprogress"
                        ? "bg-green-500"
                        : item.status === "active"
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                ></div>
            </div>

            {/* Card */}
            <div
                className={`flex-1 rounded-xl border px-4 py-3 ${item.status === "active"
                    ? "bg-blue-50 border-blue-300"
                    : "bg-gray-50 border-gray-100"
                    }`}
            >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                        {item.token && (
                            <span className="font-semibold text-gray-700">
                                {item.token}
                            </span>
                        )}
                        <span className="text-gray-700 text-sm">
                            {item.name}
                        </span>
                    </div>

                    <span
                        className={`w-fit text-xs px-3 py-1 rounded-lg capitalize ${statusStyles[item.status]
                            }`}
                    >
                        {item.status === "inprogress"
                            ? "In Progress"
                            : item.status}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default TodaySchedule
