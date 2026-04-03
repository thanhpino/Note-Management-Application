const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  displayName: { type: String, required: true },
  passwordHash: { type: String, required: true }, 
  avatarUrl: { type: String, default: null },
  isVerified: { type: Boolean, default: false }, 
  activationToken: { type: String },
  resetOTP: { type: String }, 
  resetExpiry: { type: Date },
  preferences: {
    fontSize: { type: String, default: 'medium' }, 
    noteColor: { type: String, default: '#ffffff' }, 
    theme: { type: String, enum: ['light', 'dark'], default: 'light' } 
  },
  hasUnreadShareNotification: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
