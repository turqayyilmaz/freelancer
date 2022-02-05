const express = require('express');
const { render } = require('express/lib/response');
const router = express.Router();
const loginController = require('../controllers/loginController');
const adminController = require('../controllers/adminController');
const portfolioRoutes = require("./portfolioRoutes")


router.route('/').get(adminController.getDashboardPage);
router.use('/portfolio', portfolioRoutes);

module.exports = router;
