import React, { useState } from 'react';
import { Trash2, Calendar, MapPin, Phone, Star, X, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { useCompletedServicesQuery } from '../../../api/services/adminApi';
import { useDeleteServiceMutation } from '../../../api/services/serviceApi';
import toast from 'react-hot-toast';

const CompletedServices = () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);


    const { data, isLoading, error, refetch } = useCompletedServicesQuery()
    const [deleteService] = useDeleteServiceMutation();


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`h-4 w-4 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
            );
        }
        return stars;
    };

    const handleDeleteClick = (service) => {
        setSelectedService(service);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            // Add your delete API call here
            console.log('Deleting service:', selectedService._id);

            await deleteService(selectedService._id).unwrap();

            toast.success('Service deleted successfully!');

            refetch()
            // Close modal and reset state
            setIsDeleteModalOpen(false); a
            setSelectedService(null);

            // You might want to refresh the data or remove the item from state here
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const closeDeleteModal = () => {
        if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setSelectedService(null);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">Completed Services</h1>
                        <p className="text-green-100 mt-1">View and manage completed service requests</p>
                    </div>
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        <span className="ml-3 text-gray-600">Loading completed services...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                    <h1 className="text-2xl font-bold text-white">Completed Services</h1>
                    <p className="text-green-100 mt-1">View and manage completed service requests</p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Service Info
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Provider
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Rating
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Completed
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data?.services && data.services.length > 0 ? (
                                data?.services?.slice()
                                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // Sort by updatedAt descending
                                .map((service, index) => (
                                    <tr key={service?._id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                                                    <CheckCircle className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{service?.category}</div>
                                                    <div className="text-sm text-gray-500 truncate max-w-40" title={service?.description}>
                                                        {service?.description}
                                                    </div>
                                                    <div className="text-xs text-green-600 mt-1">ID: {service?._id.slice(-8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {service?.consumerID?.name?.split(' ').map(n => n[0]).join('').toUpperCase() ?? "N/A"}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{service?.consumerID?.name ?? "Deleted User"}</div>
                                                    <div className="text-sm text-gray-500">{service?.consumerID?.email ?? "N/A"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {service?.providerID?.name?.split(' ').map(n => n[0]).join('').toUpperCase() ?? "N/A"}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{service?.providerID?.name ?? "Deleted User"}</div>
                                                    <div className="text-sm text-gray-500">{service?.providerID?.email ?? "N/A"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                    {service?.phoneNumber}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Provider: {service?.providerID?.phoneNumber ?? "N/A"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                                <span className="truncate max-w-32" title={service?.location}>
                                                    {service?.location}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-1">
                                                {renderStars(service?.reviews?.rating || 0)}
                                                <span className="text-sm text-gray-600 ml-2">
                                                    {service?.reviews?.rating ? service?.reviews.rating.toFixed(1) : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {service?.reviews?.rating ? '1 review' : 'No reviews'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                {formatDate(service?.updatedAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => handleDeleteClick(service)}
                                                className="inline-flex items-center px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-6 text-gray-500">
                                        No services
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{data?.count || 0}</span> completed services
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-gray-600">Successfully completed</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm text-gray-600">
                                    Avg Rating: {data?.services?.length > 0 ? (data.services.reduce((acc, s) => acc + s.ratings, 0) / data.services.length).toFixed(1) : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={closeDeleteModal}
                        ></div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <AlertTriangle className="h-6 w-6 text-white mr-3" />
                                        <h3 className="text-lg font-medium text-white">Confirm Deletion</h3>
                                    </div>
                                    {!isDeleting && (
                                        <button
                                            onClick={closeDeleteModal}
                                            className="text-white hover:text-gray-200 transition-colors duration-200"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="bg-white px-6 py-4">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center">
                                        <Trash2 className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Are you sure you want to delete this service?
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {selectedService?.category} - {selectedService?.consumerID?.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                    <p className="text-sm text-red-800">
                                        <strong>Warning:</strong> This action cannot be undone. The service record will be permanently removed from the system.
                                    </p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                                <button
                                    onClick={closeDeleteModal}
                                    disabled={isDeleting}
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    disabled={isDeleting}
                                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Service
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompletedServices;