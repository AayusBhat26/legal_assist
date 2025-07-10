'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../../lib/firebaseClient'
import { Calendar, Clock, IndianRupee, CreditCard } from 'lucide-react'

export default function ConsultationBooking({ params }) {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const [lawyer, setLawyer] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [consultationType, setConsultationType] = useState('video')
  const [caseDescription, setCaseDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentStep, setPaymentStep] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    fetchLawyerDetails()
  }, [params.id, user, loading])

  const fetchLawyerDetails = async () => {
    try {
      const response = await fetch(`/api/lawyers/${params.id}`)
      const data = await response.json()
      setLawyer(data.lawyer)
    } catch (error) {
      console.error('Error fetching lawyer:', error)
    }
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00`)
      if (hour < 17) slots.push(`${hour}:30`)
    }
    return slots
  }

  const generateDateOptions = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      if (date.getDay() !== 0) { // Skip Sundays
        dates.push(date.toISOString().split('T')[0])
      }
    }
    return dates
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime || !caseDescription.trim()) {
      alert('Please fill in all required fields')
      return
    }

    setPaymentStep(true)
  }

  const handlePayment = async () => {
    setIsSubmitting(true)
    
    try {
      // In production, integrate with Razorpay or similar payment gateway
      const bookingData = {
        lawyerId: params.id,
        userId: user.uid,
        date: selectedDate,
        time: selectedTime,
        type: consultationType,
        caseDescription,
        amount: lawyer.consultationFee,
        status: 'confirmed'
      }

      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/consultations/${result.consultationId}`)
      } else {
        throw new Error('Booking failed')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to book consultation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!lawyer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading lawyer details...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Book Consultation with {lawyer.name}
        </h1>

        {!paymentStep ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Lawyer Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{lawyer.name}</h3>
              <p className="text-blue-600">{lawyer.specialization}</p>
              <p className="text-gray-600 flex items-center mt-2">
                <IndianRupee size={16} className="mr-1" />
                Consultation Fee: {lawyer.consultationFee}
              </p>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline mr-2" size={16} />
                Select Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a date</option>
                {generateDateOptions().map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline mr-2" size={16} />
                Select Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a time</option>
                {generateTimeSlots().map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Consultation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="video"
                    checked={consultationType === 'video'}
                    onChange={(e) => setConsultationType(e.target.value)}
                    className="mr-2"
                  />
                  Video Call (Recommended)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="phone"
                    checked={consultationType === 'phone'}
                    onChange={(e) => setConsultationType(e.target.value)}
                    className="mr-2"
                  />
                  Phone Call
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="in-person"
                    checked={consultationType === 'in-person'}
                    onChange={(e) => setConsultationType(e.target.value)}
                    className="mr-2"
                  />
                  In-Person Meeting
                </label>
              </div>
            </div>

            {/* Case Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brief Description of Your Case *
              </label>
              <textarea
                value={caseDescription}
                onChange={(e) => setCaseDescription(e.target.value)}
                placeholder="Please provide a brief description of your legal issue. This will help the lawyer prepare for your consultation."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={5}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Proceed to Payment
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Confirm Your Booking</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Lawyer:</strong> {lawyer.name}</p>
              <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Type:</strong> {consultationType.charAt(0).toUpperCase() + consultationType.slice(1)}</p>
              <p><strong>Fee:</strong> {lawyer.consultationFee}</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-4 flex items-center">
                <CreditCard className="mr-2" size={20} />
                Payment Information
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                In production, this would integrate with Razorpay or another payment gateway.
                For demo purposes, clicking "Complete Payment" will confirm your booking.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setPaymentStep(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Back to Edit
              </button>
              <button
                onClick={handlePayment}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Complete Payment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
