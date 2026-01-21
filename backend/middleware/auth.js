const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAuthenticatedUser = async (req, res, next) => {
    try {
        // // const authorizationHeader = req.headers['cookie'];
        // // const token = authorizationHeader ? authorizationHeader.split('=')[1] : null;

        // const authorizationHeader = req.headers['authorization'];
        // const token = authorizationHeader && authorizationHeader.split(' ')[1];

        const token = req.header("Authorization")?.split(" ")[1]?.trim();

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - Please login to continue." });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedData.id); // Ensure you handle the case when user is not found

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        req.user = {
            id: user._id,
            role: user.role, // Set the user's role
        };

        // req.user = {}; // Ensure req.user is initialized
        // req.user.id = decodedData.id; // Assign id from the token
        // req.user.id = decodedData.id;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }
};


// Authorization Middleware
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role: ${req.user.role} is not allowed to access this resource.`,
            });
        }
        next();
    };
};

