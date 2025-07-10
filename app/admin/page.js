'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Scale, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Clock,
  MessageSquare,
  Shield,
  Settings,
  Download,
  Filter,
  Search,
  RefreshCw,
  Activity,
  Database,
  Globe,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState(null)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Mock admin dashboard data - in production, fetch from APIs
      const mockData = {
        overview: {
          totalUsers: 12547,
          totalLawyers: 389,
          totalCases: 2847,
          totalRevenue: 1247500,
          monthlyGrowth: {
            users: 12.5,
            lawyers: 8.3,
            cases: 15.7,
            revenue: 22.1
          }
        },
        
        userMetrics: {
          activeUsers: 8934,
          newUsersToday: 45,
          userRetention: 78.5,
          avgSessionDuration: '12:34',
          topLocations: [
            { city: 'Delhi', count: 3456 },
            { city: 'Mumbai', count: 2234 },
            { city: 'Bangalore', count: 1987 },
            { city: 'Chennai', count: 1456 },
            { city: 'Kolkata', count: 1123 }
          ]
        },
        
        lawyerMetrics: {
          activeLawyers: 312,
          pendingVerifications: 23,
          avgRating: 4.6,
          topPerformers: [
            { name: 'Adv. Priya Sharma', cases: 156, rating: 4.9 },
            { name: 'Adv. Rajesh Kumar', cases: 134, rating: 4.8 },
            { name: 'Adv. Meera Gupta', cases: 128, rating: 4.7 }
          ]
        },
        
        caseMetrics: {
          activeCases: 1234,
          completedCases: 1613,
          avgResolutionTime: '18 days',
          casesByType: [
            { type: 'Family Law', count: 567 },
            { type: 'Property Law', count: 456 },
            { type: 'Criminal Law', count: 389 },
            { type: 'Consumer Protection', count: 234 },
            { type: 'Labour Law', count: 201 }
          ]
        },
        
        financialMetrics: {
          monthlyRevenue: 234500,
          totalRevenue: 1247500,
          pendingPayments: 45600,
          avgTransactionValue: 2200,
          revenueByMonth: [
            { month: 'Jan', revenue: 98000 },
            { month: 'Feb', revenue: 112000 },
            { month: 'Mar', revenue: 134000 },
            { month: 'Apr', revenue: 156000 },
            { month: 'May', revenue: 178000 },
            { month: 'Jun', revenue: 234500 }
          ]
        },
        
        systemMetrics: {
          uptime: '99.9%',
          avgResponseTime: '234ms',
          activeConnections: 1234,
          storageUsed: '2.3TB',
          databaseQueries: 45678,
          errorRate: '0.1%'
        },
        
        recentActivity: [
          { id: 1, type: 'user_signup', description: 'New user registration: john.doe@example.com', timestamp: '2024-07-10T10:30:00Z' },
          { id: 2, type: 'lawyer_verification', description: 'Lawyer verification completed: Adv. Amit Patel', timestamp: '2024-07-10T10:15:00Z' },
          { id: 3, type: 'case_completed', description: 'Case CASE001 marked as completed', timestamp: '2024-07-10T10:00:00Z' },
          { id: 4, type: 'payment_received', description: 'Payment of ₹2,000 received for consultation', timestamp: '2024-07-10T09:45:00Z' },
          { id: 5, type: 'system_alert', description: 'High CPU usage detected on server 2', timestamp: '2024-07-10T09:30:00Z' }
        ],
        
        alerts: [
          { id: 1, type: 'warning', message: 'Server response time above threshold', severity: 'medium', timestamp: '2024-07-10T09:30:00Z' },
          { id: 2, type: 'info', message: '23 lawyer verification requests pending', severity: 'low', timestamp: '2024-07-10T08:00:00Z' },
          { id: 3, type: 'error', message: 'Payment gateway error rate increased', severity: 'high', timestamp: '2024-07-09T23:15:00Z' }
        ]
      }
      
      setDashboardData(mockData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm flex items-center mt-1 ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp size={16} className="mr-1" />
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <Icon className={`text-${color}-500`} size={24} />
      </div>
    </div>
  )

  const AlertBadge = ({ type, message, severity, timestamp }) => (
    <div className={`p-3 rounded-lg border-l-4 ${
      severity === 'high' ? 'border-red-500 bg-red-50' :
      severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
      'border-blue-500 bg-blue-50'
    }`}>
      <div className="flex items-start">
        {severity === 'high' ? <AlertTriangle className="text-red-500 mt-1" size={16} /> :
         severity === 'medium' ? <AlertCircle className="text-yellow-500 mt-1" size={16} /> :
         <AlertCircle className="text-blue-500 mt-1" size={16} />}
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Legal Assistant Platform Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={refreshing}
              >
                <RefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                <span>Refresh</span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'lawyers', label: 'Lawyers', icon: Scale },
                { id: 'cases', label: 'Cases', icon: FileText },
                { id: 'financial', label: 'Financial', icon: DollarSign },
                { id: 'system', label: 'System', icon: Database }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={dashboardData.overview.totalUsers.toLocaleString()}
                change={dashboardData.overview.monthlyGrowth.users}
                icon={Users}
              />
              <StatCard
                title="Total Lawyers"
                value={dashboardData.overview.totalLawyers.toLocaleString()}
                change={dashboardData.overview.monthlyGrowth.lawyers}
                icon={Scale}
                color="green"
              />
              <StatCard
                title="Total Cases"
                value={dashboardData.overview.totalCases.toLocaleString()}
                change={dashboardData.overview.monthlyGrowth.cases}
                icon={FileText}
                color="purple"
              />
              <StatCard
                title="Total Revenue"
                value={`₹${dashboardData.overview.totalRevenue.toLocaleString()}`}
                change={dashboardData.overview.monthlyGrowth.revenue}
                icon={DollarSign}
                color="yellow"
              />
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
              <div className="space-y-3">
                {dashboardData.alerts.map(alert => (
                  <AlertBadge key={alert.id} {...alert} />
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {dashboardData.recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'system_alert' ? 'bg-red-500' :
                      activity.type === 'payment_received' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === 'users' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Active Users"
                value={dashboardData.userMetrics.activeUsers.toLocaleString()}
                icon={UserCheck}
                color="green"
              />
              <StatCard
                title="New Users Today"
                value={dashboardData.userMetrics.newUsersToday.toLocaleString()}
                icon={Users}
              />
              <StatCard
                title="User Retention"
                value={`${dashboardData.userMetrics.userRetention}%`}
                icon={TrendingUp}
                color="purple"
              />
              <StatCard
                title="Avg Session Duration"
                value={dashboardData.userMetrics.avgSessionDuration}
                icon={Clock}
                color="yellow"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
              <div className="space-y-3">
                {dashboardData.userMetrics.topLocations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe size={20} className="text-gray-500" />
                      <span className="font-medium">{location.city}</span>
                    </div>
                    <span className="text-gray-600">{location.count.toLocaleString()} users</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lawyers Tab */}
        {selectedTab === 'lawyers' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Active Lawyers"
                value={dashboardData.lawyerMetrics.activeLawyers.toLocaleString()}
                icon={Scale}
                color="green"
              />
              <StatCard
                title="Pending Verifications"
                value={dashboardData.lawyerMetrics.pendingVerifications.toLocaleString()}
                icon={AlertCircle}
                color="yellow"
              />
              <StatCard
                title="Average Rating"
                value={dashboardData.lawyerMetrics.avgRating}
                icon={TrendingUp}
                color="purple"
              />
              <StatCard
                title="Total Lawyers"
                value={dashboardData.overview.totalLawyers.toLocaleString()}
                icon={Users}
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
              <div className="space-y-3">
                {dashboardData.lawyerMetrics.topPerformers.map((lawyer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{lawyer.name}</p>
                        <p className="text-sm text-gray-600">{lawyer.cases} cases completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">⭐ {lawyer.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cases Tab */}
        {selectedTab === 'cases' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Active Cases"
                value={dashboardData.caseMetrics.activeCases.toLocaleString()}
                icon={FileText}
                color="blue"
              />
              <StatCard
                title="Completed Cases"
                value={dashboardData.caseMetrics.completedCases.toLocaleString()}
                icon={CheckCircle}
                color="green"
              />
              <StatCard
                title="Avg Resolution Time"
                value={dashboardData.caseMetrics.avgResolutionTime}
                icon={Clock}
                color="yellow"
              />
              <StatCard
                title="Total Cases"
                value={dashboardData.overview.totalCases.toLocaleString()}
                icon={Activity}
                color="purple"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cases by Type</h3>
              <div className="space-y-3">
                {dashboardData.caseMetrics.casesByType.map((caseType, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Scale size={20} className="text-gray-500" />
                      <span className="font-medium">{caseType.type}</span>
                    </div>
                    <span className="text-gray-600">{caseType.count.toLocaleString()} cases</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Financial Tab */}
        {selectedTab === 'financial' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Monthly Revenue"
                value={`₹${dashboardData.financialMetrics.monthlyRevenue.toLocaleString()}`}
                icon={DollarSign}
                color="green"
              />
              <StatCard
                title="Pending Payments"
                value={`₹${dashboardData.financialMetrics.pendingPayments.toLocaleString()}`}
                icon={AlertCircle}
                color="yellow"
              />
              <StatCard
                title="Avg Transaction Value"
                value={`₹${dashboardData.financialMetrics.avgTransactionValue.toLocaleString()}`}
                icon={TrendingUp}
                color="purple"
              />
              <StatCard
                title="Total Revenue"
                value={`₹${dashboardData.financialMetrics.totalRevenue.toLocaleString()}`}
                icon={Activity}
                color="blue"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
              <div className="space-y-3">
                {dashboardData.financialMetrics.revenueByMonth.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{month.month}</span>
                    <span className="text-green-600 font-semibold">₹{month.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {selectedTab === 'system' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="System Uptime"
                value={dashboardData.systemMetrics.uptime}
                icon={CheckCircle}
                color="green"
              />
              <StatCard
                title="Response Time"
                value={dashboardData.systemMetrics.avgResponseTime}
                icon={Clock}
                color="blue"
              />
              <StatCard
                title="Active Connections"
                value={dashboardData.systemMetrics.activeConnections.toLocaleString()}
                icon={Activity}
                color="purple"
              />
              <StatCard
                title="Error Rate"
                value={dashboardData.systemMetrics.errorRate}
                icon={AlertTriangle}
                color="red"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Storage Used</span>
                  <span className="font-semibold">{dashboardData.systemMetrics.storageUsed}</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Queries</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Queries (24h)</span>
                  <span className="font-semibold">{dashboardData.systemMetrics.databaseQueries.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
