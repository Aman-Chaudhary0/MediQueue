import { Users, Info, RefreshCw } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import QueueManageNav from '../../components/doctorComponents/QueueManageNav';
import DocAppointmentsInfo from '../../components/doctorComponents/DocAppointmentsInfo';
import CurrentPatient from '../../components/doctorComponents/CurrentPatient';
import UpcomingQueue from '../../components/doctorComponents/UpcomingQueue';
import authService from '../../api/authService';

const getTokenNumberValue = (token) => Number(String(token || '').replace(/\D/g, '')) || 0

const QueueManagement = () => {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)
    const [actionError, setActionError] = useState('')

    const fetchTodaySchedule = useCallback(async () => {
        try {
            setLoading(true)
            setError('')

            const response = await authService.getDoctorTodaySchedule()
            setAppointments(Array.isArray(response?.appointments) ? response.appointments : [])
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load today's queue")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTodaySchedule()
    }, [fetchTodaySchedule])

    const todayAppointments = useMemo(() => {
        const todayDateKey = new Date().toDateString()

        return appointments
            .filter((appointment) => new Date(appointment.appointmentDate).toDateString() === todayDateKey)
            .sort((a, b) => getTokenNumberValue(a?.tokenNumber) - getTokenNumberValue(b?.tokenNumber))
    }, [appointments])

    const currentAppointment = useMemo(() => {
        return (
            todayAppointments.find((appointment) => appointment.status === 'confirmed') ||
            todayAppointments.find((appointment) => appointment.status === 'pending') ||
            null
        )
    }, [todayAppointments])

    const nextPendingAppointment = useMemo(() => {
        if (!currentAppointment) {
            return todayAppointments.find((appointment) => appointment.status === 'pending') || null
        }

        return (
            todayAppointments.find((appointment) => {
                return (
                    appointment._id !== currentAppointment._id &&
                    appointment.status === 'pending'
                )
            }) || null
        )
    }, [currentAppointment, todayAppointments])

    const currentPatient = useMemo(() => {
        if (!currentAppointment) return null

        return {
            id: currentAppointment._id,
            token: currentAppointment?.tokenNumber || '--',
            name: currentAppointment?.patient?.user?.name || 'Patient',
            age: currentAppointment?.patient?.age || 'N/A',
            gender: currentAppointment?.patient?.gender || 'N/A',
            phone: currentAppointment?.patient?.mobileNo || 'N/A',
            time: currentAppointment?.startTime || '--',
            date: new Date(currentAppointment.appointmentDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }),
            status: currentAppointment?.status || 'pending',
            doctorName: currentAppointment?.doctor?.user?.name || 'Doctor',
            hospital: currentAppointment?.doctor?.hospital || 'Hospital not added',
            consultationFee: currentAppointment?.doctor?.consultationFee ?? 0,
            profilePic: currentAppointment?.patient?.profilepic || '',
        }
    }, [currentAppointment])

    const upcomingQueue = useMemo(() => {
        return todayAppointments
            .filter((appointment) => currentAppointment ? appointment._id !== currentAppointment._id : true)
            .filter((appointment) => appointment.status === 'pending')
            .map((appointment, index) => ({
                id: appointment._id,
                token: appointment?.tokenNumber || '--',
                name: appointment?.patient?.user?.name || 'Patient',
                age: appointment?.patient?.age || 'N/A',
                gender: appointment?.patient?.gender || 'N/A',
                time: appointment?.startTime || '--',
                status: index === 0 ? 'Next' : 'Waiting',
            }))
    }, [currentAppointment, todayAppointments])

    const runQueueAction = async (updates) => {
        try {
            setActionLoading(true)
            setActionError('')

            for (const update of updates) {
                if (!update?.appointmentId || !update?.status) continue
                await authService.updateAppointmentStatus(update.appointmentId, update.status)
            }

            await fetchTodaySchedule()
        } catch (err) {
            setActionError(err?.response?.data?.message || 'Failed to update queue status')
        } finally {
            setActionLoading(false)
        }
    }

    const handleMarkCompleted = async () => {
        if (!currentAppointment) return

        await runQueueAction([
            {
                appointmentId: currentAppointment._id,
                status: 'completed',
            },
        ])
    }

    const handleNextPatient = async () => {
        if (!currentAppointment || !nextPendingAppointment) return

        const updates = []

        if (currentAppointment.status !== 'completed') {
            updates.push({
                appointmentId: currentAppointment._id,
                status: 'completed',
            })
        }

        updates.push({
            appointmentId: nextPendingAppointment._id,
            status: 'confirmed',
        })

        await runQueueAction(updates)
    }

    const handleSkipPatient = async () => {
        if (!currentAppointment || !nextPendingAppointment) return

        await runQueueAction([
            {
                appointmentId: currentAppointment._id,
                status: 'cancelled',
            },
            {
                appointmentId: nextPendingAppointment._id,
                status: 'confirmed',
            },
        ])
    }

// ==========================================================================================================================================================================

    return (
        <div className='mx-auto max-w-7xl p-4 sm:p-6'>
            <QueueManageNav />

            <DocAppointmentsInfo />

            <CurrentPatient
                patient={currentPatient}
                nextPatient={upcomingQueue[0] || null}
                loading={loading}
                error={error}
                actionLoading={actionLoading}
                actionError={actionError}
                onMarkCompleted={handleMarkCompleted}
                onNextPatient={handleNextPatient}
                onSkipPatient={handleSkipPatient}
            />

            <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-blue-600 font-semibold">UPCOMING QUEUE</h2>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                            <Users size={16} /> {upcomingQueue.length} Patients Waiting
                        </span>

                        <button
                            type="button"
                            onClick={fetchTodaySchedule}
                            className="flex w-full items-center justify-center gap-1 rounded-lg border px-3 py-2 text-blue-600 hover:bg-blue-50 sm:w-auto sm:py-1"
                        >
                            <RefreshCw size={16} /> Refresh
                        </button>
                    </div>
                </div>

                <div className="hidden grid-cols-4 pb-2 text-sm font-medium text-gray-500 md:grid">
                    <span>Token No.</span>
                    <span>Patient Name</span>
                    <span>Time</span>
                    <span>Status</span>
                </div>

                <div className="space-y-2">
                    {loading ? (
                        <div className='rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-600'>
                            Loading queue...
                        </div>
                    ) : error ? (
                        <div className='rounded-xl bg-red-50 p-6 text-center text-sm text-red-600'>
                            {error}
                        </div>
                    ) : upcomingQueue.length === 0 ? (
                        <div className='rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-600'>
                            No more patients waiting in the queue.
                        </div>
                    ) : (
                        upcomingQueue.map((patient) => (
                            <UpcomingQueue key={patient.id} patient={patient} />
                        ))
                    )}
                </div>

                <div className="flex justify-between items-center mt-6">
                    <button className="text-blue-600 text-sm hover:underline">
                        View All Patients
                    </button>
                </div>
            </div>

            <div className="mt-6 flex w-full flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 sm:px-6">
                <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <Info className="text-blue-600 w-5 h-5" />
                    </div>
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold text-blue-700">Tips:</span>{' '}
                        Use <span className="font-medium">Next Patient</span> to move the queue forward after consultation, or use Skip Patient to send the current patient back into the waiting queue.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default QueueManagement
