import { CalendarDays, Clock, DollarSign, Save, ToggleLeft, Users } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DoctorNav from '../../components/doctorComponents/DoctorNav';
import DocAppointmentsInfo from '../../components/doctorComponents/DocAppointmentsInfo';
import UpcomingPatientsCard from '../../components/doctorComponents/UpcomingPatientsCard';
import TodaySchedule from '../../components/doctorComponents/TodaySchedule';
import authService from '../../api/authService';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const DoctorDashboard = () => {
    const [upcomingPatients, setUpcomingPatients] = useState([])
    const [upcomingPatientsLoading, setUpcomingPatientsLoading] = useState(true)
    const [upcomingPatientsError, setUpcomingPatientsError] = useState('')
    const [todaySchedule, setTodaySchedule] = useState([])
    const [todayScheduleLoading, setTodayScheduleLoading] = useState(true)
    const [todayScheduleError, setTodayScheduleError] = useState('')
    const [statsRefreshKey, setStatsRefreshKey] = useState(0)

    const [doctorAvailable, setDoctorAvailable] = useState(true)
    const [consultationFee, setConsultationFee] = useState('')
    const [schedule, setSchedule] = useState([])
    const [settingsLoading, setSettingsLoading] = useState(true)
    const [settingsError, setSettingsError] = useState('')
    const [settingsSuccess, setSettingsSuccess] = useState('')
    const [savingSettings, setSavingSettings] = useState(false)

    const [actionLoading, setActionLoading] = useState(false)
    const [actionMessage, setActionMessage] = useState('')
    const [actionError, setActionError] = useState('')
    const [notesAppointment, setNotesAppointment] = useState(null)
    const [consultationNotes, setConsultationNotes] = useState('')

    const fetchUpcomingPatients = useCallback(async () => {
        try {
            setUpcomingPatientsLoading(true)
            setUpcomingPatientsError('')

            const response = await authService.getDoctorUpcomingPatients()
            setUpcomingPatients(Array.isArray(response?.appointments) ? response.appointments : [])
        } catch (err) {
            setUpcomingPatientsError(err?.response?.data?.message || "Failed to load today's upcoming patients")
        } finally {
            setUpcomingPatientsLoading(false)
        }
    }, [])

    const fetchTodaySchedule = useCallback(async () => {
        try {
            setTodayScheduleLoading(true)
            setTodayScheduleError('')

            const response = await authService.getDoctorTodaySchedule()
            setTodaySchedule(Array.isArray(response?.appointments) ? response.appointments : [])
        } catch (err) {
            setTodayScheduleError(err?.response?.data?.message || "Failed to load today's schedule")
        } finally {
            setTodayScheduleLoading(false)
        }
    }, [])

    const fetchDoctorSettings = useCallback(async () => {
        try {
            setSettingsLoading(true)
            setSettingsError('')

            const [profileResponse, scheduleResponse] = await Promise.all([
                authService.getCurrentDoctorProfile(),
                authService.getDoctorSchedule(),
            ])

            const doctor = profileResponse?.doctor
            setDoctorAvailable(Boolean(doctor?.isAvailable))
            setConsultationFee(String(doctor?.consultationFee ?? ''))
            setSchedule(Array.isArray(scheduleResponse?.schedules) ? scheduleResponse.schedules : [])
        } catch (err) {
            setSettingsError(err?.response?.data?.message || 'Failed to load doctor settings')
        } finally {
            setSettingsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUpcomingPatients()
        fetchTodaySchedule()
        fetchDoctorSettings()
    }, [fetchDoctorSettings, fetchTodaySchedule, fetchUpcomingPatients])

    const statusStyles = {
        completed: "bg-green-100 text-green-600",
        inprogress: "bg-green-100 text-green-700",
        upcoming: "bg-blue-100 text-blue-600",
        active: "bg-blue-100 text-blue-700 border border-blue-300",
        break: "bg-gray-100 text-gray-500",
    };

    const formattedUpcomingPatients = useMemo(() => {
        const todayDateKey = new Date().toDateString()

        return upcomingPatients
            .filter((appointment) => {
                const bookingDateKey = new Date(appointment.appointmentDate).toDateString()
                return bookingDateKey === todayDateKey
            })
            .map((appointment) => ({
                id: appointment._id,
                token: appointment?.tokenNumber || '--',
                name: appointment?.patient?.user?.name || 'Patient',
                gender: appointment?.patient?.gender || 'N/A',
                age: appointment?.patient?.age || 'N/A',
                time: appointment?.startTime || '--',
                status: appointment?.status === 'confirmed' ? 'Confirmed' : 'Waiting',
            }))
    }, [upcomingPatients])

    const formattedTodaySchedule = useMemo(() => {
        const todayDateKey = new Date().toDateString()

        return todaySchedule
            .filter((appointment) => new Date(appointment.appointmentDate).toDateString() === todayDateKey)
            .map((appointment) => ({
                id: appointment._id,
                time: appointment?.startTime || '--',
                token: appointment?.tokenNumber || '--',
                name: appointment?.patient?.user?.name || 'Patient',
                notes: appointment?.consultationNotes || '',
                status:
                    appointment?.status === 'completed'
                        ? 'completed'
                        : appointment?.status === 'confirmed'
                            ? 'active'
                            : 'upcoming',
            }))
    }, [todaySchedule]);

    const parseTimeToMinutes = (timeValue) => {
        if (!timeValue) return null;

        const match = String(timeValue).match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/i);
        if (!match) return null;

        let hours = Number(match[1]);
        const minutes = Number(match[2]);
        const period = match[3].toUpperCase();

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        return hours * 60 + minutes;
    };

    const todayStats = useMemo(() => {
        const todayDateKey = new Date().toDateString();

        const completedToday = (todaySchedule || []).filter((appointment) => {
            const bookingDateKey = new Date(appointment.appointmentDate).toDateString();
            return bookingDateKey === todayDateKey && appointment?.status === "completed";
        });

        const patientsSeen = completedToday.length;

        const durationsMinutes = completedToday
            .map((a) => {
                const startMins = parseTimeToMinutes(a.startTime);
                const endMins = parseTimeToMinutes(a.endTime);
                if (startMins == null || endMins == null) return null;
                const diff = endMins - startMins;
                return diff >= 0 ? diff : null;
            })
            .filter((v) => typeof v === "number");

        const avgMinutes =
            durationsMinutes.length > 0
                ? Math.round(durationsMinutes.reduce((sum, v) => sum + v, 0) / durationsMinutes.length)
                : null;

        return {
            patientsSeen,
            avgMinutes,
        };
    }, [todaySchedule]);

    const updateScheduleRow = (dayOfWeek, field, value) => {
        setSettingsSuccess('')
        setSettingsError('')
        setSchedule((currentSchedule) =>
            currentSchedule.map((item) =>
                item.dayOfWeek === dayOfWeek
                    ? {
                        ...item,
                        [field]: value,
                    }
                    : item
            )
        )
    }

    const handleSaveFeeAndAvailability = async () => {
        try {
            setSavingSettings(true)
            setSettingsError('')
            setSettingsSuccess('')

            await authService.updateConsultationFee(Number(consultationFee || 0))
            await authService.updateDoctorAvailability(doctorAvailable)
            setSettingsSuccess('Availability and fee updated.')
        } catch (err) {
            setSettingsError(err?.response?.data?.message || 'Failed to save doctor settings')
        } finally {
            setSavingSettings(false)
        }
    }

    const handleSaveScheduleDay = async (scheduleItem) => {
        try {
            setSavingSettings(true)
            setSettingsError('')
            setSettingsSuccess('')

            const response = await authService.setDoctorSchedule({
                dayOfWeek: scheduleItem.dayOfWeek,
                isAvailable: Boolean(scheduleItem.isAvailable),
                startTime: scheduleItem.startTime,
                endTime: scheduleItem.endTime,
                breaks: scheduleItem.breaks || [],
                maxPatientsPerDay: Number(scheduleItem.maxPatientsPerDay || 20),
                slotDuration: Number(scheduleItem.slotDuration || 30),
            })

            setSchedule((currentSchedule) =>
                currentSchedule.map((item) =>
                    item.dayOfWeek === scheduleItem.dayOfWeek ? response.schedule : item
                )
            )
            setSettingsSuccess(`${daysOfWeek[scheduleItem.dayOfWeek]} schedule updated.`)
        } catch (err) {
            setSettingsError(err?.response?.data?.message || 'Failed to save schedule')
        } finally {
            setSavingSettings(false)
        }
    }

    const refreshAppointmentsAfterAction = async () => {
        await Promise.all([fetchTodaySchedule(), fetchUpcomingPatients()])
        setStatsRefreshKey((value) => value + 1)
    }

    const handleMarkCompleted = async (appointmentId) => {
        try {
            setActionLoading(true)
            setActionError('')
            setActionMessage('')

            await authService.updateAppointmentStatus(appointmentId, 'completed')
            setActionMessage('Appointment marked as completed.')
            await refreshAppointmentsAfterAction()
        } catch (err) {
            setActionError(err?.response?.data?.message || 'Failed to complete appointment')
        } finally {
            setActionLoading(false)
        }
    }

    const handleOpenNotes = (appointment) => {
        setNotesAppointment(appointment)
        setConsultationNotes(appointment?.notes || '')
        setActionError('')
        setActionMessage('')
    }

    const handleSaveNotes = async () => {
        if (!notesAppointment) return

        try {
            setActionLoading(true)
            setActionError('')
            setActionMessage('')

            await authService.addConsultationNotes(notesAppointment.id, {
                consultationNotes,
            })
            setNotesAppointment(null)
            setConsultationNotes('')
            setActionMessage('Consultation notes saved.')
            await refreshAppointmentsAfterAction()
        } catch (err) {
            setActionError(err?.response?.data?.message || 'Failed to save consultation notes')
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6'>
            <DoctorNav />

            <div className="mb-6 flex justify-end">
                <button
                    type="button"
                    onClick={() => window.location.assign('/doctor/queue-management')}
                    className="border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                >
                    Queue Management
                </button>
            </div>

            <DocAppointmentsInfo key={statsRefreshKey} />

            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <ToggleLeft className="text-blue-600" size={22} />
                        <h2 className="text-lg font-semibold text-gray-800">Availability</h2>
                    </div>

                    <label className="mb-4 flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3">
                        <span className="text-sm font-medium text-gray-700">Available for appointments</span>
                        <input
                            type="checkbox"
                            checked={doctorAvailable}
                            onChange={(e) => setDoctorAvailable(e.target.checked)}
                            className="h-5 w-5 accent-blue-600"
                        />
                    </label>

                    <label className="block text-sm font-medium text-gray-700">
                        Consultation Fees
                        <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                            <DollarSign size={16} className="text-gray-400" />
                            <input
                                type="number"
                                min="0"
                                value={consultationFee}
                                onChange={(e) => setConsultationFee(e.target.value)}
                                className="w-full outline-none"
                            />
                        </div>
                    </label>

                    <button
                        type="button"
                        onClick={handleSaveFeeAndAvailability}
                        disabled={savingSettings || settingsLoading}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        <Save size={16} /> Save Settings
                    </button>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
                    <div className="mb-4 flex items-center gap-3">
                        <CalendarDays className="text-blue-600" size={22} />
                        <h2 className="text-lg font-semibold text-gray-800">Weekly Schedule</h2>
                    </div>

                    {settingsLoading ? (
                        <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-600">Loading schedule...</div>
                    ) : (
                        <div className="space-y-3">
                            {schedule.map((item) => (
                                <div key={item.dayOfWeek} className="grid grid-cols-1 gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 md:grid-cols-[1fr_120px_120px_120px_auto] md:items-center">
                                    <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(item.isAvailable)}
                                            onChange={(e) => updateScheduleRow(item.dayOfWeek, 'isAvailable', e.target.checked)}
                                            className="h-4 w-4 accent-blue-600"
                                        />
                                        {daysOfWeek[item.dayOfWeek]}
                                    </label>

                                    <input
                                        type="text"
                                        value={item.startTime || ''}
                                        onChange={(e) => updateScheduleRow(item.dayOfWeek, 'startTime', e.target.value)}
                                        disabled={!item.isAvailable}
                                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none disabled:bg-gray-100"
                                        placeholder="9:00 AM"
                                    />

                                    <input
                                        type="text"
                                        value={item.endTime || ''}
                                        onChange={(e) => updateScheduleRow(item.dayOfWeek, 'endTime', e.target.value)}
                                        disabled={!item.isAvailable}
                                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none disabled:bg-gray-100"
                                        placeholder="5:00 PM"
                                    />

                                    <input
                                        type="number"
                                        min="1"
                                        value={item.maxPatientsPerDay || 20}
                                        onChange={(e) => updateScheduleRow(item.dayOfWeek, 'maxPatientsPerDay', e.target.value)}
                                        disabled={!item.isAvailable}
                                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none disabled:bg-gray-100"
                                        placeholder="Patients"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => handleSaveScheduleDay(item)}
                                        disabled={savingSettings}
                                        className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-60"
                                    >
                                        Save
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {settingsError ? <p className="mt-3 text-sm text-red-600">{settingsError}</p> : null}
                    {settingsSuccess ? <p className="mt-3 text-sm text-green-700">{settingsSuccess}</p> : null}
                </div>
            </div>

            <div className="mb-8 w-full rounded-2xl bg-white p-4 shadow-md sm:p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Upcoming Patients
                </h2>

                <div className="hidden grid-cols-4 border-b pb-2 font-medium text-gray-600 md:grid">
                    <div>Token No.</div>
                    <div>Patient Details</div>
                    <div>Time</div>
                    <div>Status</div>
                </div>

                {upcomingPatientsLoading ? (
                    <div className='rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-600'>
                        Loading today's upcoming patients...
                    </div>
                ) : upcomingPatientsError ? (
                    <div className='rounded-xl bg-red-50 p-6 text-center text-sm text-red-600'>
                        {upcomingPatientsError}
                    </div>
                ) : formattedUpcomingPatients.length === 0 ? (
                    <div className='rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-600'>
                        No upcoming patients found for today.
                    </div>
                ) : (
                    formattedUpcomingPatients.map((item) => (
                        <UpcomingPatientsCard key={item.id} item={item} />
                    ))
                )}
            </div>

            <div className="w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Today's Schedule
                    </h2>
                </div>

                {actionError ? <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{actionError}</div> : null}
                {actionMessage ? <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{actionMessage}</div> : null}

                <div className="relative">
                    <div className="absolute bottom-0 left-[2.65rem] top-0 hidden w-0.5 bg-gray-200 sm:block"></div>

                    <div className="space-y-4">
                        {todayScheduleLoading ? (
                            <div className='rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-600'>
                                Loading today's schedule...
                            </div>
                        ) : todayScheduleError ? (
                            <div className='rounded-xl bg-red-50 p-6 text-center text-sm text-red-600'>
                                {todayScheduleError}
                            </div>
                        ) : formattedTodaySchedule.length === 0 ? (
                            <div className='rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-600'>
                                No appointments scheduled for today.
                            </div>
                        ) : (
                            formattedTodaySchedule.map((item) => (
                                <TodaySchedule
                                    key={item.id}
                                    item={item}
                                    statusStyles={statusStyles}
                                    actionLoading={actionLoading}
                                    onMarkCompleted={handleMarkCompleted}
                                    onOpenNotes={handleOpenNotes}
                                />
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 sm:grid-cols-2">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Clock className="text-blue-600" size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Average Consultation Time
                            </p>
                            <h3 className="text-lg font-semibold text-blue-600">
                                {todayScheduleLoading ? "..." : todayStats.avgMinutes == null ? "-- min" : `${todayStats.avgMinutes} min`}
                            </h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Users className="text-blue-600" size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Patients Seen
                            </p>
                            <h3 className="text-lg font-semibold text-blue-600">
                                {todayScheduleLoading ? "..." : todayStats.patientsSeen}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {notesAppointment ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-800">Consultation Notes</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {notesAppointment.name} - {notesAppointment.token}
                        </p>

                        <textarea
                            value={consultationNotes}
                            onChange={(e) => setConsultationNotes(e.target.value)}
                            rows={6}
                            className="mt-4 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Write consultation notes..."
                        />

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setNotesAppointment(null)}
                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveNotes}
                                disabled={actionLoading}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {actionLoading ? 'Saving...' : 'Save Notes'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default DoctorDashboard
