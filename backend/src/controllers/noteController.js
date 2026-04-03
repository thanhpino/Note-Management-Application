const Note = require('../models/noteModel');
const User = require('../models/userModel');
const cloudinary = require('cloudinary').v2;
const { hashPassword, comparePassword } = require('../utils/helpers');

// Helper to check access
const checkAccess = (note, userId, requireEdit = false) => {
  if (note.userId.toString() === userId) return true;
  const share = note.sharedWith.find(s => s.userId.toString() === userId);
  if (!share) return false;
  if (requireEdit && share.permission !== 'edit') return false;
  return true;
};

exports.getNotes = async (req, res, next) => {
  try {
    const { q, label } = req.query;
    let query = { userId: req.user.id };

    if (q) query.$text = { $search: q };
    if (label) query.labels = label;

    const notes = await Note.find(query).sort({ isPinned: -1, pinnedAt: -1, updatedAt: -1 });
    res.json(notes);
  } catch (error) { next(error); }
};

exports.getSharedNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ 'sharedWith.userId': req.user.id }).populate('userId', 'displayName email').sort('-updatedAt');
    res.json(notes);
  } catch (error) { next(error); }
};

exports.createNote = async (req, res, next) => {
  try {
    const { title, content, labels } = req.body;
    const note = await Note.create({ userId: req.user.id, title, content, labels });
    res.status(201).json(note);
  } catch (error) { next(error); }
};

exports.updateNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (!checkAccess(note, req.user.id, true)) return res.status(403).json({ message: 'Not authorized' });

    Object.assign(note, req.body);
    if (req.body.isPinned && !note.pinnedAt) note.pinnedAt = Date.now();
    await note.save();

    res.json(note);
  } catch (error) { next(error); }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found or unauthorized' });

    // Delete images from Cloudinary
    for (const imageUrl of note.images) {
      const urlParts = imageUrl.split('/');
      if (urlParts.length > 2) {
        const publicIdWithExt = `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;
        const publicId = publicIdWithExt.split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(() => { });
      }
    }

    res.json({ message: 'Note removed' });
  } catch (error) { next(error); }
};

exports.togglePin = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.isPinned = !note.isPinned;
    note.pinnedAt = note.isPinned ? Date.now() : undefined;
    await note.save();
    res.json(note);
  } catch (error) { next(error); }
};

// IMAGES
exports.uploadImages = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || !checkAccess(note, req.user.id, true)) return res.status(403).json({ message: 'Not authorized' });

    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No images uploaded' });

    const imageUrls = req.files.map(f => f.path);
    note.images.push(...imageUrls);
    await note.save();

    res.json(note);
  } catch (error) { next(error); }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const { id: noteId } = req.params;
    const { url: imageId } = req.query;
    if (!imageId) return res.status(400).json({ message: 'Image URL required' });
    const decodedUrl = decodeURIComponent(imageId);


    const note = await Note.findById(noteId);
    if (!note || !checkAccess(note, req.user.id, true)) return res.status(403).json({ message: 'Not authorized' });

    const urlParts = decodedUrl.split('/');
    const publicIdWithExt = `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;
    const publicId = publicIdWithExt.split('.')[0];

    await cloudinary.uploader.destroy(publicId).catch(() => { });
    
    // Use protocol-agnostic and query-param-agnostic matching
    const normalize = (u) => u.replace(/^https?:\/\//, '').split('?')[0].trim();
    const target = normalize(decodedUrl);
    
    note.images = note.images.filter(img => normalize(img) !== target);
    await note.save();


    res.json(note);

  } catch (error) { next(error); }
};

// PASSWORD LOCK
exports.enableLock = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.isPasswordProtected = true;
    note.notePasswordHash = await hashPassword(password);
    await note.save();
    res.json({ message: 'Note locked successfully' });
  } catch (error) { next(error); }
};

exports.changeLock = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (!(await comparePassword(currentPassword, note.notePasswordHash))) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    note.notePasswordHash = await hashPassword(newPassword);
    await note.save();
    res.json({ message: 'Note password changed successfully' });
  } catch (error) { next(error); }
};

exports.disableLock = async (req, res, next) => {
  try {
    const { currentPassword } = req.body;
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (!(await comparePassword(currentPassword, note.notePasswordHash))) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    note.isPasswordProtected = false;
    note.notePasswordHash = undefined;
    await note.save();
    res.json({ message: 'Note unlocked successfully' });
  } catch (error) { next(error); }
};

exports.verifyPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (!(await comparePassword(password, note.notePasswordHash))) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    // Return a temporary token or simple success response
    res.json({ message: 'Password verified', tempAccess: true });
  } catch (error) { next(error); }
};

// SHARING
exports.shareNote = async (req, res, next) => {
  try {
    const { email, permission } = req.body;
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const recipient = await User.findOne({ email });
    if (!recipient) return res.status(404).json({ message: 'User not found' });
    if (recipient._id.toString() === req.user.id) return res.status(400).json({ message: 'Cannot share with yourself' });

    const existingShare = note.sharedWith.find(s => s.userId.toString() === recipient.id);
    if (existingShare) {
      existingShare.permission = permission;
    } else {
      note.sharedWith.push({ userId: recipient._id, permission });
    }
    await note.save();

    // Notify recipient
    recipient.hasUnreadShareNotification = true;
    await recipient.save();

    res.json({ message: 'Note shared successfully' });
  } catch (error) { next(error); }
};

exports.getShares = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id }).populate('sharedWith.userId', 'email displayName');
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note.sharedWith);
  } catch (error) { next(error); }
};

exports.updateShare = async (req, res, next) => {
  try {
    const { permission } = req.body;
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const share = note.sharedWith.find(s => s.userId.toString() === req.params.uid);
    if (!share) return res.status(404).json({ message: 'User not in share list' });

    share.permission = permission;
    await note.save();
    res.json({ message: 'Share permission updated' });
  } catch (error) { next(error); }
};

exports.revokeShare = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.sharedWith = note.sharedWith.filter(s => s.userId.toString() !== req.params.uid);
    await note.save();
    res.json({ message: 'Share access revoked' });
  } catch (error) { next(error); }
};

// LABELS
exports.attachLabel = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || !checkAccess(note, req.user.id, true)) return res.status(403).json({ message: 'Not authorized' });

    if (!note.labels.includes(req.params.lid)) {
      note.labels.push(req.params.lid);
      await note.save();
    }
    res.json(note);
  } catch (error) { next(error); }
};

exports.detachLabel = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || !checkAccess(note, req.user.id, true)) return res.status(403).json({ message: 'Not authorized' });

    note.labels = note.labels.filter(l => l.toString() !== req.params.lid);
    await note.save();
    res.json(note);
  } catch (error) { next(error); }
};
