import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import authService from '../../api/authService'

const AppointmentDetails = () => {
    const { appointmentId } = useParams()
    const navigate = useNavigate()
    const [appointment, setAppointment] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [cancelError, setCancelError] = useState('')
    const [cancelSuccess, setCancelSuccess] = useState('')
    const [isConfirmingCancel, setIsConfirmingCancel] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)

    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            if (!appointmentId) {
                setError('Appointment ID is missing')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError('')
                setCancelError('')
                setCancelSuccess('')

                const response = await authService.getAppointmentDetails(appointmentId)
                setAppointment(response?.appointment || null)
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load appointment details')
            } finally {
                setLoading(false)
            }
        }

        fetchAppointmentDetails()
    }, [appointmentId])

    const formattedAppointment = useMemo(() => {
        if (!appointment) return null

        const appointmentDate = new Date(appointment.appointmentDate)

        return {
            patientName: appointment?.patient?.user?.name || 'Patient',
            doctorName: appointment?.doctor?.user?.name || 'Doctor',
            specialization: appointment?.doctor?.specialization || appointment?.doctor?.department || 'Specialization not added',
            hospital: appointment?.doctor?.hospital || 'Hospital not added',
            date: appointmentDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }),
            time: appointment?.startTime || '--',
            endTime: appointment?.endTime || '--',
            token: appointment?.tokenNumber || '--',
            status: appointment?.status || 'pending',
            fees: appointment?.doctor?.consultationFee ?? 0,
        }
    }, [appointment])

    const getStatusStyle = () => {
        if (formattedAppointment?.status === 'completed') {
            return 'bg-green-100 text-green-600'
        }

        if (formattedAppointment?.status === 'pending' || formattedAppointment?.status === 'confirmed') {
            return 'bg-yellow-100 text-yellow-600'
        }

        return 'bg-red-100 text-red-600'
    }

    const handleCancelClick = async () => {
        if (!isConfirmingCancel) {
            setIsConfirmingCancel(true)
            setCancelError('')
            setCancelSuccess('')
            return
        }

        try {
            setIsCancelling(true)
            setCancelError('')
            setCancelSuccess('')

            const response = await authService.cancelAppointment(appointmentId)
            setAppointment(response?.appointment || appointment)
            setCancelSuccess(response?.message || 'Appointment cancelled successfully')
            setIsConfirmingCancel(false)
        } catch (err) {
            setCancelError(err?.response?.data?.message || 'Failed to cancel appointment')
        } finally {
            setIsCancelling(false)
        }
    }

    const handleCancelAbort = () => {
        setIsConfirmingCancel(false)
        setCancelError('')
    }

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            {loading ? (
                <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 text-center text-sm text-gray-600 shadow-md">
                    Loading appointment details...
                </div>
            ) : error ? (
                <div className="mx-auto max-w-4xl rounded-xl bg-red-50 p-6 text-center text-sm text-red-600 shadow-md">
                    {error}
                </div>
            ) : !formattedAppointment ? (
                <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 text-center text-sm text-gray-600 shadow-md">
                    Appointment details not found.
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Appointment Details
                        </h1>
                        <p className="text-gray-500 text-sm">
                            View complete information about your appointment
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-6 gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {formattedAppointment.doctorName}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    {formattedAppointment.specialization}
                                </p>
                            </div>

                            <span
                                className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusStyle()}`}
                            >
                                {formattedAppointment.status.toUpperCase()}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-500 text-sm">Patient Name</p>
                                <p className="font-medium">{formattedAppointment.patientName}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Token Number</p>
                                <p className="font-medium">{formattedAppointment.token}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Date</p>
                                <p className="font-medium">{formattedAppointment.date}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Time</p>
                                <p className="font-medium">{formattedAppointment.time}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">End Time</p>
                                <p className="font-medium">{formattedAppointment.endTime}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Hospital</p>
                                <p className="font-medium">{formattedAppointment.hospital}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Consultation Fees</p>
                                <p className="font-medium">Rs. {formattedAppointment.fees}</p>
                            </div>
                        </div>

                        {cancelSuccess && (
                            <div className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                                {cancelSuccess}
                            </div>
                        )}

                        {cancelError && (
                            <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                {cancelError}
                            </div>
                        )}

                        {isConfirmingCancel && formattedAppointment.status === 'pending' && (
                            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                                <p className="text-sm font-medium text-red-700">
                                    Are you sure you want to cancel this appointment?
                                </p>
                                <p className="mt-1 text-sm text-red-600">
                                    Click "Yes, Cancel" to confirm or "Keep Appointment" to go back.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end gap-4 mt-8">
                            {formattedAppointment.status === 'pending' && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleCancelClick}
                                        disabled={isCancelling}
                                        className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
                                    >
                                        {isCancelling
                                            ? 'Cancelling...'
                                            : isConfirmingCancel
                                                ? 'Yes, Cancel'
                                                : 'Cancel Appointment'}
                                    </button>

                                    {isConfirmingCancel && (
                                        <button
                                            type="button"
                                            onClick={handleCancelAbort}
                                            disabled={isCancelling}
                                            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            Keep Appointment
                                        </button>
                                    )}
                                </>
                            )}

                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default AppointmentDetails
