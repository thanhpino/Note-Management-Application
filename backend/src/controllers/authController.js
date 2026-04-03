const User = require('../models/userModel');
const { hashPassword, comparePassword, generateToken, generateTempToken, generateOTP } = require('../utils/helpers');
const sendEmail = require('../services/emailService');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res, next) => {
  try {
    let { email, displayName, password, confirmPassword } = req.body;
    if (!email || !displayName || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    email = email.toLowerCase().trim();

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPwd = await hashPassword(password);
    const activationToken = generateTempToken(email, 'activation');

    const user = await User.create({
      email,
      displayName,
      passwordHash: hashedPwd,
      activationToken,
    });

    // Send Activation Email
    const activationUrl = `${process.env.FRONTEND_URL}/activate/${activationToken}`;
    await sendEmail({
      email: user.email,
      subject: 'Activate Your Notes Account',
      html: `<p>Please click the link to activate your account: <a href="${activationUrl}">${activationUrl}</a></p>`,
    });

    res.status(201).json({
      _id: user.id,
      displayName: user.displayName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      token: generateToken(user._id),
      message: 'Account created. Please check your email for activation link.',
    });
  } catch (error) {
    next(error);
  }
};

exports.resendActivation = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    user.activationToken = generateTempToken(user.email, 'activation');
    await user.save();

    const activationUrl = `${process.env.FRONTEND_URL}/activate/${user.activationToken}`;
    await sendEmail({
      email: user.email,
      subject: 'Activate Your Notes Account',
      html: `<p>Please click the link to activate your account: <a href="${activationUrl}">${activationUrl}</a></p>`,
    });

    res.json({ message: 'Activation email resent' });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    email = email.toLowerCase().trim();
    const user = await User.findOne({ email });


    if (user && (await comparePassword(password, user.passwordHash))) {
      res.json({
        _id: user.id,
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

exports.activateAccount = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.isVerified && user.activationToken !== token) {
      // If verified, avoid StrictMode double-fire failure
      return res.json({ message: 'Account successfully activated' });
    }

    if (user.activationToken !== token) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.activationToken = undefined;
    await user.save();

    res.json({ message: 'Account successfully activated' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    email = email.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    user.resetOTP = otp;
    user.resetExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'Password Reset OTP',
      html: `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    let { email, otp } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    email = email.toLowerCase().trim();
    const user = await User.findOne({ email, resetOTP: otp, resetExpiry: { $gt: Date.now() } });


    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });
    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    let { email, otp, newPassword, confirmPassword } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    email = email.toLowerCase().trim();
    if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    const user = await User.findOne({ email, resetOTP: otp, resetExpiry: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.passwordHash = await hashPassword(newPassword);
    user.resetOTP = undefined;
    user.resetExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

exports.logoutUser = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
