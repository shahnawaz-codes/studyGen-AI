import {
  getGoogleAuthUrl,
  getGoogleTokens,
  getGoogleUserInfo,
  findOrCreateUser,
  generateJwtToken,
} from './auth.service.js';

/**
 * 🎮 AUTH CONTROLLER - HTTP Request Handlers
 */

/**
 * TODO 1: Redirect User to Google Consent Page
 * Route: GET /api/auth/google
 * 
 * Steps to implement:
 * 1. Call `getGoogleAuthUrl()` from auth.service.js to get the consent page URL.
 * 2. Redirect the user's browser using `res.redirect(authUrl)`.
 * 3. Handle any errors with try-catch and return a 500 response.
 */
export const googleLoginRedirect = (req, res) => {
  try {
    // TODO: Write your code here to get authUrl and redirect res.redirect(authUrl)
    const authUrl = getGoogleAuthUrl();
    return res.redirect(authUrl);
  } catch (error) {
    console.error('Error in googleLoginRedirect:', error);
    return res.status(500).json({ error: 'Failed to initiate Google authentication' });
  }
};

/**
 * TODO 2: Handle Callback from Google OAuth Server
 * Route: GET /api/auth/google/callback?code=AUTHORIZATION_CODE
 * 
 * Steps to implement:
 * 1. Extract `code` from `req.query`.
 * 2. If no code exists, return 400 Bad Request.
 * 3. Call `getGoogleTokens(code)` to get the access_token.
 * 4. Call `getGoogleUserInfo(access_token)` to fetch user profile details.
 * 5. Call `findOrCreateUser(googleUser)` to save or retrieve user from MongoDB.
 * 6. Call `generateJwtToken(user)` to sign a JWT session token.
 * 7. Redirect back to frontend: `${CLIENT_URL}/auth-success?token=${token}`.
 */
export const googleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code missing' });
  }

  try {
    // TODO: Write your logic here using the step-by-step instructions above!
    const { access_token } = await getGoogleTokens(code);
    const googleUser = await getGoogleUserInfo(access_token);
    const user = await findOrCreateUser(googleUser);
    const token = generateJwtToken(user);

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    return res.redirect(`${clientUrl}/auth-success?token=${token}`);
  } catch (error) {
    console.error('OAuth Callback Error:', error?.response?.data || error.message);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    return res.redirect(`${clientUrl}/login?error=auth_failed`);
  }
};

/**
 * TODO 3: Get Current Authenticated User Details
 * Route: GET /api/auth/me
 * 
 * Steps to implement:
 * 1. Check if `req.user` exists (attached by auth.middleware.js).
 * 2. If not found, return 401 Unauthorized.
 * 3. Return 200 OK with `{ status: 'success', user: req.user }`.
 */
export const getCurrentUser = (req, res) => {
  // TODO: Write your logic here to return current user
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.status(200).json({
    status: 'success',
    user: req.user,
  });
};
