const express = require('express')
const rateIssueRoutes = require('./rate_issue').routes

const router = express.Router({mergeParams: true})
router.use('/rate_issue', rateIssueRoutes)

module.exports = router