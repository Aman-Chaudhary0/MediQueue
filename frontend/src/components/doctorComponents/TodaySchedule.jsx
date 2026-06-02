import React from 'react'

const TodaySchedule = ({ item, statusStyles, actionLoading, onMarkCompleted, onOpenNotes }) => {

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

                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={`w-fit text-xs px-3 py-1 rounded-lg capitalize ${statusStyles[item.status]
                                }`}
                        >
                            {item.status === "inprogress"
                                ? "In Progress"
                                : item.status}
                        </span>

                        <button
                            type="button"
                            onClick={() => onOpenNotes?.(item)}
                            className="rounded-lg border border-blue-200 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                        >
                            Notes
                        </button>

                        {item.status !== "completed" ? (
                            <button
                                type="button"
                                onClick={() => onMarkCompleted?.(item.id)}
                                disabled={actionLoading}
                                className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
                            >
                                Complete
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TodaySchedule
