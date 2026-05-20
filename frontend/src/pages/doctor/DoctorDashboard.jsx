import { Clock, Users } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import DoctorNav from '../../components/doctorComponents/DoctorNav';
import DocAppointmentsInfo from '../../components/doctorComponents/DocAppointmentsInfo';
import UpcomingPatientsCard from '../../components/doctorComponents/UpcomingPatientsCard';
import TodaySchedule from '../../components/doctorComponents/TodaySchedule';
import authService from '../../api/authService';

const DoctorDashboard = () => {
    const [upcomingPatients, setUpcomingPatients] = useState([])
    const [upcomingPatientsLoading, setUpcomingPatientsLoading] = useState(true)
    const [upcomingPatientsError, setUpcomingPatientsError] = useState('')
    const [todaySchedule, setTodaySchedule] = useState([])
    const [todayScheduleLoading, setTodayScheduleLoading] = useState(true)
    const [todayScheduleError, setTodayScheduleError] = useState('')

    useEffect(() => {
        const fetchUpcomingPatients = async () => {
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
        }

        fetchUpcomingPatients()
    }, [])

    useEffect(() => {
        const fetchTodaySchedule = async () => {
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
        }

        fetchTodaySchedule()
    }, [])

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
                status:
                    appointment?.status === 'completed'
                        ? 'completed'
                        : appointment?.status === 'confirmed'
                            ? 'active'
                            : 'upcoming',
            }))
    }, [todaySchedule]);

    const parseTimeToMinutes = (timeValue) => {
        // expects "h:mm AM/PM" like "9:30 AM"
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

// ==========================================================================================================================================================================

    return (
        <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6'>
            <DoctorNav />

            {/* Quick Navigation */}
            <div className="mb-6 flex justify-end">
                <button
                    type="button"
                    onClick={() => window.location.assign('/doctor/queue-management')}
                    className="border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                >
                    Queue Management
                </button>
            </div>



            <DocAppointmentsInfo />



            {/* ================================ Upcoming Patients =============================== */}
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
        </div>
    )
}

export default DoctorDashboard
