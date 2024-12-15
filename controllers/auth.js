const OTP = require('../models/otp');
const User = require('../models/user');

const logger = require('../services/logger');
const ErrorResponse = require('../utils/errorResponse');
const { generateOtp } = require('../utils/helper');

exports.sendOtp = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      logger.warn(`Attempt to send OTP to an existing email: ${email}`);
      return next(new ErrorResponse('Email already registered', 400));
    }

    const otp = generateOtp();
    logger.info(`OTP ${otp} created for email: ${email}`)

    await OTP.create({ email, otp });

    logger.info(`OTP ${otp} created and sent to email: ${email}`);

    // TODO Remove Otp when deplyoing
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: { email, otp },
    });
  } catch (error) {
    logger.error(`Error sending OTP to ${email}: ${error.message}`);
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  const { name, email, password, phone, address, otp } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Signup attempt with existing email: ${email}`);
      return next(new ErrorResponse('Email is already registered', 400));
    }

    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) {
      logger.warn(`Invalid or expired OTP for email: ${email}`);
      return next(new ErrorResponse('Invalid or expired OTP', 400));
    }

    const user = await User.create({ name, email, password, phone, address });

    logger.info(`New user registered: ${email}`);

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });

    await OTP.deleteOne({ email });
  } catch (error) {
    logger.error(`Error during signup for email ${email}: ${error.message}`);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      logger.warn(`Login attempt with unregistered email: ${email}`);
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      logger.warn(`Invalid password attempt for email: ${email}`);
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    logger.info(`User logged in successfully: ${email}`);

    const token = user.getSignedJwtToken();

    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    res
      .status(200)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        },
      });
  } catch (error) {
    logger.error(`Error during login for email ${email}: ${error.message}`);
    next(error);
  }
};

