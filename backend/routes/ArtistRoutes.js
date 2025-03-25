const express = require('express');
const Artist = require('../models/Artist');

const router = express.Router();

// Create new artist
router.post('/artists', async (req, res) => {
  try {
    const newArtist = new Artist(req.body);
    await newArtist.save();
    res.status(201).json(newArtist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all artists
router.get('/artists', async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an artist
router.put("/artists/:id", async (req, res) => {
  try {
      const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedArtist);
  } catch (err) {
      console.error("Error updating artist:", err);
      res.status(500).json({ error: "Could not update artist" });
  }
});

// Delete an artist
router.delete('/artists/:id', async (req, res) => {
  try {
    await Artist.findByIdAndDelete(req.params.id);
    res.json({ message: 'Artist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;