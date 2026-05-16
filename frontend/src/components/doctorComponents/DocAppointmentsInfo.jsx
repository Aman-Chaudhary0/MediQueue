import React, { useEffect, useState } from 'react'
import { CircleCheck, ClipboardClock, Clock, Users } from 'lucide-react';
import authService from '../../api/authService';


const DocAppointmentsInfo = () => {
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchDoctorAppointmentStats = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await authService.getDoctorAppointmentStats()
                setStats(response?.stats || {
                    total: 0,
                    completed: 0,
                    inProgress: 0,
                    pending: 0,
                })
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load appointment stats')
            } finally {
                setLoading(false)
            }
        }

        fetchDoctorAppointmentStats()
    }, [])

// ==========================================================================================================================================================================

  const statCards = [
    {
      title: 'Total Appointments',
      value: stats.total,
      icon: Users,
      wrapperClass: 'border-blue-300 bg-blue-50',
      iconClass: 'bg-blue-200 text-blue-900',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CircleCheck,
      wrapperClass: 'border-green-300 bg-green-50',
      iconClass: 'bg-green-200 text-green-900',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      wrapperClass: 'border-orange-300 bg-orange-50',
      iconClass: 'bg-orange-200 text-orange-900',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: ClipboardClock,
      wrapperClass: 'border-violet-300 bg-violet-50',
      iconClass: 'bg-violet-200 text-violet-900',
    },
  ]

  return (
      <div className='w-full py-8 sm:py-10'>
            {loading ? (
                <div className='rounded-2xl bg-white p-6 text-center text-sm text-gray-600 shadow-md'>
                    Loading appointment stats...
                </div>
            ) : error ? (
                <div className='rounded-2xl bg-red-50 p-6 text-center text-sm text-red-600 shadow-md'>
                    {error}
                </div>
            ) : (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                    {statCards.map((card) => {
                        const Icon = card.icon

                        return (
                            <div key={card.title} className={`flex items-center gap-4 rounded-2xl border p-5 sm:p-6 ${card.wrapperClass}`}>
                                <Icon className={`h-12 w-12 shrink-0 rounded-full p-1 ${card.iconClass}`} />
                                <div className='min-w-0'>
                                    <p className='text-xs font-semibold text-gray-600'>{card.title}</p>
                                    <p className='text-2xl font-bold'>{card.value}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
      </div>
  )
}

export default DocAppointmentsInfo
