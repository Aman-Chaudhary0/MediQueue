import React from 'react'
import { Phone, Mail, Trash2 } from 'lucide-react'

const DoctorInfoCard = ({ doctor, index, isTableRow = true }) => {
  if (!isTableRow) {
    // Mobile card view
    return (
      <div key={index} className="rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-4">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="h-14 w-14 rounded-full object-cover"
          />

          <div className="min-w-0">
            <h3 className="font-semibold text-gray-800">
              {doctor.name}
            </h3>

            <p className="text-sm text-gray-500">
              ID: {doctor.id}
            </p>

            <p className="truncate text-sm text-gray-500">
              {doctor.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Specialty</p>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">
              {doctor.icon}
              {doctor.specialty}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Department</p>
            <p className="mt-1 text-sm text-gray-700">{doctor.department}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Experience</p>
            <p className="mt-1 text-sm text-gray-700">{doctor.experience}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</p>
            <span
              className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                doctor.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : doctor.status === "On Leave"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {doctor.status}
            </span>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Contact</p>
            <div className="mt-1 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={15} />
                {doctor.phone}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={15} />
                {doctor.email}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
            <Trash2 size={18} className="text-red-500" />
            Delete
          </button>
        </div>
      </div>
    )
  }

  // Desktop table row view

// ==========================================================================================================================================================================

  return (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >

                  {/* Doctor */}
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />

                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {doctor.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          ID: {doctor.id}
                        </p>

                        <p className="text-sm text-gray-500">
                          {doctor.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Specialty */}
                  <td>
                    <div className="flex items-center gap-2 text-gray-700">
                      {doctor.icon}
                      {doctor.specialty}
                    </div>
                  </td>

                  {/* Department */}
                  <td className="text-gray-700">
                    {doctor.department}
                  </td>

                  {/* Experience */}
                  <td className="text-gray-700">
                    {doctor.experience}
                  </td>

                  {/* Contact */}
                  <td>
                    <div className="space-y-2">

                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Phone size={15} />
                        {doctor.phone}
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Mail size={15} />
                        {doctor.email}
                      </div>

                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${doctor.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : doctor.status === "On Leave"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {doctor.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="flex items-center justify-center">
                      <button className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                        <Trash2 size={18} className="text-red-500" />
                        Delete
                      </button>
                    </div>
                  </td>

                </tr>
  )
}

export default DoctorInfoCard