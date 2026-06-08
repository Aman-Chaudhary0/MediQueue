import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'

const statusStyle = (status) => {
  if (status === 'Completed') return 'bg-green-100 text-green-600'
  if (status === 'Upcoming' || status === 'Pending') return 'bg-yellow-100 text-yellow-600'
  if (status === 'No Show') return 'bg-orange-100 text-orange-600'
  return 'bg-red-100 text-red-600'
}

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5 mt-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={13}
        className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ))}
  </div>
)

const RecentAppointments = ({ item, isTableRow = true }) => {
  const navigate = useNavigate()

  if (!isTableRow) {
    return (
      <div className="rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <img src={item.photo} alt="doctor" className="h-12 w-12 rounded-full object-cover" />
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
            <span className="mt-1 inline-block rounded-2xl bg-blue-100 px-4 py-2 text-lg font-bold text-blue-600">
              {item.token}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</p>
            <span className={`mt-1 inline-block rounded-xl px-3 py-2 text-sm font-bold ${statusStyle(item.status)}`}>
              {item.status}
            </span>
            {item.rating != null && <StarRating rating={item.rating} />}
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/patient/appointment/${item.id}`)}
          className="mt-4 w-full rounded border-2 border-blue-600 px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white sm:w-auto"
        >
          View Details
        </button>
      </div>
    )
  }

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 flex items-center gap-3">
        <img src={item.photo} alt="doctor" className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="font-medium">{item.doctorName}</p>
          <p className="text-sm text-gray-500">{item.hospital}</p>
        </div>
      </td>

      <td className="p-3 text-sm text-gray-500">{item.specialization}</td>

      <td className="p-3 text-sm text-gray-800">
        {item.date}<br />
        <span className="text-xs font-semibold text-gray-500">{item.time}</span>
      </td>

      <td className="p-3">
        <span className="bg-blue-100 py-2 px-4 text-blue-600 text-center rounded-2xl text-lg font-bold">
          {item.token}
        </span>
      </td>

      <td className="p-3">
        <span className={`px-3 py-1.5 rounded-xl text-sm font-bold ${statusStyle(item.status)}`}>
          {item.status}
        </span>
        {item.rating != null && <StarRating rating={item.rating} />}
      </td>

      <td className="p-3">
        <button
          type="button"
          onClick={() => navigate(`/patient/appointment/${item.id}`)}
          className="text-blue-600 px-2 py-1 rounded hover:bg-blue-600 hover:text-white transition border-2 text-sm border-blue-600 font-semibold"
        >
          View Details
        </button>
      </td>
    </tr>
  )
}

export default RecentAppointments
