import express from 'express';
import studySessionRoutes from '../modules/study-session/studySession.routes.js';
import materialRoutes from '../modules/material/material.routes.js';
import quizAttemptRoutes from '../modules/quiz-attempt/quizAttempt.routes.js';

const router = express.Router();

// Register Feature Module Routes
router.use('/study', studySessionRoutes);
router.use('/materials', materialRoutes);
router.use('/quiz-attempts', quizAttemptRoutes);

export default router;
