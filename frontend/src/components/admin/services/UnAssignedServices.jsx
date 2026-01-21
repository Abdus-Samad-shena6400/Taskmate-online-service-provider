import React, { useState } from 'react';
import { Trash2, UserPlus, Calendar, MapPin, Phone, Star, X, User } from 'lucide-react';
import { useAllProvidersQuery, useAssignToProviderMutation, useDeleteServiceMutation, useUnAssignedServicesQuery } from '../../../api/services/adminApi';
import toast from 'react-hot-toast';

const UnAssignedServices = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    // NEW: State for delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    const { data, isLoading, error, refetch } = useUnAssignedServicesQuery();
    const { data: providers, isLoading: isLoadingProviders, error: errorProviders } = useAllProvidersQuery();
    const [assignToProvider] = useAssignToProviderMutation();
    const [deleteService] = useDeleteServiceMutation();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleAssign = (serviceId) => {
        const service = data?.services.find(s => s._id === serviceId);
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const handleAssignProvider = async (providerId, serviceId) => {
        try {
            console.log('Assign provider:', providerId, 'to service:', serviceId);

            const res = await assignToProvider({ serviceID: serviceId, providerID: providerId }).unwrap();

            toast.success('Provider assigned successfully!', {
                position: 'top-right',
            });

            setIsModalOpen(false);
            setSelectedService(null);

            refetch();

        } catch (error) {
            console.error('Error assigning provider:', error);
            toast.error('Failed to assign provider.');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedService(null);
    };

    // NEW: Open delete confirmation modal
    const handleDelete = (serviceId) => {
        const service = data?.services.find(s => s._id === serviceId);
        setServiceToDelete(service);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        console.log('Confirmed delete service:', serviceToDelete._id);

        await deleteService(serviceToDelete._id)
            .unwrap()

        toast.success('Service deleted successfully!');
        setIsDeleteModalOpen(false);
        setServiceToDelete(null);

        refetch();
    };

    // NEW: Cancel delete modal
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setServiceToDelete(null);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h1 className="text-2xl font-bold text-white">UnAssigned Services</h1>
                    <p className="text-blue-100 mt-1">Manage and assign pending service requests</p>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-gray-600">Loading services...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Consumer</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                    {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th> */}
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data?.services && data?.services.length > 0 ? (
                                    data?.services?.map((service) => (
                                        <tr key={service._id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">
                                                            {service?.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{service?.fullName}</div>
                                                        <div className="text-sm text-gray-500">ID: {service?._id.slice(-8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{service?.category}</div>
                                                <div className="text-sm text-gray-500 truncate max-w-32" title={service?.description}>
                                                    {service?.description}
                                                </div>
                                            </td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{service?.consumerID?.name}</div>
                                                <div className="text-sm text-gray-500">{service?.consumerID?.email}</div>
                                            </td> */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                    {service?.phoneNumber}
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
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                    {formatDate(service?.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleAssign(service?._id)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                                                    >
                                                        <UserPlus className="h-4 w-4 mr-1" />
                                                        Assign
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(service?._id)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Delete
                                                    </button>
                                                </div>
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
                )}

                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{data?.count}</span> unassigned services
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm text-gray-600">Ready for assignment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assign Provider Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-white">Assign Service Provider</h3>
                                        <p className="text-blue-100 text-sm mt-1">Select a provider for: {selectedService?.category}</p>
                                    </div>
                                    <button onClick={closeModal} className="text-white hover:text-gray-200 transition-colors duration-200">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
                                {isLoadingProviders ? (
                                    <div className="p-4 text-center text-gray-600">Loading providers...</div>
                                ) : (
                                    <div className="space-y-3">
                                        {providers?.providers.map((provider) => (
                                            <div
                                                key={provider._id}
                                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-gray-50 to-blue-50"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                                        <span className="text-white font-semibold">
                                                            {provider.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900">{provider.name}</h4>
                                                        <p className="text-sm text-gray-500">{provider.email}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleAssignProvider(provider._id, selectedService?._id)}
                                                    className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                                >
                                                    <User className="h-4 w-4 mr-2" />
                                                    Assign
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 px-6 py-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">Choose from {providers?.providers?.length} available providers</p>
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium rounded-md transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="  max-w-md w-full p-6">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeDeleteModal}></div>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                            <div className="bg-red-600 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-white">Confirm Delete</h3>
                                    <button onClick={closeDeleteModal} className="text-white hover:text-gray-200 transition-colors duration-200">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white px-6 py-6">
                                <p className="text-gray-800 text-center text-sm">
                                    Are you sure you want to delete the service <strong>{serviceToDelete?.category}</strong>?
                                </p>
                                <div className="mt-6 flex justify-center space-x-4">
                                    <button
                                        onClick={closeDeleteModal}
                                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium rounded-md transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                                    >
                                        Confirm Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UnAssignedServices;
