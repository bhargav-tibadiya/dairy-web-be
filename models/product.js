const mongoose = require('mongoose')


// Define Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide the product price'],
      min: [0, 'Price cannot be less than 0'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a product category'],
      enum: ['Dairy', 'Bakery', 'Frozen', 'Beverages'],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide the stock quantity'],
      min: [0, 'Stock cannot be less than 0'],
    },
    image: {
      type: String,
      required: [true, 'Please provide a product image URL'],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

