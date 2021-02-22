const express = require('express')
const coverageRoutes = require('./rate').routes

const router = express.Router({mergeParams: true})
router.use('/coverages', coverageRoutes)

module.exports = router