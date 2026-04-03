const User = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/helpers');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -resetOTP -activationToken -resetExpiry');
    res.json(user);
  } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { displayName: req.body.displayName }, { new: true }).select('-passwordHash');
    res.json(user);
  } catch (error) { next(error); }
};

exports.updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const avatarUrl = req.file.path;
    const user = await User.findByIdAndUpdate(req.user.id, { avatarUrl }, { new: true }).select('-passwordHash');
    res.json(user);
  } catch (error) { next(error); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!(await comparePassword(currentPassword, user.passwordHash))) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) { next(error); }
};

exports.updatePreferences = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { $set: { preferences: req.body } }, 
      { new: true }
    ).select('-passwordHash');
    res.json(user.preferences);
  } catch (error) { next(error); }
};

exports.clearNotification = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { hasUnreadShareNotification: false });
    res.json({ message: 'Notification cleared' });
  } catch (error) { next(error); }
};
