import { RefreshCcw } from 'lucide-react'
import React from 'react'

const QueueManageNav = () => {
  return (
     <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <h1 className='text-2xl sm:text-3xl font-bold'>Queue Management</h1>

                <button className='flex w-full items-center justify-center rounded border-2 border-blue-600 px-3 py-2 text-sm font-semibold text-blue-600 transition duration-300 hover:bg-blue-600 hover:text-white sm:w-auto'>
                    <RefreshCcw className="w-5 h-5 m-2" />
                    <span>Refresh Queue</span>
                </button>
            </div>
  )
}

export default QueueManageNav