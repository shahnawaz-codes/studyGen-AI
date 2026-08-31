import express from 'express';
import {
  submitQuizAttempt,
  getQuizAttemptsBySession,
} from './quizAttempt.controller.js';

const router = express.Router();

// POST /api/quiz-attempts - Submit quiz attempt
router.post('/', submitQuizAttempt);

// GET /api/quiz-attempts/session/:sessionId - Fetch attempts by session
router.get('/session/:sessionId', getQuizAttemptsBySession);

export default router;
