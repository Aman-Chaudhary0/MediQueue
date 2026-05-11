import React from 'react'

const UpcomingQueue = ({ patient }) => {
  return (
    <div
      className={`rounded-lg p-4 md:grid md:grid-cols-4 md:items-center md:p-3 ${patient.status === "Next" ? "bg-yellow-50" : "bg-gray-50 md:hover:bg-gray-50"
        }`}
    >
      {/* Token */}
      <div className="mb-3 md:mb-0">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 md:hidden">Token No.</span>
        <span className="font-semibold text-blue-600">{patient.token}</span>
      </div>

      {/* Name + Age */}
      <div className="mb-3 md:mb-0">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 md:hidden">Patient Name</span>
        <p className="font-medium">{patient.name}</p>
        <p className="text-xs text-gray-500">
          {patient.age} yrs, {patient.gender}
        </p>
      </div>

      {/* Time */}
      <div className="mb-3 md:mb-0">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 md:hidden">Time</span>
        <span className="text-gray-700">{patient.time}</span>
      </div>

      {/* Status */}
      <div>
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 md:hidden">Status</span>
        <span
          className={`inline-flex w-fit rounded-full px-2 py-1 text-sm ${patient.status === "Next"
            ? "bg-yellow-200 text-yellow-800"
            : "bg-blue-100 text-blue-600"
            }`}
        >
          {patient.status}
        </span>
      </div>
    </div>
  )
}

export default UpcomingQueue
