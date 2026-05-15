import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import AuthHeader from '../../components/common/AuthHeader'
import authService from '../../api/authService'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
    const navigate = useNavigate()
    const { isAuthenticated, user } = useAuth()

    useEffect(() => {
        if (!isAuthenticated) return
        if (user?.role === 'admin') navigate('/admin/dashboard', { replace: true })
        else if (user?.role === 'doctor') navigate('/doctor/dashboard', { replace: true })
        else if (user?.role === 'patient') navigate('/patient/dashboard', { replace: true })
        else navigate('/', { replace: true })
    }, [isAuthenticated, user, navigate])

    if (isAuthenticated) return null
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirm_password) {
            setError('All fields are required')
            return
        }

        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            const response = await authService.registerPatient(
                formData.name,
                formData.email,
                formData.password
            )

            if (response.success) {
                setSuccess('Registration successful! Redirecting to login...')
                localStorage.setItem('user', JSON.stringify(response.user))
                localStorage.setItem('accessToken', response.accessToken)

                setTimeout(() => {
                    navigate('/patient/dashboard')
                }, 1500)
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }


// ==========================================================================================================================================================================

    return (
        <div className='flex flex-col lg:flex-row min-h-screen'>

            <AuthHeader />


            {/* ================================ Register FORM =========================== */}
            <div className='w-full lg:w-1/2 flex items-center justify-center px-4 py-8 sm:py-0'>
                <div className='w-full max-w-md'>
                    <div className='lg:hidden mb-6 text-center'>
                        <img src={assets.homepage_logo} alt="logo" className='w-10 h-10 mx-auto mb-2 rounded-full' />
                        <h1 className='text-xl font-semibold'>Medi<span className='text-blue-800'>Queue</span></h1>
                        <p className='text-xs italic'>Your health, our priority</p>
                    </div>
                    <div className='p-6 sm:p-8 bg-white rounded-lg shadow-lg'>
                        <h2 className='text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-center'>Create Account</h2>
                        <p className='text-xs sm:text-sm italic mb-4 sm:mb-6 text-center'>Fill in the details to get started</p>

                        {error && (
                            <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm'>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className='mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm'>
                                {success}
                            </div>
                        )}

                        <form className='space-y-4 sm:space-y-6' onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className='block text-xs sm:text-sm font-medium text-gray-700'>Full Name</label>
                                <input 
                                    placeholder="Enter Your Full Name" 
                                    type="text" 
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className='w-full mt-1 p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600' 
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className='block text-xs sm:text-sm font-medium text-gray-700'>Email Address</label>
                                <input 
                                    placeholder="Enter Your Email" 
                                    type="email" 
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className='w-full mt-1 p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600' 
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className='block text-xs sm:text-sm font-medium text-gray-700'>Password</label>
                                <input 
                                    placeholder="Enter your password" 
                                    type="password" 
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className='w-full mt-1 p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600' 
                                />
                            </div>

                            <div>
                                <label htmlFor="confirm_password" className='block text-xs sm:text-sm font-medium text-gray-700'>Confirm Password</label>
                                <input 
                                    placeholder="Confirm your password" 
                                    type="password" 
                                    id="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    required
                                    className='w-full mt-1 p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600' 
                                />
                            </div>

                            <div className='rounded-md border border-blue-100 bg-blue-50 p-3 text-xs sm:text-sm text-blue-900'>
                                â„¹ï¸ New accounts are registered as patients by default. Doctors and Admins are created by administrators.
                            </div>

                            <div className='flex items-center justify-between'>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className='w-full bg-blue-600 text-white py-2 sm:py-3 px-4 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                                >
                                    {loading ? 'Registering...' : 'Register'}
                                </button>
                            </div>

                            <p className='text-center text-xs sm:text-sm text-gray-600'>
                                Already have an account? <button 
                                    type="button"
                                    onClick={() => navigate('/login')} 
                                    className='text-blue-600 hover:underline'
                                >
                                    Login here
                                </button>
                            </p>
                        </form>
                    </div>

                    {/* ===================== Info Box =========================== */}

                    <div className='mt-4 sm:mt-6 p-6 sm:p-8 bg-white rounded-lg shadow-lg text-center'>
                        <p className='text-xs sm:text-sm font-semibold mb-3'>ðŸ‘¨â€âš•ï¸ Are you a Doctor?</p>
                        <p className='text-xs sm:text-sm mb-3'>Contact an administrator to create your account</p>
                        <button className='w-full bg-gray-600 text-white py-2 sm:py-3 px-4 text-sm sm:text-base rounded-md hover:bg-gray-700 transition-colors'>
                            Contact Admin
                        </button>
                    </div>


                </div>
            </div>
        </div>

    )
}

export default Register
