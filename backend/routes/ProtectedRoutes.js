// routes/ProtectedRoutes.js
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Item from '../models/Item.js';   // or whatever model you’re protecting
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.use(authMiddleware);  // must present a valid JWT
router.use(isAdmin);         // …and the token must have isAdmin: true

// GET /api/protected/items
// Only authenticated users (with a valid JWT in the accessToken cookie) can hit this.
router.get('/items', async (req, res) => {
  try {
    // `req.user` is already populated by authMiddleware;
    // isAdmin has confirmed req.user.isAdmin === true
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error('Error fetching protected items:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;