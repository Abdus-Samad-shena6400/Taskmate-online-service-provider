const Service = require("../models/serviceModel");

// Create a new service
exports.createService = async (req, res) => {
    try {
        const { fullName, phoneNumber, category, description, location } = req.body;

        // Validate required fields
        if (!fullName || !phoneNumber || !category || !location || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Create a new service
        const service = await Service.create({
            fullName,
            phoneNumber,
            category,
            location,
            description,
            consumerID: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Service created successfully",
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the service",
            error: error.message
        });
    }
};


// Get a single service by ID
exports.getServiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findById(id).populate("providerID", "name email").populate("reviews", "name");

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the service",
            error: error.message
        });
    }
};

// Update a service
exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the service",
            error: error.message
        });
    }
};

// Delete a service
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Service deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the service",
            error: error.message
        });
    }
};

// Add a review to a service
exports.addReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, rating, comment } = req.body;

        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        service.reviews.push({ user, rating, comment });
        service.ratings = service.reviews.reduce((acc, review) => acc + review.rating, 0) / service.reviews.length;

        await service.save();

        res.status(200).json({
            success: true,
            message: "Review added successfully",
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while adding the review",
            error: error.message
        });
    }
};

// Getting all the consumer services

exports.getAllConsumerServices = async (req, res) => {
    try {

        const services = await Service.find({ consumerID: req.user.id });

        const pendingCount = services.filter(service => service.status === "Pending").length;
        const inProgressCount = services.filter(service => service.status === "InProgress").length;
        const completedCount = services.filter(service => service.status === "Completed").length;

        const recentServices = services
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 4);

        res.status(200).json({
            success: true,
            services,
            statusCounts: {
                Total: services.length,
                pending: pendingCount,
                inProgress: inProgressCount,
                completed: completedCount
            },
            recentServices
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching services for the user",
            error: error.message
        });
    }
}





// ADMIN

// Get all services
exports.getAllServices = async (req, res) => {
    try {
        const { status } = req.query;  // get the status query param

        const services = await Service.find();

        // Count services based on status
        const pendingCount = services.filter(service => service.status === "Pending").length;
        const inProgressCount = services.filter(service => service.status === "InProgress").length;
        const completedCount = services.filter(service => service.status === "Completed").length;

        // Filter services based on status query (if provided)
        let filteredServices = services;
        if (status && status.toLowerCase() !== "all") {
            filteredServices = services.filter(service => service.status.toLowerCase() === status.toLowerCase());
        }

        res.status(200).json({
            success: true,
            services: filteredServices,
            statusCounts: {
                Total: services.length,
                pending: pendingCount,
                inProgress: inProgressCount,
                completed: completedCount,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching services",
            error: error.message,
        });
    }
};

exports.getAllProviderServices = async (req, res) => {
    try {
        const services = await Service.find({ providerID: req.user.id });

        const pendingCount = services.filter(service => service.status === "Pending").length;
        const inProgressCount = services.filter(service => service.status === "InProgress").length;
        const completedCount = services.filter(service => service.status === "Completed").length;

        // Get counts by category
        const categoryCounts = {};
        services.forEach(service => {
            categoryCounts[service.category] = (categoryCounts[service.category] || 0) + 1;
        });

        // Calculate average rating
        const servicesWithReviews = services.filter(
            service => service.reviews && typeof service.reviews.rating === "number"
        );

        const totalRating = servicesWithReviews.reduce(
            (sum, service) => sum + Math.min(service.reviews.rating, 5),
            0
        );

        const averageRating = servicesWithReviews.length
            ? (totalRating / servicesWithReviews.length).toFixed(1)
            : "0.0";



        // Task status counts
        const assignedCount = services.filter(service => service.taskStatus === "Assigned").length;
        const unAssignedCount = services.filter(service => service.taskStatus === "UnAssigned").length;

        // Calculate success rate (percentage of completed services)
        const successRate = services.length
            ? Math.round((completedCount / services.length) * 100)
            : 0;

        // Get 5 most recent services
        const recentServices = services
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 5);

        res.status(200).json({
            success: true,
            summary: {
                totalServices: services.length,
                statusCounts: {
                    pending: pendingCount,
                    inProgress: inProgressCount,
                    completed: completedCount
                },
                categoryCounts,
                taskStatusCounts: {
                    assigned: assignedCount,
                    unAssigned: unAssignedCount
                },
                averageRating,
                successRate: `${successRate}%`
            },
            recentServices
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching services for the user",
            error: error.message
        });
    }
};

exports.getServiceByIdForProvider = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.find({ providerID: id, status: "InProgress" }).populate("consumerID", "fullName phoneNumber").populate("reviews", "name");

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            count: service.length,
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the service",
            error: error.message
        });
    }
}
exports.getServiceByIdForConsumer = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.find({ consumerID: id }).populate("providerID", "fullName phoneNumber").populate("reviews", "name");

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            count: service.length,
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the service",
            error: error.message
        });
    }
}

exports.markServiceCompleted = async (req, res) => {
    try {
        const { serviceId } = req.body;


        if (!serviceId) {
            return res.status(400).json({
                success: false,
                message: "Service ID is required",
            });
        }

        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }

        service.status = "Completed";
        await service.save();

        return res.status(200).json({
            success: true,
            message: "Service marked as completed",
            service,
        });
    } catch (error) {
        console.error("Error marking service completed:", error);

        return res.status(500).json({
            success: false,
            message: "An error occurred while marking service as completed",
            error: error.message,
        });
    }
};

exports.completedServicesForConsumer = async (req, res) => {
    try {

        const completedServices = await Service.find({ ConsumerID: req.user._id, status: 'Completed' }).populate("providerID", "name email")

        res.status(200).json({
            success: true,
            count: completedServices.length,
            services: completedServices
        });
    } catch (error) {
        console.error('Error fetching completed services:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.consumerSubmitReview = async (req, res) => {
    try {

        const { serviceId, rating, comment } = req.body; // Fixed: using 'comment' instead of 'review'


        // Validate required fields
        if (!serviceId || !rating || !comment) {
            console.log("Missing required fields");
            return res.status(400).json({
                success: false,
                message: "Service ID, rating, and comment are required"
            });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            console.log("Invalid rating range:", rating);
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }


        // Find the service
        const service = await Service.findById(serviceId);

        if (!service) {
            console.log("Service not found");
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }

        // Check if service is completed
        if (service.status !== 'Completed') {
            console.log("Service is not completed");
            return res.status(400).json({
                success: false,
                message: "You can only review completed services"
            });
        }

        // Check if service already has a review
        if (service.reviews && service.reviews.user) {
            console.log("Service already has a review");
            return res.status(400).json({
                success: false,
                message: "This service has already been reviewed"
            });
        }

        // Assign the review
        service.reviews = {
            rating: parseInt(rating),
            comment: comment,
        };

        // Save the service
        const savedService = await service.save();

        return res.status(200).json({
            success: true,
            message: "Review submitted successfully",
            service: {
                ratings: savedService.ratings,
                reviews: savedService.reviews
            }
        });
    } catch (error) {
        console.error("Error submitting review:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while submitting review",
            error: error.message,
        });
    }
};
