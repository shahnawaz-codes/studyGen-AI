import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import studySessionRoutes from '../modules/study-session/studySession.routes.js';
import materialRoutes from '../modules/material/material.routes.js';
import quizAttemptRoutes from '../modules/quiz-attempt/quizAttempt.routes.js';

const router = express.Router();

// Register Feature Module Routes
router.use('/auth', authRoutes);
router.use('/study', studySessionRoutes);
router.use('/materials', materialRoutes);
router.use('/quiz-attempts', quizAttemptRoutes);

export default router;
