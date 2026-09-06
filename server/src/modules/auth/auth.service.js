import axios from "axios";
import jwt from "jsonwebtoken";
import { User } from "./user.model.js";

/**
 * 🛠️ AUTH SERVICE - OAuth 2.0 & JWT Helper Logic
 */

/**
 * TODO 1: Generate Google OAuth Consent URL
 * - Construct the Google OAuth URL with query params:
 *   redirect_uri, client_id, access_type='offline', response_type='code', prompt='consent', scope
 * - Return the URL string.
 */
export const getGoogleAuthUrl = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const queryString = new URLSearchParams(options).toString();
  return `${rootUrl}?${queryString}`;
};

/**
 * TODO 2: Exchange Authorization Code for Google Tokens
 * - Send POST request to 'https://oauth2.googleapis.com/token'
 * - Parameters: code, client_id, client_secret, redirect_uri, grant_type='authorization_code'
 * - Return the response data containing access_token & id_token.
 */
export const getGoogleTokens = async (code) => {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  };

  const response = await axios.post(
    url,
    new URLSearchParams(values).toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );

  return response.data;
};

/**
 * TODO 3: Fetch User Profile from Google
 * - Send GET request to 'https://www.googleapis.com/oauth2/v2/userinfo'
 * - Pass header: Authorization: `Bearer ${accessToken}`
 * - Return response data (id, email, name, picture).
 */
export const getGoogleUserInfo = async (accessToken) => {
  const response = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  return response.data;
};

/**
 * TODO 4: Find or Create User in MongoDB Database
 * - Check if user exists by googleId OR email.
 * - If not, create a new User record in MongoDB.
 * - Return the user document.
 */
export const findOrCreateUser = async (googleUser) => {
  const { id: googleId, email, name, picture: avatar } = googleUser;

  let user = await User.findOne({
    $or: [{ googleId }, { email }],
  });

  if (!user) {
    user = await User.create({ googleId, email, name, avatar });
  } else if (!user.googleId) {
    user.googleId = googleId;
    if (avatar) user.avatar = avatar;
    await user.save();
  }

  return user;
};

/**
 * TODO 5: Generate JWT Session Token
 * - Sign a JWT token using `jwt.sign()` containing user ID and email.
 * - Use process.env.JWT_SECRET.
 */
export const generateJwtToken = (user) => {
  const payload = { id: user._id, email: user.email, name: user.name };
  const secret = process.env.JWT_SECRET || "fallback_secret";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

/**
 * TODO 6: Verify Session JWT Token
 * - Verifies token payload using `jwt.verify()`
 */
export const verifyJwtToken = (token) => {
  const secret = process.env.JWT_SECRET || "fallback_secret";
  return jwt.verify(token, secret);
};
