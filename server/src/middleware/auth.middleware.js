import { verifyJwtToken } from '../modules/auth/auth.service.js';
import { User } from '../modules/auth/user.model.js';

/**
 * 🔒 AUTH MIDDLEWARE - Protected Routes Barrier
 * 
 * TODO for Student:
 * 1. Extract Bearer token from 'Authorization' HTTP header:
 *    Header format: `Authorization: Bearer <token>`
 * 2. Verify token using verifyJwtToken(token) or jwt.verify()
 * 3. Fetch user from MongoDB by decoded user ID (`User.findById(...)`).
 * 4. Attach user object to `req.user` and call `next()`.
 */
export const protectRoute = async (req, res, next) => {
  try {
    let token;

    // 1. Check if Authorization header exists and starts with 'Bearer'
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // 2. Verify token payload
    const decoded = verifyJwtToken(token);

    // 3. Fetch user from DB
    const user = await User.findById(decoded.id).select('-__v');

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    // 4. Attach user to req and proceed
    req.user = user;
    next();
  } catch (error) {
    console.error('Middleware Verification Error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
