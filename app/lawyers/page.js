'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, MapPin, Clock, IndianRupee, ChevronLeft, ChevronRight } from 'lucide-react'

export default function LawyersPage() {
  const router = useRouter()
  const [lawyers, setLawyers] = useState([])
  const [filters, setFilters] = useState({
    specialization: '',
    location: '',
    minRating: 0
  })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12) // Show 12 lawyers per page

  useEffect(() => {
    fetchLawyers()
  }, [])

  const fetchLawyers = async () => {
    try {
      const response = await fetch('/api/lawyers')
      const data = await response.json()
      setLawyers(data.lawyers || [])
    } catch (error) {
      console.error('Error fetching lawyers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLawyers = lawyers.filter(lawyer => {
    return (
      (!filters.specialization || lawyer.specialization.toLowerCase().includes(filters.specialization.toLowerCase())) &&
      (!filters.location || lawyer.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (lawyer.rating >= filters.minRating)
    )
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredLawyers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLawyers = filteredLawyers.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const specializations = [...new Set(lawyers.map(lawyer => lawyer.specialization))]
  const locations = [...new Set(lawyers.map(lawyer => lawyer.location))]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-gray-300'}
      />
    ))
  }

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="p-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
          </>
        )}

        {pages.map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => goToPage(pageNumber)}
            className={`px-3 py-2 rounded-md border ${
              currentPage === pageNumber
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {pageNumber}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
            <button
              onClick={() => goToPage(totalPages)}
              className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Legal Experts</h1>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Filter Lawyers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <select
              value={filters.specialization}
              onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <select
              value={filters.minRating}
              onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Any Rating</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-blue-700">
                <span className="font-semibold">{filteredLawyers.length}</span> lawyers found
              </div>
              <div className="text-sm text-blue-600">
                <span className="font-semibold">{specializations.length}</span> specializations
              </div>
              <div className="text-sm text-blue-600">
                <span className="font-semibold">{locations.length}</span> locations
              </div>
            </div>
            {(filters.specialization || filters.location || filters.minRating > 0) && (
              <button
                onClick={() => setFilters({ specialization: '', location: '', minRating: 0 })}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lawyers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentLawyers.map(lawyer => (
          <div key={lawyer.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{lawyer.name}</h3>
                  <p className="text-blue-600 font-medium">{lawyer.specialization}</p>
                </div>
                <div className="flex items-center">
                  {renderStars(lawyer.rating)}
                  <span className="ml-1 text-sm text-gray-600">({lawyer.rating})</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  <span className="text-sm">{lawyer.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock size={16} className="mr-2" />
                  <span className="text-sm">{lawyer.experience} experience</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <IndianRupee size={16} className="mr-2" />
                  <span className="text-sm">Consultation: {lawyer.consultationFee}</span>
                </div>
              </div>

              {lawyer.bio && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{lawyer.bio}</p>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => router.push(`/lawyers/${lawyer.id}`)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Profile
                </button>
                <button
                  onClick={() => router.push(`/consultation/${lawyer.id}`)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLawyers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No lawyers found matching your criteria.</p>
          <button
            onClick={() => setFilters({ specialization: '', location: '', minRating: 0 })}
            className="mt-4 text-blue-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {filteredLawyers.length > 0 && (
        <>
          {/* Results Summary */}
          <div className="flex justify-between items-center mt-8 px-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredLawyers.length)} of {filteredLawyers.length} lawyers
            </div>
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {/* Pagination Controls */}
          {renderPagination()}
        </>
      )}
    </div>
  )
}
