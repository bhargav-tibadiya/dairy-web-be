const Product = require('../models/product');
const logger = require('../services/logger');
const ErrorResponse = require('../utils/customResponse');


const { uploadImageToCloudinary } = require('../utils/imageUploader');

// POST
exports.addProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const imageFile = req.files?.imageFile;

    if (!name || !description || !price || !category || !stock || !imageFile) {
      logger.warn("Missing required fields in addProduct request.");
      return next(new ErrorResponse("Please fill all fields, including the image.", 400));
    }

    let imageUrl;
    try {
      const imageUploadResult = await uploadImageToCloudinary(imageFile, 'products', { quality: 80 });
      imageUrl = imageUploadResult.secure_url;
    } catch (error) {
      logger.error(`Error uploading image to Cloudinary: ${error.message}`);
      return next(new ErrorResponse("Error uploading image. Please try again.", 500));
    }
    
    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: imageUrl,
    });

    logger.info(`Product created successfully: ${newProduct.name}`);

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: newProduct,
    });
  } catch (error) {
    logger.error(`Error creating product: ${error.message}`);
    next(error);
  }
};

// PATCH
exports.editProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const { name, description, price, category, stock } = req.body;
    const imageFile = req.files?.image;

    const product = await Product.findById(productId);
    if (!product) {
      logger.warn(`Product with ID ${productId} not found.`);
      return next(new ErrorResponse("Product not found.", 404));
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;

    if (imageFile) {
      try {
        const imageUploadResult = await uploadImageToCloudinary(imageFile, 'products', { quality: 80 });
        product.image = imageUploadResult.secure_url;
      } catch (error) {
        logger.error(`Error uploading image to Cloudinary: ${error.message}`);
        return next(new ErrorResponse("Error uploading image. Please try again.", 500));
      }
    }

    const updatedProduct = await product.save();

    logger.info(`Product updated successfully: ${updatedProduct.name}`);

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    logger.error(`Error updating product: ${error.message}`);
    next(error);
  }
};

// DELETE
exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      logger.warn(`Product with ID ${productId} not found.`);
      return next(new ErrorResponse("Product not found.", 404));
    }

    await product.deleteOne();

    logger.info(`Product deleted successfully: ID ${productId}`);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    logger.error(`Error deleting product: ${error.message}`);
    next(error);
  }
};

// GET
exports.getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      logger.warn(`Product with ID ${productId} not found.`);
      return next(new ErrorResponse("Product not found.", 404));
    }

    logger.info(`Fetched product details for ID ${productId}`);

    res.status(200).json({
      success: true,
      message: "Product fetched successfully.",
      data: product,
    });
  } catch (error) {
    logger.error(`Error fetching product by ID: ${error.message}`);
    next(error);
  }
};

// GET
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    
    logger.info(`Fetched all products (${products.length} items)`);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      data: products,
    });
  } catch (error) {
    logger.error(`Error fetching all products: ${error.message}`);
    next(error);
  }
};
