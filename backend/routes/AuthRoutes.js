// routes/AuthRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Joi from 'joi';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Input validation schemas
const signupSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
const loginSchema = signupSchema;

// Debug endpoint
router.get('/debug/:email', async (req, res) => {
  try {
    const u = await User.findOne({ email: req.params.email });
    if (!u) return res.status(404).json({ message: 'User not found' });
    return res.json({ email: u.email, isAdmin: u.isAdmin });
  } catch (err) {
    console.error('Debug error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Signup
router.post('/signup', async (req, res) => {
  const { error, value } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const { email, password } = value;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'E-post er allerede i bruk.' });
    }
    const hash = await bcrypt.hash(password, 12);
    await new User({ email, password: hash }).save();
    res.status(201).json({ message: 'Bruker registrert!' });
  } catch (e) {
    console.error('Error during signup:', e);
    res.status(500).json({ message: 'Server error på registrering' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const { email, password } = value;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Ugyldige innloggingsdata' });
    }
    const accessToken = jwt.sign(
      { user: { id: user._id, email: user.email, isAdmin: user.isAdmin || false } },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = crypto.randomBytes(64).toString('hex');
    await RefreshToken.create({
      token:     refreshToken,
      user:      user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Return tokens in JSON response
    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
    });
  } catch (e) {
    console.error('Error during login:', e);
    res.status(500).json({ message: 'Server error på pålogging' });
  }
});

// Refresh Token
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token mangler' });
  try {
    const doc = await RefreshToken.findOne({ token: refreshToken }).populate('user');
    if (!doc || doc.expiresAt < new Date()) {
      return res.status(403).json({ message: 'Refresh token ugyldig eller utløpt' });
    }
    await doc.deleteOne();
    const newRefreshToken = crypto.randomBytes(64).toString('hex');
    await RefreshToken.create({
      token:     newRefreshToken,
      user:      doc.user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    const accessToken = jwt.sign(
      { user: { id: doc.user._id, email: doc.user.email, isAdmin: doc.user.isAdmin } },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Return new tokens in JSON response
    res.json({
      message: 'Token refreshed',
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (e) {
    console.error('Error during token refresh:', e);
    res.status(500).json({ message: 'Server error ved refresh' });
  }
});

// Current User
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;
