import * as quizAttemptService from './quizAttempt.service.js';

/**
 * @desc Submit answers and record a QuizAttempt
 * @route POST /api/quiz-attempts
 */
export const submitQuizAttempt = async (req, res) => {
  try {
    const { sessionId, userId, answers } = req.body;

    if (!sessionId || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Please provide sessionId and answers array.' });
    }

    const quizAttempt = await quizAttemptService.processAndCreateQuizAttempt({ sessionId, userId, answers });

    res.status(201).json({ success: true, data: quizAttempt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get quiz attempts for a session
 * @route GET /api/quiz-attempts/session/:sessionId
 */
export const getQuizAttemptsBySession = async (req, res) => {
  try {
    const attempts = await quizAttemptService.fetchQuizAttemptsBySession(req.params.sessionId);
    res.status(200).json({ success: true, count: attempts.length, data: attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
