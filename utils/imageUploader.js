const cloudinary = require("cloudinary").v2;

const logger = require('../services/logger')
const ErrorResponse = require('./customResponse')

exports.uploadImageToCloudinary = async (file, folder, options = {}) => {
  try {
    // Base options for upload
    const uploadOptions = {
      folder,
      resource_type: "auto"
    };

    // Adding optional transformations
    if (options.height) {
      uploadOptions.height = options.height;
    }
    if (options.quality) {
      uploadOptions.quality = options.quality;
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, uploadOptions);

    logger.info(`Image uploaded successfully to Cloudinary. Public ID: ${result.public_id}`);
    return result;
  } catch (error) {
    logger.error(`Failed to upload image to Cloudinary: ${error.message}`);
    throw new ErrorResponse("Error uploading image. Please try again.", 500);
  }
};