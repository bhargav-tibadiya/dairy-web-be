const express = require('express');
const router = express.Router();
const { signup, login, sendOtp } = require('../controllers/auth');

// --> Route to Send OTP
router.post('/sendotp', sendOtp);

// --> Route for Signup
router.post('/signup', signup);

// --> Route for Login
router.post('/login', login);

module.exports = router;
