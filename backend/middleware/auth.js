// middleware/auth.js
import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const auth = req.headers.authorization || '';    // look here
  const token = auth.startsWith('Bearer ') 
                ? auth.slice(7) 
                : null;
  if (!token) {
    return res.status(401).json({ message: 'Ingen tilgangstoken' });
  }
  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; 
    next();
  } catch (e) {
    console.error('Token verification feilet:', e);
    res.status(401).json({ message: 'Ugyldig eller utløpt token' });
  }
};