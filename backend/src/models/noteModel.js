const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  color: { type: String, default: '' },
  images: [{ type: String }],
  labels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }],
  isPinned: { type: Boolean, default: false },
  pinnedAt: { type: Date },
  isPasswordProtected: { type: Boolean, default: false },
  notePasswordHash: { type: String }, 
  sharedWith: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    permission: { type: String, enum: ['view', 'edit'], required: true },
    sharedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

noteSchema.index({ title: 'text', content: 'text' });
noteSchema.index({ userId: 1, labels: 1 });
noteSchema.index({ userId: 1, isPinned: -1, pinnedAt: -1, updatedAt: -1 });

module.exports = mongoose.model('Note', noteSchema);
