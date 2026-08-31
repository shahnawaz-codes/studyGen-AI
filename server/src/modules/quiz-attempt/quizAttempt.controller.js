import QuizAttempt from './quizAttempt.model.js';
import Material from '../material/material.model.js';

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

    let score = 0;
    const evaluatedAnswers = [];

    for (const item of answers) {
      const { materialId, selectedAnswer } = item;
      const material = await Material.findById(materialId);

      let isCorrect = false;
      if (material && material.type === 'mcq') {
        isCorrect = Number(selectedAnswer) === Number(material.content.correctAnswer);
      }

      if (isCorrect) score++;

      evaluatedAnswers.push({
        materialId,
        selectedAnswer,
        isCorrect,
      });
    }

    const quizAttempt = await QuizAttempt.create({
      userId: userId || null,
      sessionId,
      answers: evaluatedAnswers,
      score,
      total: answers.length,
      completedAt: new Date(),
    });

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
    const attempts = await QuizAttempt.find({ sessionId: req.params.sessionId }).sort({ completedAt: -1 });
    res.status(200).json({ success: true, count: attempts.length, data: attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
