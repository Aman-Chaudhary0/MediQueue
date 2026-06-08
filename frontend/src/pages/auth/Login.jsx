import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import AuthHeader from '../../components/common/AuthHeader'
import authService from '../../api/authService'
import { useAuth } from '../../context/AuthContext'
import { rules, validateField, validateAll, hasErrors, fieldClass } from '../../utils/validation'

const SCHEMA = {
  email: [rules.required('Email'), rules.email()],
  password: [rules.required('Password')],
}

const Login = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, login } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return
    if (user?.role === 'admin') navigate('/admin/dashboard', { replace: true })
    else if (user?.role === 'doctor') navigate('/doctor/dashboard', { replace: true })
    else if (user?.role === 'patient') navigate('/patient/dashboard', { replace: true })
    else navigate('/', { replace: true })
  }, [isAuthenticated, user, navigate])

  if (isAuthenticated) return null

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({ email: false, password: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    setError('')
    if (touched[id]) {
      setFieldErrors(prev => ({ ...prev, [id]: validateField(value, SCHEMA[id]) }))
    }
  }

  const handleBlur = (e) => {
    const { id, value } = e.target
    setTouched(prev => ({ ...prev, [id]: true }))
    setFieldErrors(prev => ({ ...prev, [id]: validateField(value, SCHEMA[id]) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateAll(SCHEMA, formData)
    setFieldErrors(errors)
    setTouched({ email: true, password: true })
    if (hasErrors(errors)) return

    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await authService.login(formData.email, formData.password)
      if (response.success || response.message === 'Login successful') {
        setSuccess('Login successful! Redirecting...')
        login(response.user, response.accessToken, response.refreshToken)
        setTimeout(() => {
          if (response.user.role === 'admin') window.location.href = '/admin/dashboard'
          else if (response.user.role === 'doctor') window.location.href = '/doctor/dashboard'
          else window.location.href = '/patient/dashboard'
        }, 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <AuthHeader />

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 sm:py-0">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6 text-center">
            <img src={assets.homepage_logo} alt="logo" className="w-10 h-10 mx-auto mb-2 rounded-full" />
            <h1 className="text-xl font-semibold">Medi<span className="text-blue-800">Queue</span></h1>
            <p className="text-xs italic">Your health, our priority</p>
          </div>

          <div className="p-6 sm:p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-center">Welcome Back!</h2>
            <p className="text-xs sm:text-sm italic mb-4 sm:mb-6 text-center">Login to continue to your account</p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                {success}
              </div>
            )}

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${fieldClass(fieldErrors.email)} mt-1 p-2 sm:p-3 text-sm sm:text-base`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${fieldClass(fieldErrors.password)} mt-1 p-2 sm:p-3 text-sm sm:text-base`}
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs sm:text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-blue-600 text-white py-2 sm:py-3 px-6 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>

            <p className="text-center text-xs sm:text-sm mt-4 text-gray-600">
              Don't have an account?{' '}
              <button onClick={() => navigate('/register')} className="text-blue-600 hover:underline">
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
