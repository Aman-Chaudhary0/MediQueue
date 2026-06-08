import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Star, CalendarClock, X } from 'lucide-react'
import authService from '../../api/authService'

const AppointmentDetails = () => {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Cancel
  const [cancelReason, setCancelReason] = useState('')
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const [cancelSuccess, setCancelSuccess] = useState('')

  // Reschedule
  const [showReschedule, setShowReschedule] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [rescheduleError, setRescheduleError] = useState('')
  const [rescheduleSuccess, setRescheduleSuccess] = useState('')

  // Review
  const [showReview, setShowReview] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState('')

  const fetchDetails = async () => {
    if (!appointmentId) { setError('Appointment ID is missing'); setLoading(false); return }
    try {
      setLoading(true); setError('')
      const response = await authService.getAppointmentDetails(appointmentId)
      setAppointment(response?.appointment || null)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load appointment details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDetails() }, [appointmentId])

  const formattedAppointment = useMemo(() => {
    if (!appointment) return null
    const appointmentDate = new Date(appointment.appointmentDate)
    return {
      patientName: appointment?.patient?.user?.name || 'Patient',
      doctorName: appointment?.doctor?.user?.name || 'Doctor',
      doctorId: appointment?.doctor?._id,
      specialization: appointment?.doctor?.specialization || appointment?.doctor?.department || 'Not added',
      hospital: appointment?.doctor?.hospital || 'Not added',
      date: appointmentDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: appointment?.startTime || '--',
      endTime: appointment?.endTime || '--',
      token: appointment?.tokenNumber || '--',
      status: appointment?.status || 'pending',
      fees: appointment?.doctor?.consultationFee ?? 0,
      refundStatus: appointment?.refundStatus || null,
      cancellationReason: appointment?.cancellationReason || '',
      rescheduledFrom: appointment?.rescheduledFrom || null,
      noShow: appointment?.noShow || false,
      rating: appointment?.rating ?? null,
      review: appointment?.review || '',
    }
  }, [appointment])

  const statusStyle = useMemo(() => {
    const s = formattedAppointment?.status
    if (s === 'completed') return 'bg-green-100 text-green-600'
    if (s === 'pending' || s === 'confirmed') return 'bg-yellow-100 text-yellow-600'
    if (s === 'no-show') return 'bg-orange-100 text-orange-600'
    return 'bg-red-100 text-red-600'
  }, [formattedAppointment])

  // ── Cancel ──────────────────────────────────────────────────────────────
  const handleCancelConfirm = async () => {
    try {
      setIsCancelling(true); setCancelError('')
      const response = await authService.cancelAppointment(appointmentId, cancelReason)
      setAppointment(response?.appointment || appointment)
      setCancelSuccess(
        response?.refundMessage || response?.message || 'Appointment cancelled successfully'
      )
      setIsConfirmingCancel(false)
      setCancelReason('')
    } catch (err) {
      setCancelError(err?.response?.data?.message || 'Failed to cancel appointment')
    } finally {
      setIsCancelling(false)
    }
  }

  // ── Reschedule ───────────────────────────────────────────────────────────
  const fetchSlots = async (date) => {
    if (!date || !formattedAppointment?.doctorId) return
    try {
      setSlotsLoading(true); setRescheduleError(''); setAvailableSlots([]); setSelectedSlot(null)
      const res = await authService.getAvailableSlots(formattedAppointment.doctorId, date)
      setAvailableSlots(Array.isArray(res?.availableSlots) ? res.availableSlots : [])
    } catch (err) {
      setRescheduleError(err?.response?.data?.message || 'Failed to fetch slots')
    } finally {
      setSlotsLoading(false)
    }
  }

  const handleRescheduleDateChange = (e) => {
    setRescheduleDate(e.target.value)
    fetchSlots(e.target.value)
  }

  const handleRescheduleSubmit = async () => {
    if (!selectedSlot) { setRescheduleError('Please select a time slot'); return }
    try {
      setIsRescheduling(true); setRescheduleError('')
      const response = await authService.rescheduleAppointment(
        appointmentId, rescheduleDate, selectedSlot.startTime, selectedSlot.endTime
      )
      setRescheduleSuccess('Appointment rescheduled successfully')
      setShowReschedule(false)
      // Navigate to new appointment
      if (response?.appointment?._id) {
        setTimeout(() => navigate(`/patient/appointment/${response.appointment._id}`), 1200)
      } else {
        fetchDetails()
      }
    } catch (err) {
      setRescheduleError(err?.response?.data?.message || 'Failed to reschedule appointment')
    } finally {
      setIsRescheduling(false)
    }
  }

  // ── Review ───────────────────────────────────────────────────────────────
  const handleReviewSubmit = async () => {
    if (!reviewRating) { setReviewError('Please select a rating'); return }
    try {
      setIsSubmittingReview(true); setReviewError('')
      await authService.submitReview(appointmentId, reviewRating, reviewText)
      setReviewSuccess('Review submitted successfully!')
      setShowReview(false)
      fetchDetails()
    } catch (err) {
      setReviewError(err?.response?.data?.message || 'Failed to submit review')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const todayStr = new Date().toISOString().split('T')[0]

  // ── Render ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 text-center text-sm text-gray-600 shadow-md">Loading appointment details...</div>
    </div>
  )

  if (error) return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-red-50 p-6 text-center text-sm text-red-600 shadow-md">{error}</div>
    </div>
  )

  if (!formattedAppointment) return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 text-center text-sm text-gray-600 shadow-md">Appointment not found.</div>
    </div>
  )

  const canCancel = ['pending', 'confirmed'].includes(formattedAppointment.status)
  const canReschedule = ['pending', 'confirmed'].includes(formattedAppointment.status)
  const canReview = formattedAppointment.status === 'completed' && formattedAppointment.rating === null

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Appointment Details</h1>
        <p className="text-gray-500 text-sm">View complete information about your appointment</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-semibold">{formattedAppointment.doctorName}</h2>
            <p className="text-gray-500 text-sm">{formattedAppointment.specialization}</p>
          </div>
          <span className={`px-4 py-1 rounded-full text-sm font-medium capitalize ${statusStyle}`}>
            {formattedAppointment.status.replace('-', ' ')}
          </span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><p className="text-gray-500 text-sm">Patient Name</p><p className="font-medium">{formattedAppointment.patientName}</p></div>
          <div><p className="text-gray-500 text-sm">Token Number</p><p className="font-medium">{formattedAppointment.token}</p></div>
          <div><p className="text-gray-500 text-sm">Date</p><p className="font-medium">{formattedAppointment.date}</p></div>
          <div><p className="text-gray-500 text-sm">Time</p><p className="font-medium">{formattedAppointment.time} – {formattedAppointment.endTime}</p></div>
          <div><p className="text-gray-500 text-sm">Hospital</p><p className="font-medium">{formattedAppointment.hospital}</p></div>
          <div><p className="text-gray-500 text-sm">Consultation Fee</p><p className="font-medium">Rs. {formattedAppointment.fees}</p></div>

          {formattedAppointment.rescheduledFrom && (
            <div className="md:col-span-2">
              <p className="text-gray-500 text-sm">Note</p>
              <p className="text-sm text-blue-600 font-medium">This appointment was rescheduled</p>
            </div>
          )}

          {formattedAppointment.status === 'cancelled' && formattedAppointment.cancellationReason && (
            <div className="md:col-span-2">
              <p className="text-gray-500 text-sm">Cancellation Reason</p>
              <p className="font-medium text-red-600">{formattedAppointment.cancellationReason}</p>
            </div>
          )}

          {formattedAppointment.refundStatus && formattedAppointment.refundStatus !== 'not_applicable' && (
            <div className="md:col-span-2 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
              <p className="text-sm font-medium text-blue-700">
                Refund Status: <span className="capitalize">{formattedAppointment.refundStatus}</span>
              </p>
              {formattedAppointment.refundStatus === 'pending' && (
                <p className="text-xs text-blue-600 mt-0.5">Refund will be processed in 5–7 business days.</p>
              )}
            </div>
          )}

          {/* Existing review display */}
          {formattedAppointment.rating !== null && (
            <div className="md:col-span-2">
              <p className="text-gray-500 text-sm mb-1">Your Review</p>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} className={s <= formattedAppointment.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              {formattedAppointment.review && <p className="text-sm text-gray-700">{formattedAppointment.review}</p>}
            </div>
          )}
        </div>

        {/* Feedback messages */}
        {cancelSuccess && <div className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{cancelSuccess}</div>}
        {cancelError && <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{cancelError}</div>}
        {rescheduleSuccess && <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{rescheduleSuccess}</div>}
        {reviewSuccess && <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{reviewSuccess}</div>}

        {/* Cancel confirm inline */}
        {isConfirmingCancel && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 space-y-3">
            <p className="text-sm font-medium text-red-700">Are you sure you want to cancel this appointment?</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)"
              rows={2}
              className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelConfirm}
                disabled={isCancelling}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-60"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
              <button
                type="button"
                onClick={() => { setIsConfirmingCancel(false); setCancelReason('') }}
                disabled={isCancelling}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 disabled:opacity-60"
              >
                Keep Appointment
              </button>
            </div>
          </div>
        )}

        {/* Review form inline */}
        {showReview && (
          <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">Rate your experience</p>
              <button type="button" onClick={() => setShowReview(false)}><X size={16} className="text-gray-500" /></button>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setReviewRating(s)}>
                  <Star size={28} className={s <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                </button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write a review (optional)"
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            {reviewError && <p className="text-sm text-red-600">{reviewError}</p>}
            <button
              type="button"
              onClick={handleReviewSubmit}
              disabled={isSubmittingReview}
              className="px-4 py-2 rounded-lg bg-yellow-500 text-white text-sm hover:bg-yellow-600 disabled:opacity-60"
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap justify-end gap-3 mt-8">
          {canReview && !showReview && (
            <button
              type="button"
              onClick={() => setShowReview(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-white text-sm hover:bg-yellow-600"
            >
              <Star size={16} /> Rate & Review
            </button>
          )}

          {canReschedule && !isConfirmingCancel && (
            <button
              type="button"
              onClick={() => { setShowReschedule(true); setRescheduleError('') }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              <CalendarClock size={16} /> Reschedule
            </button>
          )}

          {canCancel && !isConfirmingCancel && (
            <button
              type="button"
              onClick={() => { setIsConfirmingCancel(true); setCancelError('') }}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
            >
              Cancel Appointment
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/patient/appointment-history')}
            className="px-4 py-2 rounded-lg border text-gray-600 text-sm hover:bg-gray-100"
          >
            Back to History
          </button>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Reschedule Appointment</h3>
              <button type="button" onClick={() => setShowReschedule(false)}><X size={20} className="text-gray-500" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select New Date</label>
                <input
                  type="date"
                  min={todayStr}
                  value={rescheduleDate}
                  onChange={handleRescheduleDateChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {rescheduleDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
                  {slotsLoading ? (
                    <p className="text-sm text-gray-500">Loading slots...</p>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-sm text-gray-500">No available slots for this date.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.startTime}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                            selectedSlot?.startTime === slot.startTime
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 text-gray-700 hover:border-blue-300'
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {rescheduleError && <p className="text-sm text-red-600">{rescheduleError}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRescheduleSubmit}
                  disabled={isRescheduling || !selectedSlot}
                  className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {isRescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReschedule(false)}
                  className="flex-1 rounded-lg border border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentDetails
