// --> Import Dependencies <--
const express = require('express');
const {
  addProduct,
  editProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
} = require('../controllers/product');
const { auth } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/auth');

const router = express.Router();


// Add a New Product (Only Admins)
router.post('/add', auth, isAdmin, addProduct);

// Edit an Existing Product (Only Admins)
router.patch('/edit/:productId', auth, isAdmin, editProduct);

// Delete a Product (Only Admins)
router.delete('/delete/:productId', auth, isAdmin, deleteProduct);

// Get a Product by ID (Authenticated Users)
router.get('/get/:productId', auth, getProductById);

// Get All Products (Authenticated Users)
router.get('/getall', auth, getAllProducts);

// Export Router
module.exports = router;
