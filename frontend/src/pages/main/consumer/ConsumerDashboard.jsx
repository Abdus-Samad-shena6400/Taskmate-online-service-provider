import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
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
  MessageSquare,
  Plus,
  Eye,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useDeleteServiceMutation, useGetAllUserServicesQuery } from '../../../api/services/serviceApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ConsumerDashboard = () => {
  const [deleteService] = useDeleteServiceMutation();
  const { data, isLoading, error, refetch } = useGetAllUserServicesQuery();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const navigate = useNavigate();

  const handleDeleteClick = (id) => {
    setSelectedServiceId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteService(selectedServiceId).unwrap();
      toast.success('Service deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete service');
    }
    setDeleteDialogOpen(false);
    setSelectedServiceId(null);
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

  // Delete Confirmation Dialog
  const DeleteDialog = () => (
    deleteDialogOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete Service</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this service? This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Format data for charts
  const statusData = [
    { name: 'Pending', value: data?.statusCounts?.pending || 0, color: '#FF6B35' },
    { name: 'In Progress', value: data?.statusCounts?.inProgress || 0, color: '#00BFFF' },
    { name: 'Completed', value: data?.statusCounts?.completed || 0, color: '#06D6A0' }
  ];

  // Category distribution data
  const categoryData = data?.services?.reduce((acc, service) => {
    const category = service.category;
    const existingCategory = acc.find(item => item.name === category);
    if (existingCategory) {
      existingCategory.Services += 1;
    } else {
      acc.push({ name: category, Services: 1 });
    }
    return acc;
  }, []) || [];

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-600 mb-4">Unable to load your dashboard data</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Consumer Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Track and manage your service requests</p>
            </div>
            <button
              onClick={() => navigate('/add-service')}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Plus size={16} className="mr-2" />
              Request Service
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Services"
            value={data?.statusCounts?.Total || 0}
            subtitle="All requests"
            icon={Briefcase}
            gradient="from-blue-500 to-purple-600"
          />
          <StatCard
            title="Pending Services"
            value={data?.statusCounts?.pending || 0}
            subtitle="Awaiting response"
            icon={Clock}
            gradient="from-yellow-400 to-orange-500"
          />
          <StatCard
            title="Active Services"
            value={data?.statusCounts?.inProgress || 0}
            subtitle="In progress"
            icon={Activity}
            gradient="from-green-400 to-blue-500"
          />
          <StatCard
            title="Completed Services"
            value={data?.statusCounts?.completed || 0}
            subtitle="Successfully finished"
            icon={CheckCircle}
            gradient="from-purple-400 to-pink-500"
          />
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
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
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
                  <YAxis ticks={[0, 5, 10, 15]} />
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
              <h3 className="text-xl font-bold text-gray-900">Your Services</h3>
              <span className="text-sm text-gray-500">{data?.services?.length || 0} total</span>
            </div>
            <div className="space-y-4">
              {data?.recentServices?.length > 0 ? (
                data.recentServices
                  .slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // descending by date
                  .map((service) => (
                    <div key={service._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {service.category.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{service.category}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${service.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : service.status === 'inProgress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {service.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{service.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Phone size={12} className="mr-1" />
                            {service.phoneNumber}
                          </div>
                          <div className="flex items-center">
                            <MapPin size={12} className="mr-1" />
                            {service.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {formatDate(service.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/services/${service._id}`)}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(service._id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Services Yet</h4>
                  <p className="text-gray-600 mb-4">Start by requesting your first service</p>
                  <button
                    onClick={() => navigate('/add-service')}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <Plus size={16} className="mr-2" />
                    Request Service
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/add-service')}
                className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                <Plus size={20} />
                <span className="font-medium">Request New Service</span>
              </button>
              <button
                onClick={() => navigate('/my-services')}
                className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition-all"
              >
                <ClipboardList size={20} />
                <span className="font-medium">View All Services</span>
              </button>
              <button onClick={() => navigate('/consumer/review')} className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all">
                <Star size={20} />
                <span className="font-medium">Completed Services</span>
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all"
              >
                <User size={20} />
                <span className="font-medium">Update Profile</span>
              </button>
            </div>

            {/* Service Summary */}
            <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <h4 className="font-semibold text-gray-900 mb-3">Service Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Requests</span>
                  <span className="font-semibold text-gray-900">{data?.statusCounts?.Total || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-gray-900">{data?.statusCounts?.completed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold text-gray-900">
                    {data?.statusCounts?.Total > 0
                      ? `${Math.round((data?.statusCounts?.completed / data?.statusCounts?.Total) * 100)}%`
                      : '0%'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog />
    </div>
  );
};

export default ConsumerDashboard;