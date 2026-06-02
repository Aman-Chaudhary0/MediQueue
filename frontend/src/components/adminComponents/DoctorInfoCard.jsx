import React from 'react'
import { Phone, Mail, Trash2, CheckCircle2, Ban, PauseCircle, RotateCcw } from 'lucide-react'

const DoctorInfoCard = ({
  doctor,
  index,
  isTableRow = true,
  isConfirmingDelete = false,
  onRequestDelete,
  onConfirmDelete,
  onAbortDelete,
  onWorkflowAction,
  actionLoading,
}) => {
  const renderWorkflowActions = () => {
    const verificationStatus = String(doctor.verificationStatus || 'approved').toLowerCase()
    const status = String(doctor.status || '').toLowerCase()

    const actions = []

    if (verificationStatus === 'pending') {
      actions.push({ key: 'approve', label: 'Approve', icon: CheckCircle2, className: 'border-green-200 text-green-700 hover:bg-green-50' })
      actions.push({ key: 'reject', label: 'Reject', icon: Ban, className: 'border-red-200 text-red-600 hover:bg-red-50' })
    } else if (verificationStatus === 'suspended') {
      actions.push({ key: 'reactivate', label: 'Reactivate', icon: RotateCcw, className: 'border-green-200 text-green-700 hover:bg-green-50' })
    } else if (status === 'active') {
      actions.push({ key: 'deactivate', label: 'Deactivate', icon: PauseCircle, className: 'border-yellow-200 text-yellow-700 hover:bg-yellow-50' })
      actions.push({ key: 'suspend', label: 'Suspend', icon: Ban, className: 'border-red-200 text-red-600 hover:bg-red-50' })
    } else if (verificationStatus === 'approved') {
      actions.push({ key: 'reactivate', label: 'Reactivate', icon: RotateCcw, className: 'border-green-200 text-green-700 hover:bg-green-50' })
    }

    return actions.map((action) => {
      const Icon = action.icon

      return (
        <button
          key={action.key}
          type="button"
          onClick={() => onWorkflowAction?.(doctor.doctorProfileId, action.key)}
          disabled={actionLoading}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-60 ${action.className}`}
        >
          <Icon size={18} />
          {action.label}
        </button>
      )
    })
  }

  const workflowActions = renderWorkflowActions()

  if (!isTableRow) {
    return (
      <div key={index} className="rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-4">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="h-14 w-14 rounded-full object-cover"
          />

          <div className="min-w-0">
            <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
            <p className="text-sm text-gray-500">ID: {doctor.id}</p>
            <p className="truncate text-sm text-gray-500">{doctor.email}</p>
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

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {workflowActions}
          {!isConfirmingDelete ? (
            <button
              type="button"
              onClick={onRequestDelete}
              className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 size={18} className="text-red-500" />
              Delete
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onConfirmDelete}
                className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                <Trash2 size={18} className="text-white" />
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={onAbortDelete}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Keep Doctor
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
      <td className="py-5">
        <div className="flex items-center gap-4">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-14 h-14 rounded-full object-cover"
          />

          <div>
            <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
            <p className="text-sm text-gray-500">ID: {doctor.id}</p>
            <p className="text-sm text-gray-500">{doctor.email}</p>
          </div>
        </div>
      </td>

      <td>
        <div className="flex items-center gap-2 text-gray-700">
          {doctor.icon}
          {doctor.specialty}
        </div>
      </td>

      <td className="text-gray-700">{doctor.department}</td>

      <td className="text-gray-700">{doctor.experience}</td>

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

      <td>
        <div className="space-y-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            doctor.status === "Active"
              ? "bg-green-100 text-green-700"
              : doctor.status === "On Leave"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {doctor.status}
        </span>
        <p className="text-xs font-medium capitalize text-gray-500">
          {doctor.verificationStatus}
        </p>
        </div>
      </td>

      <td>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {workflowActions}
          {!isConfirmingDelete ? (
            <button
              type="button"
              onClick={onRequestDelete}
              className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 size={18} className="text-red-500" />
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onConfirmDelete}
                className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                <Trash2 size={18} className="text-white" />
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={onAbortDelete}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Keep
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

export default DoctorInfoCard
