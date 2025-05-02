// middleware/isAdmin.js
export default function isAdmin(req, res, next) {
    // `authMiddleware` must have run first so `req.user` exists
    if (req.user?.isAdmin) {
      return next();                 // ✅ user is an admin – continue
    }
    return res.status(403).json({ message: 'Admin access required' });
  }