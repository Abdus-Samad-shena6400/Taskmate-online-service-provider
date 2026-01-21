const express = require("express");
const { registerUser, logoutUser, loginUser, getUser, deleteUser, forgotPassword, resetPassword } = require("../controllers/userController");
const { editUser } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)
router.route("/user-data").get(isAuthenticatedUser, getUser);
router.route("/").delete(deleteUser).put(isAuthenticatedUser, editUser)

// Forgot password (send reset link)
router.route('/password/forgot').post(forgotPassword);

// Reset password using token (no auth required)
router.route('/password/reset/:token').put(resetPassword);


module.exports = router;
