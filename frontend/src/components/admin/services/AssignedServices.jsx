import React, { useState } from 'react';
import { Eye, UserX, Calendar, Phone, Star, CheckCircle } from 'lucide-react';
import { useAssignedSerivcesQuery, useUnAssignServiceMutation } from '../../../api/services/adminApi';
import toast from 'react-hot-toast';

const AssignedServices = () => {
  const { data, isLoading, error } = useAssignedSerivcesQuery();
  const [unAssignService] = useUnAssignServiceMutation();

  // New state to handle modal visibility and selected serviceId
  const [showModal, setShowModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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


  // Open modal and set selected serviceId
  const handleUnassignClick = (serviceId) => {
    setSelectedServiceId(serviceId);
    setShowModal(true);
  };

  // Confirm unassign action
  const confirmUnassign = async () => {
    if (!selectedServiceId) return;
    try {
      await unAssignService(selectedServiceId).unwrap();

      toast.success('Service unassigned successfully', {
        position: 'top-right',
      });

    } catch (error) {
      // You can add error handling here if you want
      console.error('Unassign failed', error);
    } finally {
      setShowModal(false);
      setSelectedServiceId(null);
    }
  };

  // Cancel unassign action and close modal
  const cancelUnassign = () => {
    setShowModal(false);
    setSelectedServiceId(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Assigned Services</h1>
          <p className="text-green-100 mt-1">Monitor and manage assigned service requests</p>
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
                  Created At
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.services && data.services.length > 0 ? (
                data.services.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.category}</div>
                        <div
                          className="text-sm text-gray-500 truncate max-w-40"
                          title={service.description}
                        >
                          {service.description}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">ID: {service._id.slice(-8)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {service?.consumerID?.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase() ?? "N/A"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{service.consumerID?.name ?? "Deleted User"}</div>
                          <div className="text-sm text-gray-500">{service.consumerID?.email ?? "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {service?.providerID?.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase() ?? "N/A"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{service.providerID?.name ?? "Deleted User"}</div>
                          <div className="text-sm text-gray-500">{service.providerID?.email ?? "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {service.phoneNumber}
                        </div>
                        <div className="text-xs text-gray-500">Provider: {service.providerID?.phoneNumber ?? "N/A"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          {service.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {renderStars(service.ratings)}
                        <span className="text-sm text-gray-600 ml-2">
                          {service.ratings > 0 ? service.ratings.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDate(service.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">

                        <button
                          onClick={() => handleUnassignClick(service._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Unassign
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

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{data?.count || 0}</span> assigned services
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Active assignments</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-600">
                  Avg Rating:{' '}
                  {data?.services && data.services.length > 0
                    ? (data.services.reduce((acc, s) => acc + s.ratings, 0) / data.services.length).toFixed(1)
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold mb-4">Confirm Unassign</h2>
            <p className="mb-6">Are you sure you want to unassign this service?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelUnassign}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmUnassign}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
              >
                Unassign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedServices;
