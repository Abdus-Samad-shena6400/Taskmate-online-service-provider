const express = require("express")
const { createService, getAllServices, getServiceById, updateService, deleteService, addReview, getAllUserServices, getAllConsumerServices, getAllProviderServices, getServiceByIdForProvider, markServiceCompleted, getServiceByIdForConsumer, completedServicesForConsumer, consumerSubmitReview } = require("../controllers/serviceController")
const { isAuthenticatedUser } = require("../middleware/auth")

const router = express.Router()

// Conusmer Routes
router.route("/createService").post(isAuthenticatedUser, createService)
router.route("/consumer-services").get(isAuthenticatedUser, getAllConsumerServices)
router.route("/provider-services").get(isAuthenticatedUser, getAllProviderServices)
router.route("/provider/services/:id").get(isAuthenticatedUser, getServiceByIdForProvider)
router.route("/consumer/services/:id").get(isAuthenticatedUser, getServiceByIdForConsumer)
router.route("/complete-services").put(isAuthenticatedUser, markServiceCompleted)
router.route("/consumer/completed-services").get(isAuthenticatedUser, completedServicesForConsumer)
router.route("/consumer/review").put(isAuthenticatedUser, consumerSubmitReview)

// Provider Routes

router.route("/").get(isAuthenticatedUser, getAllServices)


router.post("/:id/review", addReview); // Add a review to a service

router.route("/:id").get(getServiceById).put(updateService).delete(deleteService)

module.exports = router;