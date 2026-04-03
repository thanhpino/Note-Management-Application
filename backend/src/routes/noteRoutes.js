const express = require('express');
const router = express.Router();
const {
  getNotes, getSharedNotes, createNote, updateNote, deleteNote, togglePin,
  uploadImages, deleteImage, enableLock, changeLock, disableLock, verifyPassword,
  shareNote, getShares, updateShare, revokeShare, attachLabel, detachLabel
} = require('../controllers/noteController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadNoteImages } = require('../middlewares/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getNotes)
  .post(createNote);

router.get('/shared-with-me', getSharedNotes);

router.route('/:id')
  .put(updateNote)
  .delete(deleteNote);

router.put('/:id/pin', togglePin);

// Images
router.post('/:id/images', uploadNoteImages, uploadImages);
router.delete('/:id/images', deleteImage);


// Locks
router.post('/:id/lock', enableLock);
router.put('/:id/lock', changeLock);
router.delete('/:id/lock', disableLock);
router.post('/:id/verify-password', verifyPassword);

// Shares
router.route('/:id/shares')
  .get(getShares)
  .post(shareNote);
router.route('/:id/shares/:uid')
  .put(updateShare)
  .delete(revokeShare);

// Labels
router.route('/:id/labels/:lid')
  .post(attachLabel)
  .delete(detachLabel);

module.exports = router;
