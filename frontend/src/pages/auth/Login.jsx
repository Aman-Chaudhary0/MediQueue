import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import AuthHeader from '../../components/common/AuthHeader'
import authService from '../../api/authService'

const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const response = await authService.login(formData.email, formData.password)

            if (response.success || response.message === "Login successful") {
                setSuccess('Login successful! Redirecting...')
                localStorage.setItem('user', JSON.stringify(response.user))
                localStorage.setItem('accessToken', response.accessToken)

                // Redirect based on role
                setTimeout(() => {
                    if (response.user.role === 'admin') {
                        navigate('/admin/dashboard')
                    } else if (response.user.role === 'doctor') {
                        navigate('/doctor/dashboard')
                    } else if (response.user.role === 'patient') {
                        navigate('/patient/dashboard')
                    }
                }, 1500)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col lg:flex-row min-h-screen'>

            <AuthHeader />


            {/* ================================ LOGIN FORM =========================== */}
            <div className='w-full lg:w-1/2 flex items-center justify-center px-4 py-8 sm:py-0'>
                <div className='w-full max-w-md'>
                    <div className='lg:hidden mb-6 text-center'>
                        <img src={assets.homepage_logo} alt="logo" className='w-10 h-10 mx-auto mb-2 rounded-full' />
                        <h1 className='text-xl font-semibold'>Medi<span className='text-blue-800'>Queue</span></h1>
                        <p className='text-xs italic'>Your health, our priority</p>
                    </div>
                    <div className='p-6 sm:p-8 bg-white rounded-lg shadow-lg'>
                        <h2 className='text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-center'>Welcome Back!</h2>
                        <p className='text-xs sm:text-sm italic mb-4 sm:mb-6 text-center'>Login to Continue to your account</p>

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
                            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                                <button type="button" className='text-xs sm:text-sm text-blue-600 hover:underline'>Forgot Password?</button>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className='w-full sm:w-auto bg-blue-600 text-white py-2 sm:py-3 px-4 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>
                        </form>

                        <p className='text-center text-xs sm:text-sm mt-4 text-gray-600'>
                            Don't have an account? <button onClick={() => navigate('/register')} className='text-blue-600 hover:underline'>Register here</button>
                        </p>
                    </div>

                    {/* ===================== Test Credentials =========================== */}

                    <div className='mt-4 sm:mt-6 p-6 sm:p-8 bg-white rounded-lg shadow-lg text-center'>
                        <p className='text-xs sm:text-sm font-semibold mb-3'>📝 Test Credentials</p>
                        <div className='text-xs space-y-2 mb-4'>
                            <p><strong>Admin:</strong> admin@example.com / admin123</p>
                            <p><strong>Patient:</strong> patient@example.com / password</p>
                        </div>
                    </div>


                </div>
            </div>
        </div>

    )
}

export default Login