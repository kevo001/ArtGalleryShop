// routes/ItemRoutes.js

const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const Item = require('../models/Item');

// Import Stripe
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// --- Cloudinary-backed Multer storage ---
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'art-gallery-items',
    format: async (req, file) => file.mimetype.split('/')[1],
    public_id: (req, file) => `item-${Date.now()}`,
  },
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
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Wrapper to catch Multer/Cloudinary errors
function handleMulterError(req, res, next) {
  upload.single('image')(req, res, err => {
    if (err) {
      console.error('⚠️ Upload error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}

// Create a new item with image
router.post('/', handleMulterError, async (req, res) => {
  try {
    const { title, description, price, size, year, dimension, category, artistId, quantity } = req.body;
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'Image is required' });
    }
    const newItem = new Item({ title, description, price, imageUrl: req.file.path, size, year, dimension, category, artist: artistId, quantity: Number(quantity) || 0 });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all items (with populated artist data) + Stripe catalog items
router.get('/', async (req, res) => {
  try {
    // 1) Load admin-created items
    const localItems = await Item.find().populate('artist');

    // 2) Fetch Stripe products
    const { data: products } = await stripe.products.list({ active: true });
    const productIds = products.map(p => p.id);

    // 3) Fetch all prices then filter by productIds
    const { data: allPrices } = await stripe.prices.list({ active: true, limit: 100 });
    const prices = allPrices.filter(price => productIds.includes(price.product));

    // 4) Shape Stripe entries
    const stripeItems = prices.map(price => {
      const prod = products.find(p => p.id === price.product);
      return {
        _id: price.id,
        title: prod.name,
        description: prod.description,
        imageUrl: prod.images[0] || null,
        price: (price.unit_amount / 100).toFixed(2),
        currency: price.currency,
        size: prod.metadata.size || null,
        year: prod.metadata.year || null,
        dimension: prod.metadata.dimension || null,
        category: prod.metadata.category || null,
        artist: prod.metadata.artistName ? { _id: null, name: prod.metadata.artistName } : null,
        stripePriceId: price.id,
        quantity: prod.metadata.stock
        ? Number(prod.metadata.stock)
        : null
      };
    });

    // 5) Merge sets
    const combined = [...localItems.map(item => item.toObject()), ...stripeItems];
    res.json(combined);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Failed to load items' });
  }
});

// Update an item
router.put('/:id', handleMulterError, async (req, res) => {
  try {
    const { title, description, price, size, year, dimension, category, artistId, quantity } = req.body;
    const updateData = { title, description, price, size, year, dimension, category, artist: artistId,  quantity: Number(quantity)  };
    if (req.file && req.file.path) updateData.imageUrl = req.file.path;
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedItem);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete an item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
