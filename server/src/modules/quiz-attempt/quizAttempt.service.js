import QuizAttempt from './quizAttempt.model.js';
import Material from '../material/material.model.js';

/**
 * Evaluate quiz answers against material content and save attempt
 */
export const processAndCreateQuizAttempt = async ({ sessionId, userId, answers }) => {
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

  return quizAttempt;
};

/**
 * Fetch quiz attempts by session ID
 */
export const fetchQuizAttemptsBySession = async (sessionId) => {
  return await QuizAttempt.find({ sessionId }).sort({ completedAt: -1 });
};
