import React, { useState } from 'react';
import { Trash2, Star, Calendar, MapPin, Phone, X, MessageCircle, StarIcon } from 'lucide-react';
import { useCompletedServicesForConsumerQuery, useDeleteServiceMutation, useSubmitReviewMutation } from "../../../api/services/serviceApi";
import toast from 'react-hot-toast';

const MyReviews = () => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    const { data, isLoading, error, refetch } = useCompletedServicesForConsumerQuery();
    const [submitReview] = useSubmitReviewMutation();

    const [ deleteService ] = useDeleteServiceMutation()

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleAddReview = (service) => {
        setSelectedService(service);
        setReviewData({ rating: 0, comment: '' });
        setIsReviewModalOpen(true);
    };

    const handleDelete = (service) => {
        setServiceToDelete(service);
        setIsDeleteModalOpen(true);
    };

    const closeReviewModal = () => {
        setIsReviewModalOpen(false);
        setSelectedService(null);
        setReviewData({ rating: 0, comment: '' });
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setServiceToDelete(null);
    };

    const handleStarClick = (rating) => {
        setReviewData(prev => ({ ...prev, rating }));
    };

    const handleSubmitReview = async () => {
        if (!reviewData.rating || !reviewData.comment.trim()) {
            toast.error('Please provide both rating and comment');
            return;
        }

        setSubmittingReview(true);

        try {
            // TODO: Replace with your actual API call
            console.log('Submitting review:', reviewData?.comment);

            await submitReview({
                serviceId: selectedService._id,
                rating: reviewData.rating,
                comment: reviewData.comment.trim()
            }).unwrap();

            // console.log('Submitting review:', reviewPayload);

            // Example API call (uncomment and modify based on your API):
            // await addReviewMutation(reviewPayload).unwrap();

            toast.success('Review submitted successfully!', {
                position: 'top-right',
            });

            closeReviewModal();
            refetch();

        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review. Please try again.');
        } finally {
            setSubmittingReview(false);
        }
    };

    const confirmDelete = async () => {
        try {
            console.log('Deleting service:', serviceToDelete._id);

            await deleteService(serviceToDelete._id).unwrap();

            toast.success('Service deleted successfully!');
            closeDeleteModal();
            refetch();

        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Failed to delete service.');
        }
    };

    // Star Rating Component
    const StarRating = ({ currentRating = 0, onStarClick, interactive = false }) => {
        const [hoverRating, setHoverRating] = useState(0);

        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        className={`text-2xl transition-colors ${star <= (hoverRating || currentRating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                            } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'}`}
                        onClick={() => interactive && onStarClick && onStarClick(star)}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                    >
                        ★
                    </button>
                ))}
                {interactive && (
                    <span className="ml-2 text-sm text-gray-600">
                        {currentRating > 0 ? `${currentRating}/5` : 'Click to rate'}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                    <h1 className="text-2xl font-bold text-white">My Completed Services</h1>
                    <p className="text-purple-100 mt-1">Review and manage your completed service requests</p>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-gray-600">Loading services...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">Error loading services</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service Provider</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Review</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data?.services && data.services.length > 0 ? (
                                    data?.services?.slice()
                                    .reverse()
                                    .map((service) => (
                                        <tr key={service._id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">
                                                            {service?.providerID?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{service?.providerID?.name}</div>
                                                        <div className="text-sm text-gray-500">{service?.providerID?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{service.category}</div>
                                                <div className="text-sm text-gray-500 truncate max-w-32" title={service.description}>
                                                    {service.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                    {service.phoneNumber}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                                    <span className="truncate max-w-32" title={service.location}>
                                                        {service.location || 'Not specified'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                    {formatDate(service.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                                                    Completed
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${service.reviews?.rating
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${service.reviews?.rating ? "bg-green-400" : "bg-gray-400"
                                                            }`}
                                                    ></div>
                                                    {service.reviews?.rating ? "Has Review" : "No Review"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleAddReview(service)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 shadow-sm"
                                                    >
                                                        <MessageCircle className="h-4 w-4 mr-1" />
                                                        Add Review
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(service)}
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
                                        <td colSpan={7} className="text-center py-6 text-gray-500">
                                            No completed services found
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
                            Showing <span className="font-medium">{data?.count || 0}</span> completed services
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm text-gray-600">Ready for review</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Review Modal */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeReviewModal}></div>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-white">Add Review</h3>
                                        <p className="text-purple-100 text-sm mt-1">Rate your experience with: {selectedService?.category}</p>
                                    </div>
                                    <button onClick={closeReviewModal} className="text-white hover:text-gray-200 transition-colors duration-200">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white px-6 py-6">
                                {/* Service Details */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                                            <span className="text-white font-semibold">
                                                {selectedService?.providerID?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{selectedService?.providerID?.name}</h4>
                                            <p className="text-sm text-gray-500">{selectedService?.category}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rate this service:
                                    </label>
                                    <StarRating
                                        currentRating={reviewData.rating}
                                        onStarClick={handleStarClick}
                                        interactive={true}
                                    />
                                </div>

                                {/* Comment */}
                                <div className="mb-6">
                                    <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Review:
                                    </label>
                                    <textarea
                                        id="review-comment"
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Share your experience with this service..."
                                        value={reviewData.comment}
                                        onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                                        disabled={submittingReview}
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-3">
                                <div className="flex items-center justify-end space-x-3">
                                    <button
                                        onClick={closeReviewModal}
                                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium rounded-md transition-colors duration-200"
                                        disabled={submittingReview}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmitReview}
                                        disabled={submittingReview || !reviewData.rating || !reviewData.comment.trim()}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${submittingReview || !reviewData.rating || !reviewData.comment.trim()
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                                            }`}
                                    >
                                        {submittingReview ? 'Submitting...' : 'Submit Review'}
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
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeDeleteModal}></div>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full mx-4">
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
            )}
        </div>
    );
};

export default MyReviews;