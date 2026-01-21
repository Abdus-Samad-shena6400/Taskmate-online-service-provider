import { useState } from "react";
import {
    Phone,
    MapPin,
    Calendar,
    User,
    FileText,
    CheckCircle,
    X,
    Check
} from 'lucide-react';
import { useGetProviderServicesByIdQuery, useMarkCompletedMutation } from "../../../api/services/serviceApi";
import toast from "react-hot-toast";

const ProviderServices = () => {
    const [selectedService, setSelectedService] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const user = localStorage.getItem("userData");
    const userData = JSON.parse(user);


    const { data, error, isLoading, refetch } = useGetProviderServicesByIdQuery(userData?.user?._id);

    const [markCompleted, { isLoading: isMarkingCompleted, error: markCompletedError }] = useMarkCompletedMutation();

    console.log("Provider Services Data:", data)



    // Get status styling
    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'InProgress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Handle complete service
    const handleCompleteClick = (service) => {
        setSelectedService(service);
        setShowModal(true);
    };

    // Handle service completion
    const handleCompleteService = async () => {
        console.log("Service completed:", selectedService._id);
        const res = await markCompleted(selectedService._id)

        if (res) {

            toast.success("The Task is mark completed successfully", {
                position: "top-right"
            })

            refetch();

            setIsCompleting(false);
            setShowModal(false);
            setSelectedService(null);

        }


    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading services...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">Error loading services</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">My Active Services</h1>
                    <p className="text-gray-600 mt-1">Current Active Services: {data?.count || 0}</p>
                </div>
            </div>

            {/* Services List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid gap-6">
                    {data?.service?.map((service) => (
                        <div key={service._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{service.fullName}</h3>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(service.status)}`}>
                                            {service.status}
                                        </span>
                                    </div>
                                </div>

                                {service.status === 'InProgress' && (
                                    <button
                                        onClick={() => handleCompleteClick(service)}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Mark Complete
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <FileText className="w-4 h-4 mr-2" />
                                        <span className="font-medium">Category:</span>
                                        <span className="ml-2">{service.category}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="w-4 h-4 mr-2" />
                                        <span className="font-medium">Phone:</span>
                                        <span className="ml-2">{service.phoneNumber}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span className="font-medium">Address:</span>
                                        <span className="ml-2">{service?.location}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span className="font-medium">Date:</span>
                                        <span className="ml-2">{new Date(service.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {service.description && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">Description:</span>
                                    <p className="text-gray-600 mt-1">{service.description}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {(!data?.service || data.service.length === 0) && (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                        <p className="text-gray-500">You don't have any assigned services yet.</p>
                    </div>
                )}
            </div>

            {/* Completion Modal */}
            {showModal && selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Complete Service</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                                disabled={isMarkingCompleted}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center mb-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                <span className="font-medium">Service Details</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                                <p><span className="font-medium">Client:</span> {selectedService.fullName}</p>
                                <p><span className="font-medium">Service:</span> {selectedService.category}</p>
                            </div>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Are you sure you have completed this service? This action cannot be undone.
                        </p>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isCompleting}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCompleteService}
                                disabled={isCompleting}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {isCompleting ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Confirm Complete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProviderServices;