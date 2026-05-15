import React from 'react'
import { UserRound, Search } from 'lucide-react'

const DoctorSelection = () => {

// ==========================================================================================================================================================================

  return (
    <div className='mb-6 rounded-2xl border-t border-gray-300 p-4 shadow-2xl sm:mb-8 sm:p-8'>
      <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='text-lg font-semibold sm:text-2xl'>1. Select a Doctor</h2>

        <div className='relative w-full sm:w-1/3'>
          <input
            type="text"
            placeholder='Search by name or speciality'
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

      <div className='mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 lg:grid-cols-3'>
        <div className='rounded-lg bg-white p-4 shadow-md'>
          <UserRound className='mb-4 h-24 w-full rounded-md object-cover text-gray-400 sm:h-32' />
          <h2 className='text-center text-sm font-semibold sm:text-lg'>Dr. John Doe</h2>
          <p className='text-center text-xs text-gray-600 sm:text-sm'>Cardiologist</p>
          <p className='text-center text-xs text-gray-600 sm:text-sm'>City Hospital</p>
          <p className='text-center text-xs text-gray-600 sm:text-sm'>10 years experience</p>
        </div>

        <div className='rounded-lg bg-white p-4 shadow-md'>
          <UserRound className='mb-4 h-24 w-full rounded-md object-cover text-gray-400 sm:h-32' />
          <h2 className='text-center text-sm font-semibold sm:text-lg'>Dr. Jane Smith</h2>
          <p className='text-center text-xs text-gray-600 sm:text-sm'>Dermatologist</p>
          <p className='text-center text-xs text-gray-600 sm:text-sm'>Green Clinic</p>
        </div>
      </div>
    </div>
  )
}

export default DoctorSelection
