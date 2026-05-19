import React, { useEffect, useState, useRef, useCallback } from 'react'
import { CheckCircle2, Search, UserRound, Loader } from 'lucide-react'
import authService from '../../api/authService'

const DoctorSelection = ({ selectedDoctorId, onSelectDoctor }) => {
  const [allDoctors, setAllDoctors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const scrollContainerRef = useRef(null)
  const DOCTORS_PER_PAGE = 10

  // Fetch doctors with pagination
  const fetchDoctors = useCallback(async (pageNum = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true)
      } else {
        setIsLoadingMore(true)
      }
      setError('')

      const data = await authService.getAllDoctors()
      const doctorList = Array.isArray(data?.doctors) ? data.doctors : []
      
      // Calculate pagination
      const startIndex = (pageNum - 1) * DOCTORS_PER_PAGE
      const endIndex = startIndex + DOCTORS_PER_PAGE
      const paginatedDoctors = doctorList.slice(startIndex, endIndex)
      
      if (pageNum === 1) {
        setAllDoctors(paginatedDoctors)
      } else {
        setAllDoctors(prev => [...prev, ...paginatedDoctors])
      }
      
      // Check if there are more doctors to fetch
      setHasMore(endIndex < doctorList.length)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load doctors')
    } finally {
      setLoading(false)
      setIsLoadingMore(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchDoctors(1)
  }, [])

  // Handle scroll to load more
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isLoadingMore || !hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const scrolledPercentage = (scrollTop + clientHeight) / scrollHeight

    // Load more when user scrolls to 80% or more
    if (scrolledPercentage > 0.8) {
      setPage(prev => prev + 1)
      fetchDoctors(page + 1)
    }
  }, [isLoadingMore, hasMore, page, fetchDoctors])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  const filteredDoctors = allDoctors.filter((doctor) => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return true

    const doctorName = doctor?.user?.name?.toLowerCase() || ''
    const specialization = doctor?.specialization?.toLowerCase() || ''
    const department = doctor?.department?.toLowerCase() || ''
    const hospital = doctor?.hospital?.toLowerCase() || ''

    return (
      doctorName.includes(query) ||
      specialization.includes(query) ||
      department.includes(query) ||
      hospital.includes(query)
    )
  })

// ==========================================================================================================================================================================

  return (
    <div className='mb-6 rounded-2xl border-t border-gray-300 p-4 shadow-2xl sm:mb-8 sm:p-8'>
      <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='text-lg font-semibold sm:text-2xl'>1. Select a Doctor</h2>

        <div className='relative w-full sm:w-1/3'>
          <input
            type="text"
            placeholder='Search by name or speciality'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 sm:p-3 sm:text-base'
          />
          <button
            type="button"
            className='absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700'
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className='rounded-lg bg-white p-6 text-center text-sm text-gray-600 shadow-md'>
          Loading doctors...
        </div>
      ) : error ? (
        <div className='rounded-lg bg-red-50 p-6 text-center text-sm text-red-600 shadow-md'>
          {error}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className='rounded-lg bg-white p-6 text-center text-sm text-gray-600 shadow-md'>
          No doctors found.
        </div>
      ) : (
        <div 
          ref={scrollContainerRef}
          className='scrollbar-hide mb-6 flex max-h-128 flex-col gap-4 overflow-y-auto pr-1 sm:mb-8'
        >
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className={`flex cursor-pointer flex-col gap-4 rounded-lg border p-4 shadow-md transition hover:-translate-y-1 hover:shadow-lg sm:flex-row sm:items-center ${
                selectedDoctorId === doctor._id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-transparent bg-white'
              }`}
              onClick={() => onSelectDoctor?.(doctor)}
              role='button'
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelectDoctor?.(doctor)
              }}
            >
              {doctor?.profilePic ? (
                <img
                  src={doctor.profilePic}
                  alt={doctor?.user?.name || 'Doctor'}
                  className='h-32 w-full rounded-md object-cover sm:mb-0 sm:h-24 sm:w-24 sm:shrink-0 sm:rounded-full'
                />
              ) : (
                <div className='flex h-32 items-center justify-center rounded-md bg-gray-100 sm:h-24 sm:w-24 sm:shrink-0 sm:rounded-full'>
                  <UserRound className='h-16 w-16 text-gray-400' />
                </div>
              )}

              <div className='min-w-0 flex-1'>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                  <div>
                    <div className='flex items-center justify-center gap-2 sm:justify-start'>
                      <h2 className='text-center text-sm font-semibold sm:text-left sm:text-lg'>
                      {doctor?.user?.name || 'Doctor'}
                      </h2>
                      {selectedDoctorId === doctor._id ? (
                        <CheckCircle2 className='h-5 w-5 text-blue-600' />
                      ) : null}
                    </div>
                    <p className='text-center text-xs text-gray-600 sm:text-left sm:text-sm'>
                      {doctor?.specialization || doctor?.department || 'Specialization not added'}
                    </p>
                  </div>

                  <p className='text-center text-xs font-medium capitalize text-blue-600 sm:text-right sm:text-sm'>
                    {doctor?.status || 'active'}
                  </p>
                </div>

                <div className='mt-3 grid grid-cols-1 gap-2 text-center text-xs text-gray-600 sm:grid-cols-2 sm:text-left sm:text-sm'>
                  <p>{doctor?.hospital || 'Hospital not added'}</p>
                  <p>
                    {doctor?.experience ? `${doctor.experience} years experience` : 'Experience not added'}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator for more doctors */}
          {isLoadingMore && (
            <div className='flex justify-center py-4'>
              <Loader className='h-5 w-5 animate-spin text-blue-600' />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DoctorSelection
