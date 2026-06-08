import React, { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthHeader from '../../components/common/AuthHeader'
import authService from '../../api/authService'
import { assets } from '../../assets/assets'
import { rules, validateField, validateAll, hasErrors, fieldClass } from '../../utils/validation'

const ForgotPasswordOtp = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialEmail = useMemo(() => searchParams.get('email') || '', [searchParams])

  const [email, setEmail] = useState(initialEmail)
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [fieldErrors, setFieldErrors] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' })
  const [touched, setTouched] = useState({ email: false, otp: false, newPassword: false, confirmPassword: false })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const getSchema = () => ({
    email: [rules.required('Email'), rules.email()],
    otp: [rules.required('OTP'), rules.otp()],
    newPassword: [rules.required('New password'), rules.strongPassword()],
    confirmPassword: [rules.required('Confirm password'), rules.passwordMatch(() => newPassword)],
  })

  const getValues = () => ({ email, otp, newPassword, confirmPassword })

  const handleChange = (field, value, setter) => {
    setter(value)
    setError('')
    if (touched[field]) {
      const schema = getSchema()
      setFieldErrors(prev => ({ ...prev, [field]: validateField(value, schema[field]) }))
      if (field === 'newPassword' && touched.confirmPassword) {
        setFieldErrors(prev => ({
          ...prev,
          confirmPassword: validateField(confirmPassword, [rules.passwordMatch(() => value)]),
        }))
      }
    }
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const schema = getSchema()
    const values = getValues()
    setFieldErrors(prev => ({ ...prev, [field]: validateField(values[field], schema[field]) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const schema = getSchema()
    const values = getValues()
    const errors = validateAll(schema, values)
    setFieldErrors(errors)
    setTouched({ email: true, otp: true, newPassword: true, confirmPassword: true })
    if (hasErrors(errors)) return

    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await authService.verifyForgotPasswordOtp(email, otp, newPassword)
      setSuccess(response?.message || 'Password reset successfully!')
      setTimeout(() => navigate('/login', { replace: true }), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AuthHeader />

      <div className="flex w-full items-center justify-center px-4 py-8 lg:w-1/2 sm:py-0">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center lg:hidden">
            <img src={assets.homepage_logo} alt="logo" className="mx-auto mb-2 h-10 w-10 rounded-full" />
            <h1 className="text-xl font-semibold">Medi<span className="text-blue-800">Queue</span></h1>
            <p className="text-xs italic">Your health, our priority</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg sm:p-8">
            <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">Reset Password</h2>
            <p className="mb-4 text-center text-xs italic sm:mb-6 sm:text-sm">
              Enter the OTP sent to your email to reset your password
            </p>

            {error && (
              <div className="mb-4 rounded-md border border-red-400 bg-red-100 p-3 text-sm text-red-700">{error}</div>
            )}
            {success && (
              <div className="mb-4 rounded-md border border-green-400 bg-green-100 p-3 text-sm text-green-700">{success}</div>
            )}

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 sm:text-sm">Email Address</label>
                <input
                  id="email" type="email" placeholder="your@email.com"
                  value={email}
                  onChange={(e) => handleChange('email', e.target.value, setEmail)}
                  onBlur={() => handleBlur('email')}
                  className={`${fieldClass(fieldErrors.email)} mt-1 p-2 text-sm sm:p-3 sm:text-base`}
                />
                {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="otp" className="block text-xs font-medium text-gray-700 sm:text-sm">OTP</label>
                <input
                  id="otp" type="text" placeholder="Enter OTP" inputMode="numeric"
                  value={otp}
                  onChange={(e) => handleChange('otp', e.target.value, setOtp)}
                  onBlur={() => handleBlur('otp')}
                  className={`${fieldClass(fieldErrors.otp)} mt-1 p-2 text-sm sm:p-3 sm:text-base`}
                />
                {fieldErrors.otp && <p className="mt-1 text-xs text-red-500">{fieldErrors.otp}</p>}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-xs font-medium text-gray-700 sm:text-sm">New Password</label>
                <input
                  id="newPassword" type="password" placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => handleChange('newPassword', e.target.value, setNewPassword)}
                  onBlur={() => handleBlur('newPassword')}
                  className={`${fieldClass(fieldErrors.newPassword)} mt-1 p-2 text-sm sm:p-3 sm:text-base`}
                />
                {fieldErrors.newPassword
                  ? <p className="mt-1 text-xs text-red-500">{fieldErrors.newPassword}</p>
                  : <p className="mt-1 text-xs text-gray-500">Use 8+ characters with uppercase, lowercase, number, and special character.</p>
                }
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 sm:text-sm">Confirm New Password</label>
                <input
                  id="confirmPassword" type="password" placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value, setConfirmPassword)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`${fieldClass(fieldErrors.confirmPassword)} mt-1 p-2 text-sm sm:p-3 sm:text-base`}
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:py-3 sm:text-base"
              >
                {loading ? 'Resetting...' : 'Verify OTP & Reset'}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-600 sm:text-sm">
              Remembered your password?{' '}
              <button type="button" onClick={() => navigate('/login')} className="text-blue-600 hover:underline">
                Back to login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordOtp
