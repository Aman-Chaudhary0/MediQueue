import { Bell } from 'lucide-react'
import React from 'react'

const DoctorNav = () => {
  return (
     <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4'>
                <div>
                    <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold'>Welcome back, Dr. Rajesh!</h1>
                    <p className='text-xs sm:text-sm text-gray-600'>Here's what's happening with your health appointments. </p>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-start">
                    {/* Notification Icon */}
                    <button className="relative rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100">
                        <Bell size={20} className="text-gray-700" />

                        {/* Notification Dot */}
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
                    </button>

                    {/* Profile Tab */}
                    <div className="flex min-w-0 items-center gap-3 rounded-xl bg-gray-50 px-3 py-2 cursor-pointer transition hover:bg-gray-100">

                        <img
                            src="https://i.pravatar.cc/100"
                            alt="profile"
                            className="h-11 w-11 rounded-full object-cover"
                        />

                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-gray-800">
                                Aman Sharma
                            </h3>
                            <p className="text-xs text-gray-500">
                                Admin
                            </p>
                        </div>
                    </div>
                </div>
            </div>
  )
}

export default DoctorNav