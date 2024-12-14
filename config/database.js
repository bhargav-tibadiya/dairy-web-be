const mongoose = require('mongoose')

const logger = require('../services/logger')
const ErrorResponse = require('../utils/errorResponse')

require('dotenv').config();

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    logger.info('Database Connection Successful');
  } catch (error) {
    logger.error(`Database Connection Failed: ${error.message}`);
    console.error(error);
    throw new ErrorResponse('Database Connection Failed', 500);
  }
};
