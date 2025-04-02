const express = require('express');
const Item = require('../models/Item');

const router = express.Router();

// Create a new item
router.post('/items', async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      imageUrl,
      size,
      category,
      artistId,
    } = req.body;

    const newItem = new Item({
      title,
      description,
      price,
      imageUrl,
      size,
      category,
      artist: artistId, // Store artistId in the 'artist' field
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all items (with populated artist data)
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find().populate('artist'); // <-- Important fix
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an item
router.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an item
router.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;