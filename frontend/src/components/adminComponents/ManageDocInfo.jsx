import { BriefcaseMedical, ShieldPlus, UserRoundCheck } from 'lucide-react'
import React from 'react'

const ManageDocInfo = () => {

// ==========================================================================================================================================================================

  return (
      <div className='w-full py-8 sm:py-10'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          <div className='flex w-full items-center gap-4 rounded-2xl border border-blue-300 bg-blue-50 p-5 sm:p-6'>
            <BriefcaseMedical className='h-12 w-12 shrink-0 rounded-full bg-blue-200 p-1 text-blue-900' />
            <div className='min-w-0'>
              <p className='text-xs font-semibold text-gray-600'>Total Doctors</p>
              <p className='text-2xl font-bold'>86</p>
            </div>
          </div>

          <div className='flex w-full items-center gap-4 rounded-2xl border border-green-300 bg-green-50 p-5 sm:p-6'>
            <ShieldPlus className='h-12 w-12 shrink-0 rounded-full bg-green-200 p-1 text-green-900' />
            <div className='min-w-0'>
              <p className='text-xs font-semibold text-gray-600'>Active Doctors</p>
              <p className='text-2xl font-bold'>78</p>
            </div>
          </div>

          <div className='flex w-full items-center gap-4 rounded-2xl border border-violet-300 bg-violet-50 p-5 sm:p-6'>
            <UserRoundCheck className='h-12 w-12 shrink-0 rounded-full bg-violet-200 p-1 text-violet-900' />
            <div className='min-w-0'>
              <p className='text-xs font-semibold text-gray-600'>On Duty Today</p>
              <p className='text-2xl font-bold'>32</p>
            </div>
          </div>

          <div className='flex w-full items-center gap-4 rounded-2xl border border-orange-300 bg-orange-50 p-5 sm:p-6'>
            <UserRoundCheck className='h-12 w-12 shrink-0 rounded-full bg-orange-200 p-1 text-orange-900' />
            <div className='min-w-0'>
              <p className='text-xs font-semibold text-gray-600'>On leave</p>
              <p className='text-2xl font-bold'>8</p>
            </div>
          </div>
        </div>
      </div>

  )
}

export default ManageDocInfo