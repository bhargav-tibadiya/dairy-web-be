const logger = require('../services/logger');
const ErrorResponse = require('../utils/customResponse');


const Order = require('../models/order');
const Product = require('../models/product');

// --> Create a New Order <--
exports.createOrder = async (req, res, next) => {
  try {
    const { products, totalAmount, deliveryDate } = req.body;

    const userId = req?.user?.id;

    if (!userId) {
      logger.error(`No UserId Found`);
      return next(new ErrorResponse("No UserId Found", 400));
    }

    // Validate Required Fields
    if (!products || !totalAmount) {
      logger.error("Order creation failed: Missing required fields.");
      throw new ErrorResponse("Products and Total Amount are required.", 400);
    }

    // Create a New Order
    const newOrder = await Order.create({
      userId,
      products,
      totalAmount,
      deliveryDate,
    });

    logger.info(`Order created successfully: Order ID ${newOrder.id}`);
    res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: newOrder,
    });

  } catch (error) {
    logger.error("Error in createOrder: ", error.message);
    next(error);
  }
};

// --> Get All Orders (Admin) <--
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('userId').populate('products.productId');

    logger.info("All orders fetched successfully.");
    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orders,
    });

  } catch (error) {
    logger.error("Error in getAllOrders: ", error.message);
    next(error);
  }
};

// --> Get Single Order by ID <--
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      logger.error(`No Id Found`);
      return next(new ErrorResponse("No Id Found", 400));
    }

    const order = await Order.findById(id).populate('userId').populate('products.productId');

    if (!order) {
      logger.error(`Order with ID ${id} not found.`);
      return next(new ErrorResponse("Order not found.", 404));
    }

    logger.info(`Order with ID ${id} fetched successfully.`);
    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });

  } catch (error) {
    logger.error("Error in getOrderById: ", error.message);
    next(error);
  }
};

// --> Update Order Status <--
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      logger.error(`No Id Recieved From Params`);
      return next(new ErrorResponse("No Id Recieved From Params", 400));
    }

    if (!status || !['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      logger.error("Invalid or missing status in updateOrderStatus.");
      return next(new ErrorResponse("Invalid or missing status.", 400));
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      logger.error(`Order with ID ${id} not found for update.`);
      return next(new ErrorResponse("Order not found.", 404));
    }

    logger.info(`Order with ID ${id} updated successfully to status: ${status}.`);
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });

  } catch (error) {
    logger.error("Error in updateOrderStatus: ", error.message);
    next(error);
  }
};

// --> Delete an Order <--
exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      logger.error(`No Id Recieved From Params`);
      return next(new ErrorResponse("No Id Recieved From Params", 400));
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      logger.error(`Order with ID ${id} not found for deletion.`);
      return next(new ErrorResponse("Order not found.", 404));
    }

    logger.info(`Order with ID ${id} deleted successfully.`);
    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: deletedOrder,
    });

  } catch (error) {
    logger.error("Error in deleteOrder: ", error.message);
    next(error);
  }
};

// --> Get Orders for a Specific User (Optional) <--
exports.getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      logger.error(`No User Id Found`);
      return next(new ErrorResponse("No User Id Found", 400));
    }

    const userOrders = await Order.find({ userId }).populate('products.productId');

    logger.info(`Orders fetched successfully for user ID ${userId}.`);
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      data: userOrders,
    });

  } catch (error) {
    logger.error("Error in getUserOrders: ", error.message);
    next(error);
  }
};
