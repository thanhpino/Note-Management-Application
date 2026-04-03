const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT for Auth
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Generate an Activation/Reset Token (JWT with shorter expiry)
const generateTempToken = (email, type = 'activation') => {
  return jwt.sign({ email, type }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

// Compare Passwords
const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Generate 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  generateToken,
  generateTempToken,
  comparePassword,
  hashPassword,
  generateOTP
};
