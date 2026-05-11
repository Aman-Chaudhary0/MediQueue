import React from 'react'
import { CircleCheck, ClipboardClock, Clock, Users } from 'lucide-react';


const DocAppointmentsInfo = () => {
  return (
      <div className='w-full py-8 sm:py-10'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                    <div className='flex items-center gap-4 rounded-2xl border border-blue-300 bg-blue-50 p-5 sm:p-6'>
                        <Users className='h-12 w-12 shrink-0 rounded-full bg-blue-200 p-1 text-blue-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Total Appointments</p>
                            <p className='text-2xl font-bold'>24</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 rounded-2xl border border-green-300 bg-green-50 p-5 sm:p-6'>
                        <CircleCheck className='h-12 w-12 shrink-0 rounded-full bg-green-200 p-1 text-green-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Completed</p>
                            <p className='text-2xl font-bold'>1</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 rounded-2xl border border-orange-300 bg-orange-50 p-5 sm:p-6'>
                        <Clock className='h-12 w-12 shrink-0 rounded-full bg-orange-200 p-1 text-orange-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>In Progress</p>
                            <p className='text-2xl font-bold'>1</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 rounded-2xl border border-violet-300 bg-violet-50 p-5 sm:p-6'>
                        <ClipboardClock className='h-12 w-12 shrink-0 rounded-full bg-violet-200 p-1 text-violet-900' />
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-gray-600'>Pending</p>
                            <p className='text-2xl font-bold'>11</p>
                        </div>
                    </div>
                </div>
            </div>
  )
}

export default DocAppointmentsInfo