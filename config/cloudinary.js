const cloudinary = require("cloudinary").v2;
const ErrorResponse = require("../utils/customResponse");
const logger = require("../services/logger");

exports.cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    logger.info("Cloudinary connection successful.");
  } catch (error) {
    logger.error(`Cloudinary connection failed: ${error.message}`);
    throw new ErrorResponse("Cloudinary configuration failed", 500);
  }
};
