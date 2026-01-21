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
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  BarChart3,
  Settings,
  Bell,
  TrendingUp,
  TrendingDown,
  Briefcase,
  CheckCircle,
  Clock,
  X,
  Star,
  ClipboardCheck,
  UserPlus,
  X as Close,
  RefreshCw,
  Check,
  Loader
} from 'lucide-react';
import { useState } from 'react';
import { useAdminDataQuery } from '../../../api/services/adminApi';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, error } = useAdminDataQuery();


  // Handle refresh action
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  // Sidebar menu items
  const menuItems = [
    { text: 'Dashboard', icon: LayoutDashboard, path: '/admin-dashboard', color: '#667eea' },
    { text: 'Consumers', icon: Users, path: '/admin/consumers', color: '#f093fb' },
    { text: 'Providers', icon: Building2, path: '/admin/providers', color: '#4facfe' },
    { text: 'Services', icon: ClipboardList, path: '/admin/services-dashboard', color: '#43e97b' },
    // { text: 'Analytics', icon: BarChart3, path: '/admin/analytics', color: '#fa709a' },
    // { text: 'Settings', icon: Settings, path: '/admin/settings', color: '#fee140' }
  ];

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

  // MetricBar Component
  const MetricBar = ({ label, value, color }) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}40, ${color})`
          }}
        />
      </div>
    </div>
  );

  if (isLoading) return <p className="p-8">Loading dashboard data...</p>;
  if (error) return <p className="p-8 text-red-500">Error fetching data</p>;

  // Transform monthlyUserStats for line chart
  const userGrowthData = data?.data.monthlyUserStats?.map((stat, index) => ({
    month: `Month ${index + 1}`,
    Users: stat.count
  })) || [];

  // Pie chart data
  const serviceStatusData = [
    { name: 'Pending', Services: data?.data.totalPendingServices ?? 0, color: '#FF6B35' },
    { name: 'In Progress', Services: data?.data.totalInProgressServices ?? 0, color: '#4ECDC4' },
    { name: 'Completed', Services: data?.data.totalCompletedServices ?? 0, color: '#45B7D1' }
  ];

  const taskAssignmentData = [
    { name: 'Assigned', Services: data?.data.totalAssignedServices ?? 0, color: '#96CEB4' },
    { name: 'Un-Assigned', Services: data?.data.totalUnAssignedServices ?? 0, color: '#FFEAA7' }
  ];

  // Recent Activities - combine recentUsers and recentServices
  const recentActivities = [
    ...(data?.data.recentUsers?.map((user, index) => ({
      id: index + 1,
      user: user.name,
      action: `Registered as ${user.role}`,
      time: new Date(user.createdAt).toLocaleDateString(),
      status: 'new',
      type: 'user'
    })) || []),
    ...(data?.data.recentServices?.map((service, index) => ({
      id: index + 100,
      user: service.fullName,
      action: `Service "${service.category}" Requested`,
      time: new Date(service.createdAt).toLocaleDateString(),
      status: service.status || 'pending',
      type: 'service'
    })) || [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <nav className="p-4 flex flex-col">
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.text}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 mb-2 group"
            >
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <item.icon size={20} style={{ color: item.color }} />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-gray-900">
                {item.text}
              </span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={data?.data.totalUsers}
              subtitle={`+${data?.data.newUsersToday ?? 0} today`}
              icon={Users}
              gradient="from-blue-500 to-purple-600"
            // change={12}
            />
            <StatCard
              title="Total Consumers"
              value={data?.data.totalConsumers ?? 0}
              subtitle="Service seekers"
              icon={Users}
              gradient="from-cyan-400 to-blue-500"
            />
            <StatCard
              title="Total Providers"
              value={data?.data.totalProviders ?? 0}
              subtitle="Service providers"
              icon={Building2}
              gradient="from-emerald-400 to-teal-500"
            />
            <StatCard
              title="Average Rating"
              value={`${data?.data.avgRating ?? 0}/5`}
              subtitle="Service quality"
              icon={Star}
              gradient="from-yellow-400 to-orange-500"
            // change={1}
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Services"
              value={data?.data.totalServices ?? 0}
              subtitle="Total Services"
              icon={Briefcase}
              gradient="from-green-400 to-blue-500"
            // change={8}
            />
            <StatCard
              title="Assigned Services"
              value={data?.data.totalInProgressServices ?? 0}
              subtitle="Provider assigned"
              icon={ClipboardCheck}
              gradient="from-indigo-400 to-purple-500"
            />

            <StatCard
              title="Pending Assignment"
              value={data?.data.totalUnAssignedServices ?? 0}
              subtitle="Awaiting provider"
              icon={Clock}
              gradient="from-rose-400 to-red-500"
            />
            <StatCard
              title="Completed Services"
              value={data?.data.totalCompletedServices ?? 0}
              subtitle="All time"
              icon={CheckCircle}
              gradient="from-purple-400 to-pink-500"
            // change={15}
            />

          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

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
                      dataKey="Services"
                    >
                      {serviceStatusData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-4 rounded-xl border border-orange-200">
                  <Clock size={24} className="text-orange-600 mb-2" />
                  <p className="text-sm font-medium text-orange-900">Pending</p>
                  <p className="text-xl font-bold text-orange-600">{data?.data.totalPendingServices ?? 0}</p>
                </div>
                <div className="bg-gradient-to-r from-red-100 to-red-50 p-4 rounded-xl border border-red-200">
                  <Loader size={24} className="text-red-600 mb-2" />
                  <p className="text-sm font-medium text-red-900">In-Progress</p>
                  <p className="text-xl font-bold text-red-600">{data?.data.totalInProgressServices ?? 0}</p>
                </div>
                <div className="bg-gradient-to-r from-red-100 to-red-50 p-4 rounded-xl border border-red-200">
                  <Check size={24} className="text-red-600 mb-2" />
                  <p className="text-sm font-medium text-red-900">Completed</p>
                  <p className="text-xl font-bold text-red-600">{data?.data.totalCompletedServices ?? 0}</p>
                </div>
              </div>
            </div>


            {/* Platform Metrics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Metrics</h3>
              <div className="space-y-4">
                <MetricBar
                  label="Service Completion Rate"
                  value={data?.data.completionRate ?? 0}
                  color="#10b981"
                />
                <MetricBar
                  label="Provider Response Rate"
                  value={data?.data.providerResponseRate ?? 0}
                  color="#3b82f6"
                />
                <MetricBar
                  label="Service Assignment Rate"
                  value={data?.data.assignmentRate ?? 0}
                  color="#f59e0b"
                />
                <MetricBar
                  label="Customer Satisfaction"
                  value={data?.data.customerSatisfaction ?? 0}
                  color="#ec4899"
                />
                <MetricBar
                  label="Platform Uptime"
                  value={data?.data.platformUptime ?? 0}
                  color="#8b5cf6"
                />
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${activity.type === 'user' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-green-400 to-blue-500'
                      }`}>
                      {activity?.user?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{activity.user}</p>
                      <p className="text-sm text-gray-600 truncate">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        activity.status === 'progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {activity.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Assignment Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Task Assignment Overview</h3>
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskAssignmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="Services"
                    >
                      {taskAssignmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-4 rounded-xl border border-orange-200">
                  <Check size={24} className="text-orange-600 mb-2" />
                  <p className="text-sm font-medium text-orange-900">Assigned</p>
                  <p className="text-xl font-bold text-orange-600">{data?.data.totalAssignedServices ?? 0}</p>
                </div>
                <div className="bg-gradient-to-r from-red-100 to-red-50 p-4 rounded-xl border border-red-200">
                  <X size={24} className="text-red-600 mb-2" />
                  <p className="text-sm font-medium text-red-900">Unassigned</p>
                  <p className="text-xl font-bold text-red-600">{data?.data.totalUnAssignedServices ?? 0}</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;