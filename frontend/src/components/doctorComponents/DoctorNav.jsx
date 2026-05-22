import { Bell } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchWithAuth } from '../../api/fetchWithAuth'

const DoctorNav = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [doctorName, setDoctorName] = useState('')
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/100')

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      setLoading(false)
      setError('Please login again to load doctor profile.')
      return
    }

    const fetchMyDoctor = async () => {
      try {
        setLoading(true)
        setError('')

        // fetching api
        const data = await fetchWithAuth('/api/doctor/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

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
  }, [isAuthenticated, authLoading])


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
