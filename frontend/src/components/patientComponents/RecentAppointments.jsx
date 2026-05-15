import React from 'react'

const RecentAppointments = ({ item, isTableRow = true }) => {
  if (!isTableRow) {
    // Mobile card view
    return (
      <div key={item.id} className="rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <img
            src={item.photo}
            alt="doctor"
            className="h-12 w-12 rounded-full"
          />
          <div className="min-w-0">
            <p className="font-medium text-gray-900">{item.doctorName}</p>
            <p className="text-sm text-gray-500">{item.hospital}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Specialization</p>
            <p className="text-sm text-gray-800">{item.specialization}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Date & Time</p>
            <p className="text-sm text-gray-800">{item.date}</p>
            <p className="text-sm font-semibold text-gray-500">{item.time}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Token No.</p>
            <span className='mt-1 inline-block rounded-2xl bg-blue-100 px-4 py-2 text-lg font-bold text-blue-600'>
              {item.token}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</p>
            <span
              className={`mt-1 inline-block rounded-xl px-3 py-2 text-sm font-bold
                ${
                  item.status === "Completed"
                    ? "bg-green-100 text-green-500"
                    : item.status === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                }`}
            >
              {item.status}
            </span>
          </div>
        </div>

        <button className='mt-4 w-full rounded border-2 border-blue-600 px-3 py-2 text-sm font-semibold text-blue-600 transition duration-300 hover:bg-blue-600 hover:text-white sm:w-auto'>
          View Details
        </button>
      </div>
    )
  }

  // Desktop table row view

// ==========================================================================================================================================================================

  return (
    <tr key={item.id} className="border-b hover:bg-gray-50">
      {/* Doctor Column */}
      <td className="p-3 flex items-center gap-3">
        <img
          src={item.photo}
          alt="doctor"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-medium">{item.doctorName}</p>
          <p className="text-sm text-gray-500">{item.hospital}</p>
        </div>
      </td>

      {/* Specialization */}
      <td className="p-3 text-md text-gray-500">{item.specialization}</td>

      {/* Date & Time */}
      <td className="p-3 text-md text-gray-800">{item.date} <br />  <span className="text-sm font-semibold text-gray-500">{item.time}</span></td>

      {/* Token */}
      <td className="p-3 ">
        <span className='bg-blue-100 py-3 px-5 text-blue-600 text-center rounded-2xl text-xl font-bold'>
          {item.token}
        </span>
      </td>

      {/* Status */}
      <td className="p-3">
        <span
          className={`px-3 py-2 rounded-xl text-sm font-bold
          ${item.status === "Completed"
            ? "bg-green-100 text-green-500 "
            : item.status === "Pending"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {item.status}
        </span>
      </td>

      {/* Action */}
      <td className="p-3">
        <button className=' text-blue-600 px-2 py-1 rounded hover:bg-blue-600 hover:text-white transition duration-300 border-2 text-sm border-blue-600 font-semibold'>View Details</button>
      </td>
    </tr>
  )
}

export default RecentAppointments