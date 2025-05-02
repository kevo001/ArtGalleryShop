// routes/ArtistRoutes.js

const express = require('express');
const multer  = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const Artist = require('../models/Artist');

const router = express.Router();

// 1) Configure Cloudinary-backed Multer storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'art-gallery-artists',
    format: async (req, file) => file.mimetype.split('/')[1],
    public_id: (req, file) => `artist-${Date.now()}`,
  },
});

// 2) Multer upload with fileFilter + size limits
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only jpeg, png or webp allowed'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// 3) POST /api/artists — create new artist, normalizing categories
router.post(
  '/',
  upload.single('image'),
  async (req, res) => {
    console.log('=== POST /api/artists ===');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    try {
      if (!req.file) {
        console.error('⚠️ No file found on req.file');
        return res.status(400).json({ error: 'No file received under field "image"' });
      }
      
      // Normalize incoming categories field into an array
      let { name, bio, categories } = req.body;
      if (typeof categories === 'string') {
        categories = [categories];
      } else if (!Array.isArray(categories)) {
        categories = [];
      }

      // Build and save new artist
      const newArtist = new Artist({
        name,
        bio,
        imageUrl: req.file.path,
        categories,                  // save the array of category IDs
      });

      await newArtist.save();
      // Populate categories before returning
      const populated = await newArtist.populate('categories');
      return res.status(201).json(populated);

    } catch (err) {
      console.error('‼️ Error inside POST /api/artists:', err.stack);
      return res.status(500).json({ error: err.message });
    }
  }
);

// 4) GET /api/artists — return all artists with populated categories
router.get('/', async (req, res) => {
  try {
    const artists = await Artist.find().populate('categories');
    res.json(artists);
  } catch (err) {
    console.error('Error fetching artists:', err);
    res.status(500).json({ error: err.message });
  }
});

// 5) GET /api/artists/:id — a single artist
router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id).populate('categories');
    if (!artist) return res.status(404).json({ message: 'Artist not found' });
    res.json(artist);
  } catch (err) {
    console.error('Error fetching artist by ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6) PUT /api/artists/:id — update artist, normalizing categories and optional new image
router.put(
  '/:id',
  upload.single('image'),
  async (req, res) => {
    console.log('=== PUT /api/artists/:id ===', req.params.id);
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    try {
      // Normalize incoming categories field into an array
      let { name, bio, categories } = req.body;
      if (typeof categories === 'string') {
        categories = [categories];
      } else if (!Array.isArray(categories)) {
        categories = [];
      }

      // Build update object
      const updateData = { name, bio, categories };
      if (req.file) {
        updateData.imageUrl = req.file.path;
      }

      // Perform update and populate categories
      const updated = await Artist.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).populate('categories');

      res.json(updated);
    } catch (err) {
      console.error('Error updating artist:', err);
      res.status(500).json({ error: err.message });
    }
  }
);

// 7) DELETE /api/artists/:id — delete an artist
router.delete('/:id', async (req, res) => {
  try {
    await Artist.findByIdAndDelete(req.params.id);
    res.json({ message: 'Artist deleted successfully' });
  } catch (err) {
    console.error('Error deleting artist:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
