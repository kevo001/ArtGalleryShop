// server.js (ESM)
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// File system & path utilities for static file serving
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Routers & middleware
import stripeWebhook     from './routes/stripeWebhook.js';
import authRoutes        from './routes/AuthRoutes.js';       // signup, login, refresh
import itemRoutes        from './routes/ItemRoutes.js';
import artistRoutes      from './routes/ArtistRoutes.js';
import orderRoutes       from './routes/OrderRoutes.js';
import categoryRoutes    from './routes/CategoryRoutes.js';
import stripeRoutes      from './routes/Stripe.js';
import authMiddleware    from './middleware/auth.js';
import protectedRouter   from './routes/ProtectedRoutes.js'; // your protected-item routes

const app = express();

// Trust proxy (for secure cookies behind a load-balancer)
app.set('trust proxy', 1);

// ──────────────────────────────────────────────────────────────────────────────
// 🔒 Disable ETag entirely so we never return 304 Not Modified
app.disable('etag');

// ──────────────────────────────────────────────────────────────────────────────
// 1) Stripe webhook (raw body) must be before JSON parser
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// ──────────────────────────────────────────────────────────────────────────────
// 2) Global middleware
app.use(
  cors({
    origin: [
      'https://galleriedwin.onrender.com',
      'http://localhost:5173'
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// ──────────────────────────────────────────────────────────────────────────────
// 🔄 Prevent any client or edge cache on your API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// ──────────────────────────────────────────────────────────────────────────────
// 3) Auth endpoints (signup, login, refresh tokens)
app.use('/api/auth', authRoutes);

// 4) Public API
app.use('/api/items',      itemRoutes);
app.use('/api/artists',    artistRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stripe',     stripeRoutes);

// 5) Protected API (requires valid accessToken)
app.use('/api/protected', authMiddleware, protectedRouter);

// ──────────────────────────────────────────────────────────────────────────────
// 6) Serve React build and fallback for client-side routing
const buildPath = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(buildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// ──────────────────────────────────────────────────────────────────────────────
// 7) Connect to MongoDB & start server
console.log('📦 Connecting to MongoDB at:', process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 Server listening on port ${PORT}`)
    );
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
