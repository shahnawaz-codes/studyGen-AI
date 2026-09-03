import mongoose from 'mongoose';

/**
 * USER MODEL (OAuth 2.0 Profile Storage)
 * 
 * TODO for Student:
 * 1. Define fields needed to store Google user data:
 *    - googleId: String (unique, sparse index so non-google users aren't affected)
 *    - email: String (required, unique, lowercase, trimmed)
 *    - name: String (required)
 *    - avatar: String (optional URL for user's profile picture)
 */

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
