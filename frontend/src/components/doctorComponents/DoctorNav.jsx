import { Bell } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const DoctorNav = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const accessToken = user?.accessToken || localStorage.getItem('accessToken') || ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [doctorName, setDoctorName] = useState('')
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
      setError('Please login again to load doctor profile.')
      return
    }

    const fetchMyDoctor = async () => {
      try {
        setLoading(true)
        setError('')

        // fetching api
        const res = await fetch('http://localhost:3000/api/doctor/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'Failed to load doctor profile')

        const doctor = data?.doctor

        setDoctorName(doctor?.user?.name || '')
        setProfilePic(doctor?.profilePic || 'https://via.placeholder.com/100')
      } catch (e) {
        setError(e?.message || 'Failed to load doctor profile')
      } finally {
        setLoading(false)
      }
    }

    fetchMyDoctor()
  }, [accessToken, authHeaders, authLoading])


// ==========================================================================================================================================================================

  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4'>
      <div>
        <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold'>
          {loading ? 'Welcome back, Doctor!' : `Welcome back, ${doctorName || 'Doctor'}!`}
        </h1>
        <p className='text-xs sm:text-sm text-gray-600'>Here's what's happening with your health appointments.</p>
        {error ? <p className='text-xs text-red-600 mt-1'>{error}</p> : null}
      </div>

      <div className='flex items-center justify-between gap-3 sm:justify-start'>

        <div
          onClick={() => navigate('/doctor/profile')}
          className='flex min-w-0 items-center gap-3 rounded-xl bg-gray-50 px-3 py-2 cursor-pointer transition hover:bg-gray-100'
          role='button'
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') navigate('/doctor/profile')
          }}
        >
          <img src={profilePic} alt='profile' className='h-11 w-11 rounded-full object-cover' />

          <div className='min-w-0'>
            <h3 className='truncate text-sm font-semibold text-gray-800'>
              {loading ? '...' : doctorName || 'Doctor'}
            </h3>
            <p className='text-xs text-gray-500'>Doctor</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorNav
