import { Bell } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PatientNav = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const accessToken = user?.accessToken || localStorage.getItem('accessToken') || ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [fullName, setFullName] = useState('')
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/100')

  const authHeaders = useMemo(
    () => ({
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    }),
    [accessToken]
  )

  useEffect(() => {
    if (authLoading) return
    if (!accessToken) {
      setLoading(false)
      setError('Please login again to load patient data.')
      return
    }

    const fetchMyPatient = async () => {
      try {
        setLoading(true)
        setError('')

        const res = await fetch('http://localhost:3000/api/patient/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'Failed to load patient data')

        const patient = data?.patient
        setFullName(patient?.user?.name || '')
        setProfilePic(patient?.profilepic || 'https://via.placeholder.com/100')
      } catch (e) {
        setError(e?.message || 'Failed to load patient data')
      } finally {
        setLoading(false)
      }
    }

    fetchMyPatient()
  }, [accessToken, authHeaders, authLoading])



// ==========================================================================================================================================================================

  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4'>
      <div>
        <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold'>
          {loading ? 'Welcome back...' : `Welcome back, ${fullName || 'Patient'}!`}
        </h1>
        <p className='text-xs sm:text-sm text-gray-600'>Here's what's happening with your health appointments. </p>
        {error ? <p className='text-xs text-red-600 mt-1'>{error}</p> : null}
      </div>

      <div className='flex items-center justify-between gap-3 sm:justify-start'>
        {/* Notification Icon */}
        <button className='relative rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100' type='button'>
          <Bell size={20} className='text-gray-700' />
          <span className='absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500'></span>
        </button>

        {/* Profile Tab */}
        <div
          onClick={() => navigate('/patient/profile')}
          className='flex min-w-0 items-center gap-3 rounded-xl bg-gray-50 px-3 py-2 cursor-pointer transition hover:bg-gray-100'
          role='button'
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') navigate('/patient/profile')
          }}
        >
          <img src={profilePic} alt='profile' className='h-11 w-11 rounded-full object-cover' />

          <div className='min-w-0'>
            <h3 className='truncate text-sm font-semibold text-gray-800'>
              {loading ? '...' : fullName || 'Patient'}
            </h3>
            <p className='text-xs text-gray-500'>Patient</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientNav
