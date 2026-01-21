import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import {
  Menu,
  Users,
  Building2,
  ClipboardList,
  Bell,
  TrendingUp,
  TrendingDown,
  Briefcase,
  CheckCircle,
  Clock,
  X,
  Star,
  ClipboardCheck,
  User,
  RefreshCw,
  Check,
  Loader,
  Phone,
  Calendar,
  DollarSign,
  Award,
  Target,
  Activity,
  MapPin,
  MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import { useGetAllProviderServicesQuery } from '../../../api/services/serviceApi';
import { useNavigate } from 'react-router-dom';

const ProviderDashboard = () => {
  const { data, isLoading, error } = useGetAllProviderServicesQuery();
  

  const navigate = useNavigate()

  // Handle refresh action
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  // StatCard Component
  const StatCard = ({ title, value, change, icon: Icon, gradient, subtitle, onClick }) => (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 text-white`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-white/70 text-sm">{subtitle}</p>
          )}
        </div>
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
          <Icon size={24} />
        </div>
      </div>
      {change && (
        <div className="flex items-center">
          {change > 0 ? (
            <TrendingUp size={16} className="mr-1" />
          ) : (
            <TrendingDown size={16} className="mr-1" />
          )}
          <span className="text-sm font-medium">
            {change > 0 ? '+' : ''}{change}% from last month
          </span>
        </div>
      )}
    </div>
  );

  // Service status data for pie chart
  const serviceStatusData = [
    { name: 'Pending', value: data?.summary?.statusCounts.pending, color: '#FF6B35' },
    { name: 'In Progress', value: data?.summary?.statusCounts.inProgress, color: '#00BFFF' },
    { name: 'Completed', value: data?.summary?.statusCounts.completed, color: '#06D6A0' }
  ];

  // Category distribution data
  const categoryData = Object.entries(data?.summary?.categoryCounts || {}).map(([category, count]) => ({
    name: category,
    Services: count,
    color: ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'][Math.floor(Math.random() * 5)]
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Provider Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's your service overview</p>
            </div>
            
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin h-12 w-12 text-blue-500" />
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Services"
                value={data?.summary?.totalServices}
                subtitle="All time"
                icon={Briefcase}
                gradient="from-blue-500 to-purple-600"
              />
              <StatCard
                title="Active Services"
                value={data?.summary?.statusCounts?.inProgress}
                subtitle="In Progress"
                icon={Activity}
                gradient="from-green-400 to-blue-500"
              />
              <StatCard
                title="Completed Services"
                value={data?.summary?.statusCounts?.completed}
                subtitle="Successfully finished"
                icon={CheckCircle}
                gradient="from-purple-400 to-pink-500"
              />
              <StatCard
                title="Average Rating"
                value={`${data?.summary?.averageRating}/5`}
                subtitle="Customer satisfaction"
                icon={Star}
                gradient="from-yellow-400 to-orange-500"
              />
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-emerald-100 p-3 rounded-xl">
                    <Target className="h-6 w-6 text-emerald-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{data.summary.taskStatusCounts.assigned}</span>
                </div>
                <h3 className="font-semibold text-gray-900">Assigned Tasks</h3>
                <p className="text-sm text-gray-600">Ready to work</p>
              </div> */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-amber-100 p-3 rounded-xl">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{data.summary.statusCounts.pending}</span>
                </div>
                <h3 className="font-semibold text-gray-900">Pending</h3>
                <p className="text-sm text-gray-600">Awaiting response</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Loader className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{data.summary.statusCounts.inProgress}</span>
                </div>
                <h3 className="font-semibold text-gray-900">In Progress</h3>
                <p className="text-sm text-gray-600">Currently working</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{data.summary?.successRate}</span>
                </div>
                <h3 className="font-semibold text-gray-900">Success Rate</h3>
                <p className="text-sm text-gray-600">Completion rate</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Service Status Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Service Status Overview</h3>
                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {serviceStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Service Categories</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis ticks={[0, 5, 10, 15]}/>
                      <Tooltip />
                      <Bar dataKey="Services" fill="#667eea" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Services & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Services */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Recent Services</h3>
                  <span className="text-sm text-gray-500">{data.recentServices.length} active</span>
                </div>
                <div className="space-y-4">
                  {data.recentServices.map((service) => (
                    <div key={service._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {service.fullName?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{service.fullName}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            service.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : service.status === 'inProgress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {service.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{service.category}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Phone size={12} className="mr-1" />
                            {service.phoneNumber}
                          </div>
                          <div className="flex items-center">
                            <MapPin size={12} className="mr-1" />
                            {service.address}
                          </div>
                          <div className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {new Date(service.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button onClick={() => navigate("/provider/services")} className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all">
                    <ClipboardList size={20} />
                    <span className="font-medium">View All Services</span>
                  </button>
                  <button onClick={() => navigate('/profile')} className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition-all">
                    <User size={20} />
                    <span className="font-medium">Update Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all">
                    <Star size={20} />
                    <span className="font-medium">View Reviews</span>
                  </button>
                  {/* <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all">
                    <DollarSign size={20} />
                    <span className="font-medium">Earnings Report</span>
                  </button> */}
                </div>

                {/* Earnings Summary */}
                <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Servcies</span>
                      <span className="font-semibold text-gray-900">{data?.summary?.totalServices}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Services Completed</span>
                      <span className="font-semibold text-gray-900">{data.summary.statusCounts.completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg. ratings</span>
                      <span className="font-semibold text-gray-900">{`${data?.summary?.averageRating}/5`}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ProviderDashboard;