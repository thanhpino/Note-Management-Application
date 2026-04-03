const express = require('express');
const router = express.Router();
const { 
  registerUser, loginUser, activateAccount, forgotPassword, verifyOtp, resetPassword, logoutUser
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/activate/:token', activateAccount);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/resend-activation', protect, require('../controllers/authController').resendActivation);

module.exports = router;
