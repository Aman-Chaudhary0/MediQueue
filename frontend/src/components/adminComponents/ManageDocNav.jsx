
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const ManageDocNav = () => {
    const navigate = useNavigate()

// ==========================================================================================================================================================================

    return (
        <nav className="flex  justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Left Section */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Manage Doctors
            </h1>

            {/* Right Section */}
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">


                <div className="flex items-center justify-between gap-3 sm:justify-start">
                

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
