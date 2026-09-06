import express from 'express';
import {
  googleLoginRedirect,
  googleCallback,
  getCurrentUser,
} from './auth.controller.js';
import { protectRoute } from '../../middleware/auth.middleware.js';

const router = express.Router();

/**
 * 🚦 AUTH ROUTES SETUP
 * 
 * TODO for Student:
 * Observe how routes map to HTTP methods and controllers:
 * 1. GET /api/auth/google           -> Triggers Google Login redirect page
 * 2. GET /api/auth/google/callback  -> Receives authorization code from Google
 * 3. GET /api/auth/me               -> Returns current logged-in user profile (protected by protectRoute middleware)
 */

// Route 1: Trigger Google Auth Redirect
router.get('/google', googleLoginRedirect);

// Route 2: OAuth 2.0 Redirect Callback URL from Google
router.get('/google/callback', googleCallback);

// Route 3: Get Current User Profile (Protected)
router.get('/me', protectRoute, getCurrentUser);

export default router;
