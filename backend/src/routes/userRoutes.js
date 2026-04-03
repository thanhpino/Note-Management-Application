const express = require('express');
const router = express.Router();
const { 
  getProfile, updateProfile, updateAvatar, changePassword, updatePreferences, clearNotification
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadAvatar } = require('../middlewares/uploadMiddleware');

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/avatar', uploadAvatar, updateAvatar);
router.put('/change-password', changePassword);
router.put('/preferences', updatePreferences);
router.put('/clear-notification', clearNotification);

module.exports = router;
