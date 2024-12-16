const jwt = require('jsonwebtoken');

const logger = require('../services/logger');
const ErrorResponse = require('../utils/customResponse');

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.body?.token ||
      (req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null);


    if (!token) {
      logger.warn('Authentication failed: Token is missing');
      return next(new ErrorResponse('Authentication failed: Token is missing', 401));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      logger.info(`Authentication successful for user ID: ${decoded.id}`);
    } catch (error) {
      logger.error('Authentication failed: Invalid or expired token');
      return next(new ErrorResponse('Authentication failed: Invalid or expired token', 401));
    }

    next();
  } catch (error) {
    logger.error(`Error occurred in authentication middleware: ${error.message}`);
    return next(new ErrorResponse('Internal server error during authentication', 500));
  }
};

exports.isUser = (req, res, next) => {
  try {
    if (req.user.role !== 'user') {
      logger.warn(`Access denied: User role required, but role is ${req.user.role}`);
      return next(new ErrorResponse('Access denied: User role required', 403));
    }

    logger.info(`Access granted to user ID: ${req.user.id} with role: ${req.user.role}`);
    next();
  } catch (error) {
    logger.error(`Error in isUser middleware: ${error.message}`);
    return next(new ErrorResponse('Error in isUser middleware', 500));
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      logger.warn(`Access denied: Admin role required, but role is ${req.user.role}`);
      return next(new ErrorResponse('Access denied: Admin role required', 403));
    }

    logger.info(`Access granted to admin ID: ${req.user.id}`);
    next(); // Allow access
  } catch (error) {
    logger.error(`Error in isAdmin middleware: ${error.message}`);
    return next(new ErrorResponse('Error in isAdmin middleware', 500));
  }
};
