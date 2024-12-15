// packages
const express = require('express')

// config and mmiddlewares
const { connectDB } = require('./config/database')
const errorHandler = require('./middlewares/errorhandler')

// Routes
const authRoutes = require('./routes/auth');

const app = express();

connectDB();

app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);

// Use the custom error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
