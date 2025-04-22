const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://galleriedwin.onrender.com',
  credentials: true,
}));
app.use("/api/webhook", require("./routes/stripeWebhook"));
app.use(express.json());



// ✅ Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const itemRoutes = require('./routes/ItemRoutes');
app.use('/api', itemRoutes);

const artistRoutes = require('./routes/ArtistRoutes');
app.use('/api', artistRoutes);

const orderRoutes = require('./routes/OrderRoutes');
app.use('/api', orderRoutes);

const categoryRoutes = require('./routes/CategoryRoutes');
app.use('/api', categoryRoutes);

const stripeRoutes = require('./routes/Stripe');
app.use('/api/stripe', stripeRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Basic route
app.get('/', (req, res) => res.send('API is running'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
