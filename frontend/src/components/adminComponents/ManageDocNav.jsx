
import { Bell, Search } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const ManageDocNav = () => {
    const navigate = useNavigate()

// ==========================================================================================================================================================================

    return (
        <nav className="flex w-full flex-col gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Left Section */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Manage Doctors
            </h1>

            {/* Right Section */}
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">

                {/* Search Box */}
                <div className="relative w-full lg:w-auto">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search patients, doctors, appointments..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
                    />
                </div>

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

export default ManageDocNav
