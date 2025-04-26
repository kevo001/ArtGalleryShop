const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Helper function to handle errors
const handleError = (res, message, statusCode = 500) => {
  console.error(message);
  res.status(statusCode).json({ success: false, message });
};

// POST: Register a new user
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'E-posten er allerede i bruk.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save the new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'Bruker registrert!' });
  } catch (err) {
    handleError(res, 'Feil under registrering:', 500);
  }
});

// POST: User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Feil e-post eller passord' });

    // Compare the password with the hashed one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Feil e-post eller passord' });

    // Create JWT token
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token, isAdmin: user.isAdmin });
  } catch (err) {
    handleError(res, 'Feil under pålogging:', 500);
  }
});

module.exports = router;
