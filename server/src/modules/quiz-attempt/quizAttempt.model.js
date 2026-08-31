import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudySession',
      required: true,
    },
    answers: [
      {
        materialId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Material',
          required: true,
        },
        selectedAnswer: {
          type: Number,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

export default QuizAttempt;
