import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../../api/authService'
import { useAuth } from '../../context/AuthContext'
import { rules, validateField, validateAll, hasErrors, fieldClass } from '../../utils/validation'

const ChangePassword = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [fieldErrors, setFieldErrors] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [touched, setTouched] = useState({ currentPassword: false, newPassword: false, confirmPassword: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const getSchema = () => ({
    currentPassword: [rules.required('Current password')],
    newPassword: [rules.required('New password'), rules.strongPassword()],
    confirmPassword: [rules.required('Confirm password'), rules.passwordMatch(() => formData.newPassword)],
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    const updated = { ...formData, [id]: value }
    setFormData(updated)
    setError('')
    if (touched[id]) {
      const schema = getSchema()
      setFieldErrors(prev => ({ ...prev, [id]: validateField(value, schema[id]) }))
      if (id === 'newPassword' && touched.confirmPassword) {
        setFieldErrors(prev => ({
          ...prev,
          confirmPassword: validateField(updated.confirmPassword, [rules.passwordMatch(() => value)]),
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const schema = getSchema()
    const errors = validateAll(schema, formData)
    setFieldErrors(errors)
    setTouched({ currentPassword: true, newPassword: true, confirmPassword: true })
    if (hasErrors(errors)) return

    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await authService.changePassword(formData.currentPassword, formData.newPassword)
      setSuccess(response?.message || 'Password changed successfully.')
      setTimeout(() => { logout(); navigate('/login', { replace: true }) }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <button
          type="button" onClick={() => navigate(-1)}
          className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back
        </button>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-800">Change Password</h1>
          <p className="mt-2 text-sm text-gray-500">Update the password for {user?.email || 'your account'}.</p>

          {error && (
            <div className="mt-4 rounded-md border border-red-400 bg-red-100 p-3 text-sm text-red-700">{error}</div>
          )}
          {success && (
            <div className="mt-4 rounded-md border border-green-400 bg-green-100 p-3 text-sm text-green-700">{success}</div>
          )}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                id="currentPassword" type="password" placeholder="Enter current password"
                value={formData.currentPassword} onChange={handleChange} onBlur={handleBlur}
                className={`${fieldClass(fieldErrors.currentPassword)} mt-1 p-3 text-sm`}
              />
              {fieldErrors.currentPassword && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword" type="password" placeholder="Enter new password"
                value={formData.newPassword} onChange={handleChange} onBlur={handleBlur}
                className={`${fieldClass(fieldErrors.newPassword)} mt-1 p-3 text-sm`}
              />
              {fieldErrors.newPassword
                ? <p className="mt-1 text-xs text-red-500">{fieldErrors.newPassword}</p>
                : <p className="mt-1 text-xs text-gray-500">Use 8+ characters with uppercase, lowercase, number, and special character.</p>
              }
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword" type="password" placeholder="Confirm new password"
                value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                className={`${fieldClass(fieldErrors.confirmPassword)} mt-1 p-3 text-sm`}
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
