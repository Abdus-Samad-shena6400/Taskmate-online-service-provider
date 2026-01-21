const express = require("express");
const { adminDashboard, getAllProviders, getAllConsumers, getAllServices, getAllUnassignedServices, getAllAssignedServices, getAllCompletedServices, AssignServiceToProvider, deleteService, deleteUser, unAssignService, addAdmin } = require("../controllers/AdminController");
const router = express.Router();

router.route("/").get(adminDashboard)
router.route("/all-consumers").get(getAllConsumers)
router.route("/all-providers").get(getAllProviders)

router.route("/all-services").get(getAllServices)

router.route("/unassigned-services").get(getAllUnassignedServices)
router.route("/assigned-services").get(getAllAssignedServices)
router.route("/completed-services").get(getAllCompletedServices)

router.route("/assign-service").put(AssignServiceToProvider)

router.route("/un-assigned-services").put(unAssignService)

router.route("/delete-service/:id").delete(deleteService)
router.route("/delete-user/:id").delete(deleteUser)

router.route("/add-admin").post(addAdmin)





module.exports = router;
