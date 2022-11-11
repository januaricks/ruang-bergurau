const express = require('express')
const Controller = require('../controller/controller')
const router = express.Router()

router.get('/', Controller.redirectLogin)

const adminRoutes = require('./admin')
router.use('/admin', adminRoutes)

const usersRoutes = require('./user')
router.use('/users', usersRoutes)



module.exports = router