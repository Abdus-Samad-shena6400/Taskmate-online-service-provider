const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.registerUser = async (req, res) => {
    const { name, email, password, phoneNumber, role } = req.body;

    // Basic validations
    if (!name || !email || !password || !phoneNumber || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password should be at least 8 characters long" });
    }

    const validRoles = ['Consumer', 'Provider', 'Admin'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    try {
        // More efficient check for existing user by email or phone number
        const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: "User already exists with this email" });
            }
            if (existingUser.phoneNumber === phoneNumber) {
                return res.status(400).json({ message: "User already exists with this phone number" });
            }
        }

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            password,
            role,
            phoneNumber: phoneNumber,
        });

        // Save the new user
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        console.error(error);
        // This is a robust fallback for race conditions or other unique index violations
        if (error.code === 11000) {
            if (error.keyPattern.email) {
                return res.status(400).json({ message: "User already exists with this email" });
            }
            if (error.keyPattern.phoneNumber) {
                return res.status(400).json({ message: "User already exists with this phone number" });
            }
            return res.status(400).json({ message: "A user with the given email or phone number already exists." });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};


// Login 
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Checking if user has given both password and email
    if (!email || !password) {
        return res.status(400).json({ message: "Please Enter Email and Password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordMatched = await user.comparePassword(password); // Ensure this is awaited

    if (!isPasswordMatched) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Send JWT token as response
    sendToken(user, 200, res);
}

// Logout 
exports.logoutUser = async (req, res) => {

    console.log("here")
    res.removeHeader('Authorization');
    // res.cookie('token', '', { expires: new Date(0), httpOnly: true });


    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
}

exports.getUser = async (req, res) => {
    try {

        // Validate that user ID exists
        if (!req.user || !req.user.id) {
            return res.status(400).json({
                success: false,
                message: "User ID is missing"
            });
        }

        // Fetch user from database
        const user = await User.findById(req.user.id);

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Send successful response
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        // Catch any errors
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the user",
            error: error.message
        });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the user",
            error: error.message
        });
    }
};

exports.editUser = async (req, res) => {
    try {
        const { name, phoneNumber } = req.body;
        const userId = req.user.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, phoneNumber },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return res.status(500).json({ message: error.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ message: "Reset Password Token is invalid or has been expired" });
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ message: "Password does not password" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
};
