import { verifyJwtToken } from '../modules/auth/auth.service.js';
import { User } from '../modules/auth/user.model.js';

/**
 * 🔒 AUTH MIDDLEWARE - Protected Routes Barrier
 */
export const protectRoute = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = verifyJwtToken(token);
    const user = await User.findById(decoded.id).select('-__v');

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Middleware Verification Error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

/**
 * 🔓 OPTIONAL AUTH MIDDLEWARE - Attaches req.user if token is valid, but does not block if missing
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyJwtToken(token);
      const user = await User.findById(decoded.id).select('-__v');
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore error for optional auth
  }
  next();
};
