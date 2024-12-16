// packages
const express = require('express')
const fileUpload = require('express-fileupload')

// config and mmiddlewares
const { connectDB } = require('./config/database')
const { cloudinaryConnect } = require('./config/cloudinary')
const errorHandler = require('./middlewares/errorhandler')

const dotenv = require('dotenv')
dotenv.config()

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');

const app = express();

connectDB();
cloudinaryConnect();

app.use(express.json());

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './ExpressFileUpload/'
}))

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/order', orderRoutes);

// Use the custom error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
