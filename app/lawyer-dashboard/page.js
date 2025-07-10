'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '../../../lib/firebaseClient'
import { useAuthState } from 'react-firebase-hooks/auth'
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Video, 
  FileText,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Settings,
  Bell,
  Filter,
  Search,
  Download
} from 'lucide-react'

export default function LawyerDashboard() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const [cases, setCases] = useState([])
  const [stats, setStats] = useState({
    totalCases: 0,
    pendingCases: 0,
    completedCases: 0,
    monthlyEarnings: 0
  })
  const [selectedTab, setSelectedTab] = useState('pending')
  const [selectedCase, setSelectedCase] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    fetchDashboardData()
  }, [user, loading])

  const fetchDashboardData = async () => {
    try {
      // Mock data - in production, this would fetch from database
      const mockCases = [
        {
          id: 'CASE001',
          clientName: 'Rajesh Kumar',
          clientEmail: 'rajesh.kumar@example.com',
          clientPhone: '+91-9876543210',
          caseType: 'Property Dispute',
          description: 'Landlord-tenant dispute regarding property lease agreement and rent payment issues.',
          status: 'pending',
          urgency: 'high',
          consultationType: 'video',
          scheduledDate: '2024-07-15',
          scheduledTime: '10:00',
          consultationFee: '₹2,000',
          documents: ['lease_agreement.pdf', 'rent_receipts.pdf'],
          createdAt: '2024-07-10T09:30:00Z',
          location: 'Delhi'
        },
        {
          id: 'CASE002',
          clientName: 'Priya Sharma',
          clientEmail: 'priya.sharma@example.com',
          clientPhone: '+91-9876543211',
          caseType: 'Family Law',
          description: 'Divorce proceedings and child custody arrangements.',
          status: 'active',
          urgency: 'medium',
          consultationType: 'in-person',
          scheduledDate: '2024-07-16',
          scheduledTime: '14:00',
          consultationFee: '₹2,500',
          documents: ['marriage_certificate.pdf'],
          createdAt: '2024-07-09T14:20:00Z',
          location: 'Delhi'
        },
        {
          id: 'CASE003',
          clientName: 'Amit Patel',
          clientEmail: 'amit.patel@example.com',
          clientPhone: '+91-9876543212',
          caseType: 'Consumer Protection',
          description: 'Product defect complaint against electronics manufacturer.',
          status: 'completed',
          urgency: 'low',
          consultationType: 'phone',
          scheduledDate: '2024-07-08',
          scheduledTime: '11:30',
          consultationFee: '₹1,500',
          documents: ['purchase_receipt.pdf', 'product_photos.jpg'],
          createdAt: '2024-07-05T16:45:00Z',
          location: 'Delhi'
        }
      ]

      setCases(mockCases)
      setStats({
        totalCases: mockCases.length,
        pendingCases: mockCases.filter(c => c.status === 'pending').length,
        completedCases: mockCases.filter(c => c.status === 'completed').length,
        monthlyEarnings: mockCases.reduce((sum, c) => sum + parseInt(c.consultationFee.replace(/\D/g, '')), 0)
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const handleCaseAction = async (caseId, action) => {
    try {
      // Mock API call - in production, this would update database
      const updatedCases = cases.map(case_ => {
        if (case_.id === caseId) {
          switch (action) {
            case 'accept':
              return { ...case_, status: 'active' }
            case 'complete':
              return { ...case_, status: 'completed' }
            case 'decline':
              return { ...case_, status: 'declined' }
            default:
              return case_
          }
        }
        return case_
      })

      setCases(updatedCases)
      setSelectedCase(null)
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingCases: updatedCases.filter(c => c.status === 'pending').length,
        completedCases: updatedCases.filter(c => c.status === 'completed').length
      }))

    } catch (error) {
      console.error('Error updating case:', error)
    }
  }

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = !searchTerm || 
      case_.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTab = selectedTab === 'all' || case_.status === selectedTab
    
    const matchesDate = !filterDate || case_.scheduledDate === filterDate

    return matchesSearch && matchesTab && matchesDate
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'declined': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getConsultationIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={16} />
      case 'phone': return <Phone size={16} />
      case 'in-person': return <User size={16} />
      default: return <FileText size={16} />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lawyer Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.displayName || user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Bell size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCases}</p>
              </div>
              <FileText className="text-blue-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Cases</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingCases}</p>
              </div>
              <AlertCircle className="text-yellow-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Cases</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedCases}</p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Earnings</p>
                <p className="text-2xl font-bold text-blue-600">₹{stats.monthlyEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="text-blue-500" size={24} />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search cases..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-500" />
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Case Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'pending', label: 'Pending Cases', count: stats.pendingCases },
                { id: 'active', label: 'Active Cases', count: cases.filter(c => c.status === 'active').length },
                { id: 'completed', label: 'Completed Cases', count: stats.completedCases },
                { id: 'all', label: 'All Cases', count: stats.totalCases }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Cases List */}
          <div className="p-6">
            {filteredCases.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-500">No cases found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCases.map(case_ => (
                  <div
                    key={case_.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedCase(case_)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{case_.clientName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                            {case_.status}
                          </span>
                          <span className={`text-xs font-medium ${getUrgencyColor(case_.urgency)}`}>
                            {case_.urgency} priority
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{case_.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{new Date(case_.scheduledDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{case_.scheduledTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getConsultationIcon(case_.consultationType)}
                            <span className="capitalize">{case_.consultationType}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin size={14} />
                            <span>{case_.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-green-600 mb-2">{case_.consultationFee}</div>
                        <div className="text-xs text-gray-500">
                          Case #{case_.id}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Case Details</h2>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Client Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedCase.clientName}</p>
                    <p><strong>Email:</strong> {selectedCase.clientEmail}</p>
                    <p><strong>Phone:</strong> {selectedCase.clientPhone}</p>
                    <p><strong>Location:</strong> {selectedCase.location}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Case Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Case ID:</strong> {selectedCase.id}</p>
                    <p><strong>Type:</strong> {selectedCase.caseType}</p>
                    <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedCase.status)}`}>{selectedCase.status}</span></p>
                    <p><strong>Priority:</strong> <span className={getUrgencyColor(selectedCase.urgency)}>{selectedCase.urgency}</span></p>
                    <p><strong>Fee:</strong> {selectedCase.consultationFee}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Case Description</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {selectedCase.description}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Consultation Details</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-blue-600" />
                      <span>{new Date(selectedCase.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-blue-600" />
                      <span>{selectedCase.scheduledTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getConsultationIcon(selectedCase.consultationType)}
                      <span className="capitalize">{selectedCase.consultationType}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedCase.documents && selectedCase.documents.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Documents</h3>
                  <div className="space-y-2">
                    {selectedCase.documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <FileText size={16} className="text-gray-500" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t p-6">
              <div className="flex justify-end space-x-3">
                {selectedCase.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleCaseAction(selectedCase.id, 'decline')}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleCaseAction(selectedCase.id, 'accept')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Accept Case
                    </button>
                  </>
                )}
                
                {selectedCase.status === 'active' && (
                  <button
                    onClick={() => handleCaseAction(selectedCase.id, 'complete')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Mark Complete
                  </button>
                )}
                
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
