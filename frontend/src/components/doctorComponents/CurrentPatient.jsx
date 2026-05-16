import { Calendar, CheckCircle, Clock, FastForward, Phone, SkipForward } from 'lucide-react'
import React from 'react'

const CurrentPatient = ({
    patient,
    nextPatient,
    loading,
    error,
    actionLoading,
    actionError,
    onMarkCompleted,
    onNextPatient,
    onSkipPatient,
}) => {
    function DetailRow({ label, value }) {
        return (
            <div className="flex flex-col gap-1 pb-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <span className="text-gray-500 text-sm">{label}</span>
                <span className="font-medium text-gray-800 sm:text-right">{value}</span>
            </div>
        )
    }

    if (loading) {
        return (
            <section className="rounded-2xl bg-white p-6 shadow-lg">
                <div className="text-center text-sm text-gray-600">Loading current patient...</div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="rounded-2xl bg-red-50 p-6 shadow-lg">
                <div className="text-center text-sm text-red-600">{error}</div>
            </section>
        )
    }

    if (!patient) {
        return (
            <section className="rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 font-semibold text-blue-600">CURRENT PATIENT</h2>
                <div className="text-center text-sm text-gray-600">No current patient in queue for today.</div>
            </section>
        )
    }

    const patientStatusLabel = patient.status === 'confirmed' ? 'In Consultation' : 'Waiting'

    return (
        <section>
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
                <h2 className="text-blue-600 font-semibold mb-4">CURRENT PATIENT</h2>

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="text-center lg:min-w-45">
                        <p className="text-gray-500 text-sm">TOKEN NO.</p>
                        <h1 className="text-4xl sm:text-5xl font-bold text-green-600">{patient.token}</h1>
                        <p className="text-green-600 text-sm mt-1">{patientStatusLabel}</p>
                    </div>

                    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left lg:flex-1">
                        <img
                            src={patient.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                            alt="patient"
                            className="w-20 h-20 rounded-full object-cover"
                        />

                        <div className="min-w-0">
                            <h3 className="text-xl font-semibold">{patient.name}</h3>
                            <p className="text-gray-500 text-sm">
                                {patient.age} yrs, {patient.gender}
                            </p>

                            <div className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-600 sm:justify-start">
                                <Phone size={16} />
                                {patient.phone}
                            </div>

                            <div className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-600 sm:justify-start">
                                <Calendar size={16} />
                                Appointment
                            </div>

                            <div className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-600 sm:justify-start">
                                <Clock size={16} />
                                {patient.time} | {patient.date}
                            </div>
                        </div>
                    </div>
                </div>

                {actionError ? (
                    <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        {actionError}
                    </div>
                ) : null}

                <div className="flex flex-wrap gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onMarkCompleted}
                        disabled={actionLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300 sm:w-auto"
                    >
                        <CheckCircle size={18} />
                        {actionLoading ? 'Updating...' : 'Mark as Completed'}
                    </button>

                    <button
                        type="button"
                        onClick={onNextPatient}
                        disabled={actionLoading || !nextPatient}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-yellow-500 px-4 py-2 text-yellow-600 hover:bg-yellow-50 disabled:cursor-not-allowed disabled:border-yellow-200 disabled:text-yellow-300 sm:w-auto"
                    >
                        <FastForward size={18} />
                        {nextPatient ? `Next Patient (${nextPatient.token})` : 'No Next Patient'}
                    </button>

                    <button
                        type="button"
                        onClick={onSkipPatient}
                        disabled={actionLoading || !nextPatient}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500 px-4 py-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-red-200 disabled:text-red-300 sm:w-auto"
                    >
                        <SkipForward size={18} />
                        Skip Patient
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6 mt-6">
                <h2 className="text-blue-600 font-semibold mb-4">
                    PATIENT DETAILS
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <DetailRow label="Patient Name" value={patient.name} />
                        <DetailRow label="Age / Gender" value={`${patient.age} yrs / ${patient.gender}`} />
                        <DetailRow label="Contact" value={patient.phone} />
                        <DetailRow label="Token Number" value={patient.token} />
                        <DetailRow label="Queue Status" value={patientStatusLabel} />
                    </div>

                    <div className="space-y-3">
                        <DetailRow label="Appointment Time" value={patient.time} />
                        <DetailRow label="Appointment Date" value={patient.date} />
                        <DetailRow label="Doctor" value={patient.doctorName} />
                        <DetailRow label="Hospital" value={patient.hospital} />
                        <DetailRow label="Consultation Fee" value={`Rs. ${patient.consultationFee}`} />
                    </div>
                </div>

                <div className="mt-6 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                    No previous prescriptions found for this patient.
                </div>
            </div>
        </section>
    )
}

export default CurrentPatient
