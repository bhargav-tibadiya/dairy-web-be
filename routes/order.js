const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middlewares/auth');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getUserOrders,
} = require('../controllers/order');

// User Routes
router.post('/', auth, createOrder);
router.get('/userorders', auth, getUserOrders);

// Admin Routes
router.get('/', auth, isAdmin, getAllOrders);
router.get('/:id', auth, isAdmin, getOrderById);
router.patch('/:id', auth, isAdmin, updateOrderStatus);
router.delete('/:id', auth, isAdmin, deleteOrder);

module.exports = router;
