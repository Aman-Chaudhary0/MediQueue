import React from 'react'
import { useNavigate } from 'react-router-dom'

const DashRecentAppointments = ({ item }) => {
    const navigate = useNavigate()
    const statusClasses =
        item.status === "Completed"
            ? "bg-green-100 text-green-500"
            : item.status === "Pending" || item.status === "Upcoming" || item.status === "Confirmed"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-red-100 text-red-600"

// ==========================================================================================================================================================================

    return (
        <tr className="border-b hover:bg-gray-50 text-xs sm:text-sm">

            {/* Doctor Column */}
            <td className="p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
                <img
                    src={item.photo || 'https://via.placeholder.com/100'}
                    alt={item.doctorName}
                    className="w-8 sm:w-10 h-8 sm:h-10 rounded-full shrink-0"
                />
                <div className="hidden sm:block">
                    <p className="font-medium text-xs sm:text-sm">{item.doctorName}</p>
                    <p className="text-xs text-gray-500">{item.hospital}</p>
                </div>
                <div className="sm:hidden">
                    <p className="font-medium text-xs">{item.doctorName.split(' ')[1]}</p>
                </div>
            </td>

            {/* Specialization */}
            <td className="p-2 sm:p-3 text-gray-500 hidden sm:table-cell text-xs">{item.specialization}</td>

            {/* Date & Time */}
            <td className="p-2 sm:p-3 text-gray-800 hidden md:table-cell text-xs">{item.date} <br />  <span className="text-xs font-semibold text-gray-500">{item.time}</span></td>



            {/* Token */}
            <td className="p-2 sm:p-3">
                <span className='bg-blue-100 py-1 sm:py-3 px-2 sm:px-5 text-blue-600 text-center rounded-2xl text-sm sm:text-lg font-bold'>
                    {item.token}
                </span>
            </td>

            {/* Status */}
            <td className="p-2 sm:p-3">
                <span
                    className={`px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-xs sm:text-sm font-bold ${statusClasses}`}
                >
                    {item.status}
                </span>
            </td>

            {/* Action */}
            <td className="p-2 sm:p-3">
                <button
                    type="button"
                    onClick={() => navigate(`/patient/appointment/${item.id}`)}
                    className='text-xs sm:text-sm text-blue-600 px-1 sm:px-2 py-1 rounded hover:bg-blue-600 hover:text-white transition duration-300 border-2 border-blue-600 font-semibold truncate'
                >
                    View
                </button>
            </td>

        </tr>
    )
}

export default DashRecentAppointments
