// --> Importing Dependencies <--
const mongoose = require('mongoose');
const mailSender = require('../services/mail');
const logger = require('../services/logger');
const ErrorResponse = require('../utils/errorResponse');

// --> Defining Schema for OTP <--
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required.'],
    match: [/\S+@\S+\.\S+/, 'Invalid email format.'],
  },
  otp: {
    type: String,
    required: [true, 'OTP is required.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  },
});

// --> Function to Send Verification Email <--
const sendVerificationEmail = async (email, otp) => {
  try {
    await mailSender(email, 'Verification Email from EduSpark', otp);
    logger.info(`Verification email sent successfully to ${email}`);
  } catch (error) {
    logger.error(`Error while sending verification email to ${email}: ${error.message}`);
    throw new ErrorResponse('Failed to send verification email.', 500); // Custom error
  }
};

// --> Middleware to Send OTP Email Before Saving <--
otpSchema.pre('save', async function (next) {
  try {
    await sendVerificationEmail(this.email, this.otp);
  } catch (error) {
    logger.error(`OTP pre-save middleware error: ${error.message}`);
    return next(error); // Pass the error to Mongoose's error handler
  }
  next();
});

// --> Exporting Schema as OTP <--
module.exports = mongoose.model('OTP', otpSchema);
