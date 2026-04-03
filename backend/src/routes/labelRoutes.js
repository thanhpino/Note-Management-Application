const express = require('express');
const router = express.Router();
const { getLabels, createLabel, updateLabel, deleteLabel } = require('../controllers/labelController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getLabels)
  .post(createLabel);

router.route('/:id')
  .put(updateLabel)
  .delete(deleteLabel);

module.exports = router;
