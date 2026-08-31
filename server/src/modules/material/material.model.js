import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudySession',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['roadmap', 'notes', 'code', 'mcq', 'flashcard', 'viva'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
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

const Material = mongoose.model('Material', materialSchema);

export default Material;
