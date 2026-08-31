import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
    },
    context: {
      type: String,
      default: '',
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    learningGoal: {
      type: String,
      enum: ['understanding', 'exam', 'interview', 'viva', 'revision'],
      default: 'understanding',
    },
    status: {
      type: String,
      enum: ['generating', 'completed', 'failed'],
      default: 'generating',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const StudySession = mongoose.model('StudySession', studySessionSchema);

export default StudySession;
