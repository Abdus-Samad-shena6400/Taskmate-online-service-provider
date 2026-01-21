const express = require("express")
const router = express.Router();
const userRoute = require("./userRoute")
const serviceRoute = require("./serviceRoute")
const adminRoute = require("./adminRoute")

router.use('/users', userRoute)
router.use('/service', serviceRoute)
router.use('/admin', adminRoute)

module.exports = router;


