const express = require('express')

const { connectDB } = require('./config/database')
const errorHandler = require('./middlewares/errorhandler')

const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON request body
app.use(express.json());

// Routes
// app.use('/api/products', productRoutes);

// Use the custom error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
