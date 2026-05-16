import { Bell, Search } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const AdminDashNav = () => {
  const navigate = useNavigate()

// ==========================================================================================================================================================================

  return (
    <nav className="flex w-full justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between">

                {/* Left Section */}
                <div className='flex flex-col gap-4'>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Admin Dashboard
                        </h1>
                        <p className="text-sm text-gray-500 ">
                            Welcome back, Aman! Here's what's happening today.
                        </p>
                    </div>



                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => navigate('/admin/manage-doctors')}
                          className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
                        >
                            Manage Doctors
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate('/admin/analytics')}
                          className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
                        >
                            Analytics
                        </button>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">

                 

                    <div className="flex items-center justify-between gap-3 sm:justify-start">
                        {/* Notification Icon */}
                        <button className="relative rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100">
                            <Bell size={20} className="text-gray-700" />

                            {/* Notification Dot */}
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
                        </button>

                        {/* Profile Tab */}
                        <div
                          className="flex min-w-0 items-center gap-3 rounded-xl bg-gray-50 px-3 py-2 cursor-pointer transition hover:bg-gray-100"
                        >

                            <img
                                src={assets.adminProfile}
                                alt="profile"
                                className="h-11 w-11 rounded-full object-cover"
                            />

                            <div className="min-w-0">
                                <h3 className="truncate text-sm font-semibold text-gray-800">
                                    Aman Chaudhary
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Admin
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </nav>
  )
}

export default AdminDashNav
