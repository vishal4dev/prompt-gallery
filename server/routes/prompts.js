const express = require('express');
const Prompt = require('../models/Prompt');

const router = express.Router();

// List prompts (newest first)
router.get('/', async (req, res) => {
  try {
    const prompts = await Prompt.find({}).sort({ createdAt: -1 }).lean();
    res.json(prompts.map((p) => ({ ...p, id: p._id, _id: undefined })));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// Create prompt
router.post('/', async (req, res) => {
  try {
    const { title, content, category, tags, isFavorite } = req.body;
    const doc = await Prompt.create({
      title,
      content,
      category: category || 'Other',
      tags: Array.isArray(tags) ? tags : [],
      isFavorite: Boolean(isFavorite),
      lastUsed: new Date()
    });
    res.status(201).json(doc.toJSON());
  } catch (e) {
    res.status(400).json({ error: 'Failed to create prompt' });
  }
});

// Replace prompt (PUT)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body || {};
    const doc = await Prompt.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc.toJSON());
  } catch (e) {
    res.status(400).json({ error: 'Failed to update prompt' });
  }
});

// Partial update (PATCH)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body || {};
    const doc = await Prompt.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc.toJSON());
  } catch (e) {
    res.status(400).json({ error: 'Failed to update prompt' });
  }
});

// Delete prompt
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Prompt.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (e) {
    res.status(400).json({ error: 'Failed to delete prompt' });
  }
});

// Increment use count
router.post('/:id/use', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Prompt.findByIdAndUpdate(
      id,
      { $inc: { useCount: 1 }, $set: { lastUsed: new Date() } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc.toJSON());
  } catch (e) {
    res.status(400).json({ error: 'Failed to update usage' });
  }
});

module.exports = router;

