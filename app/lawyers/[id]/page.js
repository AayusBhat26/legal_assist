'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, MapPin, Clock, IndianRupee, Mail, Phone, Award, Languages } from 'lucide-react'

export default function LawyerProfile({ params }) {
  const router = useRouter()
  const [lawyer, setLawyer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showContactModal, setShowContactModal] = useState(false)

  useEffect(() => {
    fetchLawyerProfile()
  }, [params.id])

  const fetchLawyerProfile = async () => {
    try {
      const response = await fetch(`/api/lawyers/${params.id}`)
      const data = await response.json()
      setLawyer(data.lawyer)
    } catch (error) {
      console.error('Error fetching lawyer profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-gray-300'}
      />
    ))
  }

  const handleBookConsultation = () => {
    router.push(`/consultation/${params.id}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    )
  }

  if (!lawyer) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Lawyer Not Found</h1>
        <p className="text-gray-600 mb-8">The lawyer profile you&apos;re looking for doesn&apos;t exist.</p>
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{lawyer.name}</h1>
            <p className="text-xl text-blue-600 font-semibold mb-4">{lawyer.specialization}</p>
            
            <div className="flex items-center mb-4">
              {renderStars(lawyer.rating)}
              <span className="ml-2 text-lg font-medium text-gray-600">
                {lawyer.rating} out of 5
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPin size={20} className="mr-3" />
                <span>{lawyer.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={20} className="mr-3" />
                <span>{lawyer.experience} experience</span>
              </div>
              <div className="flex items-center text-gray-600">
                <IndianRupee size={20} className="mr-3" />
                <span>Consultation: {lawyer.consultationFee}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Languages size={20} className="mr-3" />
                <span>{lawyer.languages?.join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3 md:ml-8">
            <button
              onClick={handleBookConsultation}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Book Consultation
            </button>
            <button
              onClick={() => setShowContactModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Lawyer
            </button>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
        <p className="text-gray-700 leading-relaxed">{lawyer.bio}</p>
      </div>

      {/* Education & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Education</h3>
          <p className="text-gray-700">{lawyer.education}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Courts of Practice</h3>
          <ul className="text-gray-700 space-y-2">
            {lawyer.courtsPracticing?.map((court, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                {court}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Achievements */}
      {lawyer.achievements && lawyer.achievements.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Award className="mr-3 text-yellow-500" />
            Achievements & Recognition
          </h3>
          <ul className="space-y-3">
            {lawyer.achievements.map((achievement, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="mr-3 text-blue-600" size={20} />
                <span className="text-gray-700">{lawyer.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-3 text-green-600" size={20} />
                <span className="text-gray-700">{lawyer.phone}</span>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p>Contact the lawyer directly or book a consultation for detailed discussion about your case.</p>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <button
                onClick={handleBookConsultation}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
