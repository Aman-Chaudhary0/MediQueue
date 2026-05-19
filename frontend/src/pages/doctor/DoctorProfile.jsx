import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut } from 'lucide-react'

const DoctorProfile = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const accessToken = user?.accessToken || localStorage.getItem('accessToken') || ''

  const authHeaders = useMemo(
    () => ({
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    }),
    [accessToken]
  )

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [doctorId, setDoctorId] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [mobileNo, setMobileNo] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [department, setDepartment] = useState('')
  const [experience, setExperience] = useState('')
  const [consultationFee, setConsultationFee] = useState('')
  const [hospital, setHospital] = useState('')
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/100')
  const [bio, setBio] = useState('')
  const [status, setStatus] = useState('active')

  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  useEffect(() => {
    if (authLoading) return
    if (!accessToken) {
      setLoading(false)
      setError('Please login again to load doctor profile.')
      return
    }

    const fetchMyDoctor = async () => {
      try {
        setLoading(true)
        setError('')
        setSaveError('')
        setSaveSuccess('')

        const res = await fetch('http://localhost:3000/api/doctor/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'Failed to load doctor profile')

        const doctor = data?.doctor

        setDoctorId(doctor?._id || '')
        setDoctorName(doctor?.user?.name || '')
        setMobileNo(doctor?.mobileNo || '')
        setSpecialization(doctor?.specialization || '')
        setDepartment(doctor?.department || '')
        setExperience(String(doctor?.experience ?? ''))
        setConsultationFee(String(doctor?.consultationFee ?? ''))
        setHospital(doctor?.hospital || '')
        setProfilePic(doctor?.profilePic || 'https://via.placeholder.com/100')
        setBio(doctor?.bio || '')
        setStatus(doctor?.status || 'active')
      } catch (e) {
        setError(e?.message || 'Failed to load doctor profile')
      } finally {
        setLoading(false)
      }
    }

    fetchMyDoctor()
  }, [accessToken, authHeaders, authLoading])

  useEffect(() => {
    return () => {
      if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl)
    }
  }, [uploadPreviewUrl])

  const onChooseFile = (e) => {
    const file = e.target.files?.[0]
    setSaveError('')
    setSaveSuccess('')

    if (!file) {
      setSelectedFile(null)
      setUploadPreviewUrl('')
      return
    }

    // optional guardrails
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      setSelectedFile(null)
      setUploadPreviewUrl('')
      setSaveError('Please select an image file (JPG/PNG).')
      return
    }

    // 2MB limit
    const maxBytes = 2 * 1024 * 1024
    if (file.size > maxBytes) {
      setSelectedFile(null)
      setUploadPreviewUrl('')
      setSaveError('Image should be up to 2MB.')
      return
    }

    if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl)

    setSelectedFile(file)
    setUploadPreviewUrl(URL.createObjectURL(file))

    // allow picking the exact same file again later
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSave = async () => {
    try {
      setSaving(true)
      setSaveError('')
      setSaveSuccess('')

      if (!doctorId) throw new Error('Doctor id not found. Please refresh and try again.')

      const formData = new FormData()
      formData.append('specialization', specialization?.trim())
      formData.append('department', department?.trim())
      formData.append('experience', experience === '' ? undefined : Number(experience))
      formData.append('mobileNo', mobileNo?.trim())
      formData.append('consultationFee', consultationFee === '' ? undefined : Number(consultationFee))
      formData.append('hospital', hospital?.trim())
      formData.append('bio', bio ?? '')
      formData.append('status', status)

      // Upload profile pic if a file is selected
      if (selectedFile) {
        formData.append('profilepic', selectedFile)
      }

      const res = await fetch('http://localhost:3000/api/doctor/me', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to update doctor profile')

      const updated = data?.doctor
      setSpecialization(updated?.specialization || specialization)
      setDepartment(updated?.department || department)
      setExperience(String(updated?.experience ?? experience))
      setMobileNo(updated?.mobileNo || mobileNo)
      setConsultationFee(String(updated?.consultationFee ?? consultationFee))
      setHospital(updated?.hospital || hospital)
      setBio(updated?.bio || bio)
      setStatus(updated?.status || status)
      setProfilePic(updated?.profilePic || profilePic)

      setSaveSuccess('Profile updated successfully.')
      setSelectedFile(null)
      setUploadPreviewUrl('')
    } catch (e) {
      setSaveError(e?.message || 'Failed to update doctor profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      navigate('/auth/login')
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      setIsLoggingOut(false)
    }
  }

// ==========================================================================================================================================================================

  return (
    <div className='bg-gray-50 min-h-screen p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-semibold text-gray-800'>Edit Doctor Profile</h1>
        <p className='text-gray-500 text-sm'>Update your personal information</p>

        {loading ? (
          <p className='text-sm text-gray-600 mt-2'>Loading...</p>
        ) : error ? (
          <p className='text-sm text-red-600 mt-2'>{error}</p>
        ) : (
          <p className='text-sm text-gray-600 mt-2'>
            Your ID: <span className='font-semibold'>{doctorId || '-'}</span>
          </p>
        )}

        {saveError ? <p className='text-sm text-red-600 mt-2'>{saveError}</p> : null}
        {saveSuccess ? <p className='text-sm text-green-700 mt-2'>{saveSuccess}</p> : null}
      </div>

      <div className='bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto'>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={onChooseFile}
        />

        {/* Profile Photo */}
        <div className='flex items-center gap-6 mb-6'>
          <button
            type='button'
            onClick={openFilePicker}
            className='relative'
            aria-label='Upload profile photo'
            title='Upload profile photo'
          >
            <img
              src={uploadPreviewUrl || profilePic || 'https://via.placeholder.com/100'}
              alt='doctor'
              className='w-24 h-24 rounded-full object-cover border border-gray-200'
            />
          </button>
          <div>
            <button
              type='button'
              onClick={openFilePicker}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            >
              Upload Photo
            </button>
            <p className='text-xs text-gray-500 mt-1'>JPG, PNG up to 2MB</p>
            {selectedFile ? (
              <p className='text-xs text-gray-600 mt-2'>Selected: {selectedFile.name}</p>
            ) : null}
          </div>
        </div>

        {/* Form Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          {/* Name (read-only, since updateDoctorProfile disallows updating user field) */}
          <div>
            <label className='text-sm text-gray-600'>Full Name</label>
            <input
              type='text'
              value={doctorName}
              disabled
              className='w-full mt-1 p-3 border rounded-lg bg-gray-50 text-gray-700 outline-none'
            />
          </div>

          <div>
            <label className='text-sm text-gray-600'>Mobile Number</label>
            <input
              type='text'
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              className='w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
            />
          </div>

          <div>
            <label className='text-sm text-gray-600'>Specialization</label>
            <input
              type='text'
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className='w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
            />
          </div>

          <div>
            <label className='text-sm text-gray-600'>Department</label>
            <input
              type='text'
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className='w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
            />
          </div>

          <div>
            <label className='text-sm text-gray-600'>Experience (Years)</label>
            <input
              type='number'
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className='w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
            />
          </div>

          <div>
            <label className='text-sm text-gray-600'>Consultation Fees</label>
            <input
              type='number'
              value={consultationFee}
              onChange={(e) => setConsultationFee(e.target.value)}
              className='w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
            />
          </div>

          <div className='md:col-span-2'>
            <label className='text-sm text-gray-600'>Hospital Name</label>
            <input
              type='text'
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className='w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
            />
          </div>

          <div className='md:col-span-2'>
            <label className='text-sm text-gray-600'>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className='w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y'
            />
          </div>

          <div className='flex items-center justify-between md:col-span-2 mt-2'>
            <span className='text-gray-700 font-medium'>Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className='px-5 py-2 rounded-full border border-gray-200 bg-white text-gray-700'
            >
              <option value='active'>active</option>
              <option value='inactive'>inactive</option>
              <option value='on-leave'>on-leave</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className='flex justify-end gap-4 mt-8'>
          <button
            className='px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100'
            type='button'
            disabled={saving}
            onClick={() => {
              setSaveError('')
              setSaveSuccess('')
              setSelectedFile(null)
              setUploadPreviewUrl('')
            }}
          >
            Cancel
          </button>

          <button
            className={`px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 ${
              saving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            type='button'
            onClick={onSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            className={`px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 ${
              isLoggingOut ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            type='button'
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut size={18} />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
