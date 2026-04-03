const Label = require('../models/labelModel');
const Note = require('../models/noteModel');

exports.getLabels = async (req, res, next) => {
  try {
    const labels = await Label.find({ userId: req.user.id }).sort('-createdAt');
    res.json(labels);
  } catch (error) { next(error); }
};

exports.createLabel = async (req, res, next) => {
  try {
    const { name } = req.body;
    const label = await Label.create({ userId: req.user.id, name });
    res.status(201).json(label);
  } catch (error) { next(error); }
};

exports.updateLabel = async (req, res, next) => {
  try {
    const { name } = req.body;
    const label = await Label.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name },
      { new: true }
    );
    if (!label) return res.status(404).json({ message: 'Label not found' });
    res.json(label);
  } catch (error) { next(error); }
};

exports.deleteLabel = async (req, res, next) => {
  try {
    const labelId = req.params.id;
    const label = await Label.findOneAndDelete({ _id: labelId, userId: req.user.id });
    if (!label) return res.status(404).json({ message: 'Label not found' });

    // Pull the deleted label from all user's notes
    await Note.updateMany(
      { userId: req.user.id },
      { $pull: { labels: labelId } }
    );
    res.json({ message: 'Label deleted successfully' });
  } catch (error) { next(error); }
};
