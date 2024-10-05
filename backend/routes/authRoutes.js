const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route Signup
router.post('/signup', authController.signup);

// Route Login
router.post('/login', authController.login);

module.exports = router;
