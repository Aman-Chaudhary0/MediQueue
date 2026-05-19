import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import PatientNav from '../../components/patientComponents/PatientNav';
import UpcomingAppointment from '../../components/patientComponents/UpcomingAppointment';
import LiveQueueStatus from '../../components/patientComponents/LiveQueueStatus';
import QuickOptions from '../../components/patientComponents/QuickOptions';
import DashAppointmentSummary from '../../components/patientComponents/DashAppointmentSummary';
import DashRecentAppointments from '../../components/patientComponents/DashRecentAppointments';
import { Loader } from 'lucide-react';
import authService from '../../api/authService';


const parseAppointmentDateTime = (appointmentDateValue, startTime) => {
    const appointmentDate = new Date(appointmentDateValue)
    if (!startTime) return appointmentDate

    const match = String(startTime).match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/i)
    if (!match) return appointmentDate

    let hours = Number(match[1])
    const minutes = Number(match[2])
    const period = match[3].toUpperCase()

    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0

    const combinedDate = new Date(appointmentDate)
    combinedDate.setHours(hours, minutes, 0, 0)
    return combinedDate
}


const Dashboard = () => {
    const [allAppointments, setAllAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const tableScrollRef = useRef(null)
    const APPOINTMENTS_PER_PAGE = 10

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await authService.getPatientAppointments()
                const allAppts = Array.isArray(response?.appointments) ? response.appointments : []
                
                // Get first page of appointments
                const startIndex = 0
                const endIndex = APPOINTMENTS_PER_PAGE
                const paginatedAppts = allAppts.slice(startIndex, endIndex)
                
                setAllAppointments(paginatedAppts)
                setHasMore(endIndex < allAppts.length)
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load appointments')
            } finally {
                setLoading(false)
            }
        }

        fetchAppointments()
    }, [])

    const handleScroll = useCallback(() => {
        if (!tableScrollRef.current || isLoadingMore || !hasMore) return

        const { scrollLeft, scrollWidth, clientWidth } = tableScrollRef.current
        const scrolledPercentage = (scrollLeft + clientWidth) / scrollWidth

        // Load more when scrolled to 80% or more
        if (scrolledPercentage > 0.8) {
            setIsLoadingMore(true)
            setPage(prev => prev + 1)
            
            const fetchMore = async () => {
                try {
                    const response = await authService.getPatientAppointments()
                    const allAppts = Array.isArray(response?.appointments) ? response.appointments : []
                    
                    const startIndex = (page) * APPOINTMENTS_PER_PAGE
                    const endIndex = startIndex + APPOINTMENTS_PER_PAGE
                    const paginatedAppts = allAppts.slice(startIndex, endIndex)
                    
                    setAllAppointments(prev => [...prev, ...paginatedAppts])
                    setHasMore(endIndex < allAppts.length)
                } catch (err) {
                    console.error('Error loading more appointments:', err)
                } finally {
                    setIsLoadingMore(false)
                }
            }
            fetchMore()
        }
    }, [isLoadingMore, hasMore, page])

    useEffect(() => {
        const container = tableScrollRef.current
        if (container) {
            container.addEventListener('scroll', handleScroll)
            return () => container.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    const formattedAppointments = useMemo(() => {
        const now = new Date()

        return allAppointments.map((appointment) => {
            const appointmentDate = new Date(appointment.appointmentDate)
            const appointmentDateTime = parseAppointmentDateTime(appointment.appointmentDate, appointment.startTime)
            const rawStatus = appointment?.status || 'pending'

            const displayStatus =
                rawStatus === 'completed'
                    ? 'Completed'
                    : rawStatus === 'cancelled'
                        ? 'Cancelled'
                        : appointmentDateTime >= now
                            ? 'Pending'
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
                appointmentDateTime,
                rawStatus,
            }
        })
    }, [allAppointments])

    const nearestPendingUpcomingAppointment = useMemo(() => {
        const now = new Date()

        return formattedAppointments
            .filter((appointment) => appointment.rawStatus === 'pending' && appointment.appointmentDateTime >= now)
            .sort((a, b) => a.appointmentDateTime - b.appointmentDateTime)[0] || null
    }, [formattedAppointments])

    const appointmentSummaryStats = useMemo(() => {
        const now = new Date()

        return formattedAppointments.reduce(
            (stats, appointment) => {
                stats.total += 1

                if (appointment.rawStatus === 'completed') {
                    stats.completed += 1
                } else if (appointment.rawStatus === 'cancelled') {
                    stats.cancelled += 1
                } else if (appointment.appointmentDateTime >= now) {
                    stats.upcoming += 1
                }

                return stats
            },
            {
                total: 0,
                upcoming: 0,
                completed: 0,
                cancelled: 0,
            }
        )
    }, [formattedAppointments])

// ==========================================================================================================================================================================

    return (

        // ============================= DASHBOARD ================================ 
        <div className='p-3 sm:p-6 m-1 sm:m-2'>
            <PatientNav />
            <UpcomingAppointment
                appointment={nearestPendingUpcomingAppointment}
                loading={loading}
                error={error}
            />

            <LiveQueueStatus />

            <QuickOptions />


            <DashAppointmentSummary
                stats={appointmentSummaryStats}
                loading={loading}
                error={error}
            />



            {/* ================= RECENT APPOINTMENTS =============================== */}


            <div className="p-3 sm:p-6 bg-white rounded-2xl shadow-md">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Appointments</h2>

                <div className="overflow-x-auto" ref={tableScrollRef}>
                    {loading ? (
                        <div className='rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-600'>
                            Loading appointments...
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
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600 text-xs sm:text-sm">
                                        <th className="p-2 sm:p-3">Doctor</th>
                                        <th className="p-2 sm:p-3 hidden sm:table-cell">Specialization</th>
                                        <th className="p-2 sm:p-3 hidden md:table-cell">Date & Time</th>
                                        <th className="p-2 sm:p-3">Token No.</th>
                                        <th className="p-2 sm:p-3">Status</th>
                                        <th className="p-2 sm:p-3">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {formattedAppointments.map((item) => (
                                        <DashRecentAppointments key={item.id} item={item} />
                                    ))}
                                </tbody>
                            </table>
                            
                            {isLoadingMore && (
                                <div className='flex justify-center py-4'>
                                    <Loader className='h-5 w-5 animate-spin text-blue-600' />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>



        </div>




    )
}

export default Dashboard
