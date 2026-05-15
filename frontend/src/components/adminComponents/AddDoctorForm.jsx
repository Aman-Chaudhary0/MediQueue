import React, { useState } from 'react'
import { X } from 'lucide-react'
import authService from '../../api/authService'

const AddDoctorForm = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
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
        setError('')
        setSuccess('')

        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            setError('All fields are required')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
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
                setSuccess('Doctor registered successfully!')
                setFormData({ name: '', email: '', password: '' })
                setTimeout(() => {
                    onClose()
                    if (onSuccess) onSuccess()
                }, 1500)
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to register doctor. Please try again.'
            setError(errorMessage)
        } finally {
            setLoading(false)
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

                    <form className='space-y-4' onSubmit={handleSubmit}>
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
                        </div>

                        <div className='flex gap-3 pt-4'>
                            <button
                                type="button"
                                onClick={onClose}
                                className='flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                            >
                                {loading ? 'Adding...' : 'Add Doctor'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddDoctorForm
