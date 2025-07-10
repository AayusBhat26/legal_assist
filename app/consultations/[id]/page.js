'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Calendar, Clock, Video, Phone, MapPin, Download } from 'lucide-react'

export default function ConsultationConfirmation({ params }) {
  const router = useRouter()
  const [consultation, setConsultation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConsultationDetails()
  }, [params.id])

  const fetchConsultationDetails = async () => {
    try {
      const response = await fetch(`/api/consultations/${params.id}`)
      const data = await response.json()
      setConsultation(data.consultation)
    } catch (error) {
      console.error('Error fetching consultation:', error)
    } finally {
      setLoading(false)
    }
  }

  const getConsultationIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="text-slate-700" size={24} />
      case 'phone':
        return <Phone className="text-emerald-600" size={24} />
      case 'in-person':
        return <MapPin className="text-amber-600" size={24} />
      default:
        return <Video className="text-slate-700" size={24} />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    )
  }

  if (!consultation) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Consultation Not Found</h1>
        <p className="text-gray-600 mb-8">The consultation you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push('/lawyers')}
          className="bg-slate-700 text-white px-6 py-2 rounded-md hover:bg-slate-800 transition-colors"
        >
          Back to Lawyers
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <CheckCircle className="mx-auto mb-4 text-green-600" size={64} />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Consultation Confirmed!
        </h1>
        <p className="text-gray-600">
          Your consultation has been successfully booked and payment confirmed.
        </p>
      </div>

      {/* Consultation Details */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Consultation Details</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-600">Consultation ID:</span>
            <span className="font-medium">{consultation.id}</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-600">Lawyer:</span>
            <span className="font-medium">{consultation.lawyerName || 'Adv. Legal Expert'}</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-600 flex items-center">
              <Calendar className="mr-2" size={16} />
              Date:
            </span>
            <span className="font-medium">
              {new Date(consultation.date).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-600 flex items-center">
              <Clock className="mr-2" size={16} />
              Time:
            </span>
            <span className="font-medium">{consultation.time}</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium flex items-center">
              {getConsultationIcon(consultation.type)}
              <span className="ml-2 capitalize">{consultation.type} Consultation</span>
            </span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-gray-600">Status:</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {consultation.status}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600">Payment:</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {consultation.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Meeting Information */}
      {consultation.type === 'video' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <Video className="mr-2" size={20} />
            Video Meeting Information
          </h3>
          <p className="text-blue-800 mb-4">
            A video meeting link will be sent to your email 15 minutes before the consultation.
          </p>
          <div className="bg-white p-3 rounded border">
            <p className="text-sm text-gray-600 mb-1">Meeting Link:</p>
            <p className="font-mono text-sm text-blue-600">{consultation.meetingLink}</p>
          </div>
        </div>
      )}

      {consultation.type === 'phone' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
            <Phone className="mr-2" size={20} />
            Phone Consultation Information
          </h3>
          <p className="text-green-800">
            The lawyer will call you at your registered phone number at the scheduled time.
            Please ensure your phone is available and accessible.
          </p>
        </div>
      )}

      {consultation.type === 'in-person' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
            <MapPin className="mr-2" size={20} />
            In-Person Meeting Information
          </h3>
          <p className="text-purple-800">
            Office address and directions will be shared with you via email.
            Please arrive 10 minutes early for your appointment.
          </p>
        </div>
      )}

      {/* Case Description */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-3">Case Description</h3>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-700">{consultation.caseDescription}</p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-yellow-900 mb-3">What's Next?</h3>
        <ul className="text-yellow-800 space-y-2">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            You'll receive a confirmation email with all details
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Prepare any documents or questions for your consultation
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            The lawyer will contact you at the scheduled time
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            You can reschedule or cancel up to 2 hours before the meeting
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => window.print()}
          className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors font-medium flex items-center justify-center"
        >
          <Download className="mr-2" size={20} />
          Download Receipt
        </button>
        <button
          onClick={() => router.push('/chat')}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Continue Chat
        </button>
        <button
          onClick={() => router.push('/lawyers')}
          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Book Another Lawyer
        </button>
      </div>

      {/* Support */}
      <div className="text-center mt-8 text-sm text-gray-600">
        <p>Need help? Contact our support team at support@legalassistant.com</p>
      </div>
    </div>
  )
}
