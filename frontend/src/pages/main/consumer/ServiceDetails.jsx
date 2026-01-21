import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Phone,
    User,
    Calendar,
    Clock,
    Star,
    CheckCircle,
    AlertCircle,
    Loader,
    MessageSquare,
    Edit3,
    Award,
    Building2
} from 'lucide-react';
import { useGetServiceByIdQuery } from '../../../api/services/serviceApi';

const ServiceDetails = () => {
    const navigate = useNavigate();
    const { serviceId } = useParams();
    
    const { data, error, isLoading } = useGetServiceByIdQuery(serviceId);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Pending':
                return {
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    icon: AlertCircle,
                    iconColor: 'text-yellow-600'
                };
            case 'In-Progress':
            case 'inProgress':
                return {
                    color: 'bg-blue-100 text-blue-800 border-blue-200',
                    icon: Loader,
                    iconColor: 'text-blue-600'
                };
            case 'Completed':
                return {
                    color: 'bg-green-100 text-green-800 border-green-200',
                    icon: CheckCircle,
                    iconColor: 'text-green-600'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: AlertCircle,
                    iconColor: 'text-gray-600'
                };
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Loading service details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
                <div className="max-w-md mx-auto mt-20">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Service</h3>
                        <p className="text-red-600 mb-4">Unable to load service details</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const service = data?.service;
    const statusConfig = getStatusConfig(service?.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-100">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Service Details
                            </h1>
                            <p className="text-gray-600 mt-1">Complete service information</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full mx-auto">
                    {/* Service Header Card */}
                    <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{service?.category}</h2>
                                    <p className="text-blue-100">Service ID: {service?._id}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-full border ${statusConfig.color} flex items-center space-x-2`}>
                                    <StatusIcon size={16} className={statusConfig.iconColor} />
                                    <span className="font-medium">{service?.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Customer Information */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center mb-6">
                                    <div className="bg-blue-100 p-3 rounded-xl mr-4">
                                        <User className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Customer Information</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <User size={16} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Customer Name</p>
                                            <p className="font-semibold text-gray-900">{service?.fullName}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <Phone size={16} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                                            <p className="font-semibold text-gray-900">{service?.phoneNumber}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="md:col-span-2 flex items-start space-x-3">
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <MapPin size={16} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Location</p>
                                            <p className="font-semibold text-gray-900">{service?.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Service Information */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center mb-6">
                                    <div className="bg-purple-100 p-3 rounded-xl mr-4">
                                        <Building2 className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Service Information</h3>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <Edit3 size={16} className="text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500 mb-1">Description</p>
                                            <p className="font-medium text-gray-900 leading-relaxed">{service?.description}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <Star size={16} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Rating</p>
                                            <div className="flex items-center">
                                                <div className="flex text-yellow-400 mr-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            className={i < (service?.ratings || 0) ? "fill-current" : "text-gray-300"}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="font-semibold text-gray-900">
                                                    {service?.ratings ? `${service?.ratings}/5` : 'No ratings yet'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center mb-6">
                                    <div className="bg-green-100 p-3 rounded-xl mr-4">
                                        <Clock className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Timeline</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <Calendar size={16} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Created At</p>
                                            <p className="font-semibold text-gray-900">{formatDate(service?.createdAt)}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <Clock size={16} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                                            <p className="font-semibold text-gray-900">{formatDate(service?.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Provider Information */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-indigo-100 p-3 rounded-xl mr-3">
                                        <Award className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Provider</h3>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                                        {service?.providerID?.name?.charAt(0) || 'P'}
                                    </div>
                                    <h4 className="font-semibold text-gray-900 mb-1">{service?.providerID?.name}</h4>
                                    <p className="text-sm text-gray-600 mb-4">{service?.providerID?.email}</p>
                                    
                                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2">
                                        <MessageSquare size={16} />
                                        <span>Contact Provider</span>
                                    </button>
                                </div>
                            </div>

                            {/* Task Status */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Task Status</h3>
                                <div className="text-center">
                                    <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getStatusConfig(service?.taskStatus).color}`}>
                                        <span className="font-medium">{service?.taskStatus}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                                        <Edit3 size={16} />
                                        <span>Edit Service</span>
                                    </button>
                                    <button 
                                        onClick={() => navigate(-1)}
                                        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
                                    >
                                        <ArrowLeft size={16} />
                                        <span>Back to Services</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ServiceDetails;