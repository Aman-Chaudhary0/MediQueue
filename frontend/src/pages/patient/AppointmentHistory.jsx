import { Calendar, CircleCheck, CircleX, Clock } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import RecentAppointments from '../../components/patientComponents/RecentAppointments'
import FilterNavbar from '../../components/patientComponents/FilterNavbar'
import authService from '../../api/authService'





const AppointmentHistory = () => {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await authService.getPatientAppointments()
                const appointmentList = Array.isArray(response?.appointments) ? response.appointments : []
                setAppointments(appointmentList)
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load appointment history')
            } finally {
                setLoading(false)
            }
        }

        fetchAppointments()
    }, [])

    const formattedAppointments = useMemo(() => {
        return appointments.map((appointment) => {
            const appointmentDate = new Date(appointment.appointmentDate)
            const normalizedStatus = appointment?.status || 'pending'
            const displayStatus =
                normalizedStatus === 'completed'
                    ? 'Completed'
                    : normalizedStatus === 'cancelled'
                        ? 'Cancelled'
                        : appointmentDate >= new Date()
                            ? 'Upcoming'
                            : 'Pending'

            return {
                id: appointment._id,
                doctorName: appointment?.doctor?.user?.name || 'Doctor',
                hospital: appointment?.doctor?.hospital || 'Hospital not added',
                specialization: appointment?.doctor?.specialization || appointment?.doctor?.department || 'Specialization not added',
                date: appointmentDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                }),
                time: appointment?.startTime || '--',
                token: appointment?.tokenNumber || '--',
                status: displayStatus,
                photo: appointment?.doctor?.profilePic || '',
            }
        })
    }, [appointments])

    const appointmentStats = useMemo(() => {
        const now = new Date()

        return appointments.reduce(
            (stats, appointment) => {
                const appointmentDate = new Date(appointment.appointmentDate)
                const status = appointment?.status

                stats.total += 1

                if (status === 'completed') {
                    stats.completed += 1
                } else if (status === 'cancelled') {
                    stats.cancelled += 1
                } else if (appointmentDate >= now && (status === 'pending' || status === 'confirmed')) {
                    stats.upcoming += 1
                }

                return stats
            },
            {
                total: 0,
                completed: 0,
                upcoming: 0,
                cancelled: 0,
            }
        )
    }, [appointments])

    

// ==========================================================================================================================================================================

    return (
        <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6'>


            {/* ========================  NAV TITLE ============================== */}
            <div className="flex flex-col">

                <h1 className="text-2xl font-semibold text-gray-800">
                    Appointment History
                </h1>
                <p className="text-sm sm:text-base text-gray-500">
                    View your past appointments and consultation details.
                </p>
            </div>



            {/* ============================ APPOINTMENTS INFO ============================= */}

            <div className='w-full py-8 sm:py-10'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                    <div className='flex items-center gap-4 rounded-2xl border border-blue-300 bg-blue-50 p-5 sm:p-6'>
                        <Calendar className='h-12 w-12 shrink-0 rounded-full bg-blue-200 p-1 text-blue-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Total Appointments</p>
                            <p className='text-2xl font-bold'>{appointmentStats.total}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 rounded-2xl border border-green-300 bg-green-50 p-5 sm:p-6'>
                        <CircleCheck className='h-12 w-12 shrink-0 rounded-full bg-green-200 p-1 text-green-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Completed</p>
                            <p className='text-2xl font-bold'>{appointmentStats.completed}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 rounded-2xl border border-orange-300 bg-orange-50 p-5 sm:p-6'>
                        <Clock className='h-12 w-12 shrink-0 rounded-full bg-orange-200 p-1 text-orange-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Upcoming</p>
                            <p className='text-2xl font-bold'>{appointmentStats.upcoming}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 rounded-2xl border border-red-300 bg-red-50 p-5 sm:p-6'>
                        <CircleX className='h-12 w-12 shrink-0 rounded-full bg-red-200 p-1 text-red-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Cancelled/ Missed</p>
                            <p className='text-2xl font-bold'>{appointmentStats.cancelled}</p>
                        </div>
                    </div>
                </div>
            </div>


            <FilterNavbar />


           <div>
            {/* ============================== APPOINTMENTS HISTORY ======================================= */}
            <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Appointments</h2>

                {loading ? (
                    <div className='rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-600'>
                        Loading appointment history...
                    </div>
                ) : error ? (
                    <div className='rounded-lg bg-red-50 p-6 text-center text-sm text-red-600'>
                        {error}
                    </div>
                ) : formattedAppointments.length === 0 ? (
                    <div className='rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-600'>
                        No appointments found.
                    </div>
                ) : (
                    <>

                <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-225 text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 text-sm">
                                <th className="p-3">Doctor</th>
                                <th className="p-3">Specialization</th>
                                <th className="p-3">Date & Time</th>
                                <th className="p-3">Token No.</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {formattedAppointments.map((item) => (
                                <RecentAppointments key={item.id} item={item} isTableRow={true} />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-4 lg:hidden">
                    {formattedAppointments.map((item) => (
                        <RecentAppointments key={item.id} item={item} isTableRow={false} />
                    ))}
                </div>
                    </>
                )}
            </div>
        </div>



        </div>
    )
}

export default AppointmentHistory
