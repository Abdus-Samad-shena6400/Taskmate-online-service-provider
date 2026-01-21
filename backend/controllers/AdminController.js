const Service = require("../models/serviceModel");
const User = require("../models/userModel");

exports.adminDashboard = async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find().select('-password');

        // Fetch users by role
        const consumers = await User.find({ role: 'Consumer' }).select('-password');
        const providers = await User.find({ role: 'Provider' }).select('-password');
        const admins = await User.find({ role: 'Admin' }).select('-password');

        // Fetch all services
        const services = await Service.find()
            .populate('consumerID', 'name email')
            .populate('providerID', 'name email');

        const pendingServices = await Service.find({ status: 'Pending' })
            .populate('consumerID', 'name email')
            .populate('providerID', 'name email');

        const inProgressServices = await Service.find({ status: 'InProgress' })

        const completedServices = await Service.find({ status: 'Completed' })
            .populate('consumerID', 'name email')
            .populate('providerID', 'name email');

        // Get services by task status
        const assignedServices = await Service.find({ taskStatus: 'Assigned' });
        const unAssignedServices = await Service.find({ taskStatus: 'UnAssigned' });

        // Get users registered in the last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const newUsersToday = await User.countDocuments({
            createdAt: { $gte: yesterday }
        });

        // Calculate active services (Pending + In-Progress)
        const activeServices = pendingServices.length + inProgressServices.length;

        // Get monthly user registration data for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyUserStats = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                        role: "$role"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Get monthly service stats
        const monthlyServiceStats = await Service.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                        status: "$status"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Get service category distribution
        const serviceCategoryStats = await Service.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10 // Top 10 categories
            }
        ]);

        // Get recent user activities (last 10 users)
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('name email role createdAt');

        // Get recent services (last 10 services)
        const recentServices = await Service.find()
            .populate('consumerID', 'name email')
            .populate('providerID', 'name email')
            .sort({ createdAt: -1 })
            .limit(10)
            .select('fullName category status consumerID providerID taskStatus createdAt updatedAt');

        // Calculate metrics
        const totalServicesCount = services.length;
        const completionRate = totalServicesCount > 0 ?
            Math.round((completedServices.length / totalServicesCount) * 100) : 0;

        // Calculate provider response rate (providers with assigned services)
        const providersWithServices = await Service.distinct('providerID', { providerID: { $ne: null } });
        const providerResponseRate = providers.length > 0 ?
            Math.round((providersWithServices.length / providers.length) * 100) : 0;

        // Calculate average rating
        const servicesWithRatings = await Service.find({ ratings: { $gt: 0 } });
        const avgRating = servicesWithRatings.length > 0 ?
            servicesWithRatings.reduce((sum, service) => sum + service.ratings, 0) / servicesWithRatings.length : 0;

        // Calculate customer satisfaction based on ratings
        const customerSatisfaction = avgRating > 0 ? Math.round((avgRating / 5) * 100) : 0;

        // Platform uptime (you can integrate with monitoring service)
        const platformUptime = 99.9;

        // Service assignment rate
        const assignmentRate = totalServicesCount > 0 ?
            Math.round((assignedServices.length / totalServicesCount) * 100) : 0;

        res.status(200).json({
            success: true,
            data: {
                // Basic counts
                totalUsers: users.length,
                totalConsumers: consumers.length,
                totalProviders: providers.length,
                totalAdmins: admins.length,
                totalServices: services.length,
                totalPendingServices: pendingServices.length,
                totalInProgressServices: inProgressServices.length,
                totalCompletedServices: completedServices.length,
                totalAssignedServices: assignedServices.length,
                totalUnAssignedServices: unAssignedServices.length,

                // Additional metrics
                newUsersToday,
                activeServices,
                completionRate,
                providerResponseRate,
                customerSatisfaction,
                platformUptime,
                assignmentRate,
                avgRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal

                // Chart data
                monthlyUserStats,
                monthlyServiceStats,
                serviceCategoryStats,

                // Recent activities
                recentUsers,
                recentServices,

                // Limited raw data for tables (if needed)
                users: users.slice(0, 50),
                // consumers: consumers.slice(0, 50),
                // providers: providers.slice(0, 50),
                // services: services.slice(0, 50),
                pendingServices: pendingServices.slice(0, 20),
                inProgressServices: inProgressServices.slice(0, 20),
                completedServices: completedServices.slice(0, 20)
            }
        });
    } catch (error) {
        console.error('Admin Dashboard Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAllConsumers = async (req, res) => {
    try {
        const consumers = await User.find({ role: 'Consumer' });
        res.status(200).json({
            success: true,
            consumers
        });
    } catch (error) {
        console.error('Error fetching consumers:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.getAllProviders = async (req, res) => {
    try {
        const providers = await User.find({ role: 'Provider' });
        res.status(200).json({
            success: true,
            providers
        });
    } catch (error) {
        console.error('Error fetching providers:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


exports.getAllServices = async (req, res) => {

    const services = await Service.find();

    res.status(200).json({
        success: true,
        services
    });

}

exports.getAllUnassignedServices = async (req, res) => {
    try {
        const unassignedServices = await Service.find({ taskStatus: 'UnAssigned' })
            .populate('consumerID', 'name email')

        res.status(200).json({
            success: true,
            count: unassignedServices.length,
            services: unassignedServices
        });
    } catch (error) {
        console.error('Error fetching unassigned services:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.getAllAssignedServices = async (req, res) => {
    try {
        const assignedServices = await Service.find({ taskStatus: 'Assigned', status: "InProgress" })
            .populate('consumerID', 'name email')
            .populate('providerID', 'name email phoneNumber');

        res.status(200).json({
            success: true,
            count: assignedServices.length,
            services: assignedServices
        });
    } catch (error) {
        console.error('Error fetching assigned services:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.getAllCompletedServices = async (req, res) => {
    try {
        const completedServices = await Service.find({ status: 'Completed' })
            .populate('consumerID', 'name email')
            .populate('providerID', 'name email phoneNumber');

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


exports.AssignServiceToProvider = async (req, res) => {

    console.log('Assigning service to provider:', req.body);

    const { serviceID, providerID } = req.body;

    if (!serviceID || !providerID) {
        return res.status(400).json({
            success: false,
            message: 'Service ID and Provider ID are required'
        });
    }

    try {
        const service = await Service.findById(serviceID);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        service.providerID = providerID;
        service.taskStatus = 'Assigned';
        service.status = 'InProgress'; // Change status to InProgress when assigned
        await service.save();

        res.status(200).json({
            success: true,
            message: 'Service assigned to provider successfully',
            service
        });
    } catch (error) {
        console.error('Error assigning service:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.unAssignService = async (req, res) => {
    const { serviceId } = req.body;

    console.log("serviceId:", serviceId);

    if (!serviceId) {
        return res.status(400).json({
            success: false,
            message: 'Service ID is required'
        });
    }

    try {
        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Remove the provider assignment
        service.providerID = null;

        // Change status to UnAssigned
        service.taskStatus = 'UnAssigned';
        service.status = 'Pending';

        await service.save();

        return res.status(200).json({
            success: true,
            message: 'Service unassigned successfully',
            service,
        });
    } catch (error) {
        console.error('Error unassigning service:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};


exports.deleteService = async (req, res) => {
    const { serviceId } = req.params;

    if (!serviceId) {
        return res.status(400).json({
            success: false,
            message: 'Service ID is required'
        });
    }

    try {
        const service = await Service.findByIdAndDelete(serviceId);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required'
        });
    }

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.addAdmin = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        const admin = await User.create({
            name,
            email,
            password,
            phoneNumber: "00000000000",
            role: 'Admin'
        });

        res.status(200).json({
            success: true,
            message: 'Admin added successfully',
            admin
        });


    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }


}
