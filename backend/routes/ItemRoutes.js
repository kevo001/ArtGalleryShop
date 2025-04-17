const express = require('express');
const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');
const fs = require('fs');

const router = express.Router();

// Set up multer storage for local disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only image files are allowed (jpeg, png, webp)'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ✅ Create a new item with image
router.post('/items', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, size, year, dimension, category, artistId } = req.body;


    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const newItem = new Item({
      title,
      description,
      price,
      imageUrl: `/uploads/${req.file.filename}`,
      size,
      year,
      dimension,
      category,
      artist: artistId,
    });
    
    

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ Get all items (with populated artist data)
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find().populate('artist');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update an item (image update not included here)
router.put('/items/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, size, year, dimension, category, artistId } = req.body;

    const updateData = {
      title,
      description,
      price,
      size,
      year,
      dimension,
      category,
      artist: artistId,
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedItem);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(400).json({ error: error.message });
  }
});


// ✅ Delete an item (and optionally delete the image file)
router.delete('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Optional: Delete image from disk
    const filePath = path.join(__dirname, '..', item.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
