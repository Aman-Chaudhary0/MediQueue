import React, { useState } from 'react'
import { X } from 'lucide-react'
import authService from '../../api/authService'

const PASSWORD_HINT =
    'Use 8+ characters with uppercase, lowercase, number, and special character.'

const AddDoctorForm = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [pendingDoctorEmail, setPendingDoctorEmail] = useState('')
    const [otpOpen, setOtpOpen] = useState(false)
    const [otpValue, setOtpValue] = useState('')
    const [otpLoading, setOtpLoading] = useState(false)
    const [otpError, setOtpError] = useState('')
    const [otpSuccess, setOtpSuccess] = useState('')
    const [emailVerified, setEmailVerified] = useState(false)

    const resetState = () => {
        setFormData({ name: '', email: '', password: '' })
        setLoading(false)
        setError('')
        setSuccess('')
        setPendingDoctorEmail('')
        setOtpOpen(false)
        setOtpValue('')
        setOtpLoading(false)
        setOtpError('')
        setOtpSuccess('')
        setEmailVerified(false)
    }

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
        setError('')
        setSuccess('')
        if (id === 'name' || id === 'email' || id === 'password') {
            setEmailVerified(false)
        }
    }

    const handleSendOtp = async (e) => {
        e?.preventDefault?.()
        setError('')
        setSuccess('')
        setOtpError('')
        setOtpSuccess('')

        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            setError('All fields are required')
            return
        }

        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/
        if (!strongPasswordRegex.test(formData.password)) {
            setError(PASSWORD_HINT)
            return
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email')
            return
        }

        setLoading(true)

        try {
            const response = await authService.registerDoctor(
                formData.name,
                formData.email,
                formData.password
            )

            if (response.success) {
                setSuccess('OTP sent. Enter the OTP to complete doctor registration.')
                setPendingDoctorEmail(response?.pendingDoctor?.email || formData.email)
                setOtpValue('')
                setOtpOpen(true)
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to register doctor. Please try again.'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        setOtpError('')
        setOtpSuccess('')

        if (!otpValue || otpValue.trim().length < 4) {
            setOtpError('Enter the OTP sent to the doctor email.')
            return
        }

        setOtpLoading(true)
        try {
            const response = await authService.verifyDoctorRegistrationOtp(
                pendingDoctorEmail,
                otpValue.trim()
            )

            if (response.success) {
                setOtpSuccess('Doctor verified successfully.')
                setSuccess('Doctor added successfully.')
                setEmailVerified(true)
                setOtpOpen(false)
                setFormData({ name: '', email: '', password: '' })
                if (onSuccess) onSuccess()
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || 'OTP verification failed. Please try again.'
            setOtpError(errorMessage)
        } finally {
            setOtpLoading(false)
        }
    }

    if (!isOpen) return null


// ==========================================================================================================================================================================

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
                <div className='flex items-center justify-between p-6 border-b'>
                    <h2 className='text-2xl font-bold'>Add Doctor</h2>
                    <button
                        onClick={onClose}
                        className='text-gray-500 hover:text-gray-700'
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className='p-6'>
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

                    <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-1'>
                                Doctor Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Dr. John Smith"
                                value={formData.name}
                                onChange={handleChange}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600'
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1'>
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="doctor@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600'
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-1'>
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                                value={formData.password}
                                onChange={handleChange}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600'
                            />
                            <p className='mt-1 text-xs text-gray-500'>{PASSWORD_HINT}</p>
                        </div>

                        <div className='rounded-md border border-blue-100 bg-blue-50 p-3 text-xs text-blue-900'>
                            Doctor registration works like patient registration:
                            click Verify to send OTP, then enter OTP to create the doctor account.
                        </div>

                        <div className='flex gap-3 pt-4'>
                            <button
                                type="button"
                                onClick={() => {
                                    resetState()
                                    onClose()
                                }}
                                className='flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading}
                                className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                            >
                                {loading ? 'Sending OTP...' : emailVerified ? 'Verified' : 'Verify'}
                            </button>
                        </div>

                        <button
                            type='button'
                            disabled={!emailVerified}
                            onClick={() => {
                                resetState()
                                onClose()
                            }}
                            className='w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                        >
                            {emailVerified ? 'Doctor Added ✓' : 'Add Doctor (after OTP verification)'}
                        </button>
                    </form>
                </div>
            </div>

            {otpOpen && (
                <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4'>
                    <div className='w-full max-w-md rounded-lg bg-white p-5 shadow-lg'>
                        <div className='flex items-start justify-between gap-4'>
                            <div>
                                <h3 className='text-xl font-bold'>Verify Doctor OTP</h3>
                                <p className='mt-1 text-sm text-gray-600'>
                                    Enter the OTP sent to <span className='font-semibold'>{pendingDoctorEmail}</span>
                                </p>
                            </div>

                            <button
                                type='button'
                                onClick={() => {
                                    if (!otpLoading) setOtpOpen(false)
                                }}
                                className='text-gray-500 hover:text-gray-800'
                                aria-label='Close'
                            >
                                ×
                            </button>
                        </div>

                        <form className='mt-4 space-y-3' onSubmit={handleVerifyOtp}>
                            {otpError && (
                                <div className='rounded-md border border-red-400 bg-red-100 p-3 text-sm text-red-700'>
                                    {otpError}
                                </div>
                            )}

                            {otpSuccess && (
                                <div className='rounded-md border border-green-400 bg-green-100 p-3 text-sm text-green-700'>
                                    {otpSuccess}
                                </div>
                            )}

                            <div>
                                <label className='block text-sm font-medium text-gray-700'>
                                    OTP
                                </label>
                                <input
                                    value={otpValue}
                                    onChange={(e) => {
                                        setOtpValue(e.target.value)
                                        setOtpError('')
                                    }}
                                    placeholder='Enter 6-digit OTP'
                                    inputMode='numeric'
                                    className='mt-1 w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600'
                                    required
                                />
                            </div>

                            <button
                                type='submit'
                                disabled={otpLoading}
                                className='w-full rounded-md bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                            >
                                {otpLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddDoctorForm
