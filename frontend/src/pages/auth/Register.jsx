import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import AuthHeader from '../../components/common/AuthHeader'
import authService from '../../api/authService'
import { useAuth } from '../../context/AuthContext'
import { rules, validateField, validateAll, hasErrors, fieldClass } from '../../utils/validation'

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

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm_password: '' })
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', password: '', confirm_password: '' })
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm_password: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [otpOpen, setOtpOpen] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpSuccess, setOtpSuccess] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)

  const getSchema = () => ({
    name: [rules.required('Name'), rules.minLength(2, 'Name')],
    email: [rules.required('Email'), rules.email()],
    password: [rules.required('Password'), rules.strongPassword()],
    confirm_password: [rules.required('Confirm password'), rules.passwordMatch(() => formData.password)],
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    const updated = { ...formData, [id]: value }
    setFormData(updated)
    setError('')
    if (id === 'email' || id === 'name' || id === 'password' || id === 'confirm_password') {
      setEmailVerified(false)
    }
    if (touched[id]) {
      const schema = getSchema()
      setFieldErrors(prev => ({ ...prev, [id]: validateField(value, schema[id]) }))
      // re-validate confirm when password changes
      if (id === 'password' && touched.confirm_password) {
        setFieldErrors(prev => ({
          ...prev,
          confirm_password: validateField(updated.confirm_password, [rules.passwordMatch(() => value)]),
        }))
      }
    }
  }

  const handleBlur = (e) => {
    const { id, value } = e.target
    setTouched(prev => ({ ...prev, [id]: true }))
    const schema = getSchema()
    setFieldErrors(prev => ({ ...prev, [id]: validateField(value, schema[id]) }))
  }

  const handleSendOtp = async (e) => {
    e?.preventDefault?.()
    const schema = getSchema()
    const errors = validateAll(schema, formData)
    setFieldErrors(errors)
    setTouched({ name: true, email: true, password: true, confirm_password: true })
    if (hasErrors(errors)) return

    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await authService.registerPatient(formData.name, formData.email, formData.password)
      if (response.success) {
        setSuccess('OTP sent. Enter the OTP below to finish registration.')
        setPendingEmail(formData.email)
        setOtpValue('')
        setOtpError('')
        setOtpSuccess('')
        setOtpOpen(true)
      } else {
        setError(response.message || 'Could not send OTP. Please try again.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otpLoading) return
    setOtpError('')
    if (!otpValue.trim() || !/^\d{4,8}$/.test(otpValue.trim())) {
      setOtpError('Enter a valid 4–8 digit OTP')
      return
    }
    setOtpLoading(true)
    try {
      const response = await authService.verifyOtp(pendingEmail, otpValue.trim())
      if (response.success) {
        login(response.user, response.accessToken)
        setEmailVerified(true)
        setOtpSuccess('OTP verified! Redirecting...')
        setTimeout(() => { window.location.href = '/patient/dashboard' }, 600)
      } else {
        setOtpError(response.message || 'Invalid OTP.')
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'OTP verification failed.')
    } finally {
      setOtpLoading(false)
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-center">Create Account</h2>
    

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">{error}</div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">{success}</div>
            )}

            <form className="space-y-4 sm:space-y-5" onSubmit={(e) => e.preventDefault()} noValidate>
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text" id="name" placeholder="Enter your full name"
                  value={formData.name} onChange={handleChange} onBlur={handleBlur}
                  className={`${fieldClass(fieldErrors.name)} mt-1 p-2 sm:p-3 text-sm sm:text-base`}
                />
                {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">Email Address</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="email" id="email" placeholder="Enter your email"
                    value={formData.email} onChange={handleChange} onBlur={handleBlur}
                    className={`${fieldClass(fieldErrors.email)} flex-1 p-2 sm:p-3 text-sm sm:text-base`}
                  />
                  <button
                    type="button" onClick={handleSendOtp}
                    disabled={loading}
                    className="shrink-0 bg-blue-600 text-white px-3 sm:px-4 py-2 text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : emailVerified ? 'Verified ✓' : 'Verify'}
                  </button>
                </div>
                {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password" id="password" placeholder="Enter your password"
                  value={formData.password} onChange={handleChange} onBlur={handleBlur}
                  className={`${fieldClass(fieldErrors.password)} mt-1 p-2 sm:p-3 text-sm sm:text-base`}
                />
                {fieldErrors.password
                  ? <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
                  : <p className="mt-1 text-xs text-gray-500">Use 8+ characters with uppercase, lowercase, number, and special character.</p>
                }
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-xs sm:text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password" id="confirm_password" placeholder="Confirm your password"
                  value={formData.confirm_password} onChange={handleChange} onBlur={handleBlur}
                  className={`${fieldClass(fieldErrors.confirm_password)} mt-1 p-2 sm:p-3 text-sm sm:text-base`}
                />
                {fieldErrors.confirm_password && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.confirm_password}</p>
                )}
              </div>


              <button
                type="button"
                disabled={!emailVerified}
                onClick={() => emailVerified && navigate('/patient/dashboard', { replace: true })}
                className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {emailVerified ? 'Registered ✓' : 'Register (verify email first)'}
              </button>

              <p className="text-center text-xs sm:text-sm text-gray-600">
                Already have an account?{' '}
                <button type="button" onClick={() => navigate('/login')} className="text-blue-600 hover:underline">
                  Login here
                </button>
              </p>
            </form>
          </div>

          <div className="mt-4 sm:mt-6 p-6 sm:p-8 bg-white rounded-lg shadow-lg text-center">
            <p className="text-xs sm:text-sm font-semibold mb-3">Are you a Doctor?</p>
            <p className="text-xs sm:text-sm mb-3">Contact an administrator to create your account</p>
            <button
              type="button" onClick={() => navigate('/contact-us')}
              className="w-full bg-gray-600 text-white py-2 sm:py-3 px-4 text-sm sm:text-base rounded-md hover:bg-gray-700 transition-colors"
            >
              Contact Admin
            </button>
          </div>
        </div>
      </div>

      {otpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">Verify OTP</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Enter the OTP sent to <span className="font-semibold">{pendingEmail}</span>
                </p>
              </div>
              <button type="button" onClick={() => { if (!otpLoading) setOtpOpen(false) }} className="text-gray-500 hover:text-gray-800">✕</button>
            </div>

            <form className="mt-4 space-y-3" onSubmit={handleVerifyOtp} noValidate>
              {otpError && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">{otpError}</div>
              )}
              {otpSuccess && (
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">{otpSuccess}</div>
              )}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">OTP</label>
                <input
                  value={otpValue}
                  onChange={(e) => { setOtpValue(e.target.value); setOtpError('') }}
                  placeholder="Enter 6-digit OTP"
                  inputMode="numeric"
                  className={`${fieldClass(!!otpError)} mt-1 p-2 sm:p-3 text-sm sm:text-base`}
                />
              </div>
              <button
                type="submit" disabled={otpLoading}
                className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 text-sm sm:text-base rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {otpLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <p className="text-center text-xs text-gray-500">Didn't receive OTP? Click Verify again to resend.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
