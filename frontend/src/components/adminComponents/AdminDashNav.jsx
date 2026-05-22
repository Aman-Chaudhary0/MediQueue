import { LogOut } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import authService from '../../api/authService'
import { useAuth } from '../../context/AuthContext'

const AdminDashNav = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true)
    setConfirmLogout(false)
  }

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true)
      await authService.logout()
      logout()
      navigate('/login')
    } catch (err) {
      console.error('Logout failed:', err)
      logout()
      navigate('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleCloseModal = () => {
    setIsLogoutModalOpen(false)
    setConfirmLogout(false)
  }

// ==========================================================================================================================================================================

  return (
    <>
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

                        <button
                          type="button"
                          onClick={() => navigate('/change-password')}
                          className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50 sm:w-auto"
                        >
                            Change Password
                        </button>
                    </div>
                </div>

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

                        {/* Logout Button */}
                        <button
                          type="button"
                          onClick={handleLogoutClick}
                          className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-red-600 transition hover:bg-red-100"
                          title="Logout"
                        >
                          <LogOut size={18} />
                          <span className="text-xs font-medium">Logout</span>
                        </button>
                    </div>

                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:w-96">
                  <h2 className="mb-2 text-lg font-semibold text-gray-800">Confirm Logout</h2>
                  <p className="mb-6 text-sm text-gray-600">
                    {!confirmLogout
                      ? 'Are you sure you want to logout?'
                      : 'Click confirm again to logout.'}
                  </p>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={isLoggingOut}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    {!confirmLogout ? (
                      <button
                        type="button"
                        onClick={() => setConfirmLogout(true)}
                        className="flex-1 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-600"
                      >
                        Yes, I'm sure
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConfirmLogout}
                        disabled={isLoggingOut}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                      >
                        {isLoggingOut ? 'Logging out...' : 'Confirm Logout'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            </>
  )
}

export default AdminDashNav
