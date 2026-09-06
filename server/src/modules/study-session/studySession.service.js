import StudySession from './studySession.model.js';
import Material from '../material/material.model.js';
import {
  generateRoadmapForTopic,
  generateNotesForTopic,
  generateMCQsForTopic,
  generateFlashcardsForTopic,
  generateVivaForTopic,
  generateCodeForTopic,
} from '../ai/ai.service.js';

// Helpers to normalize parameters
export const normalizeDifficulty = (diff) => {
  if (!diff) return 'beginner';
  const d = String(diff).toLowerCase();
  if (['beginner', 'intermediate', 'advanced'].includes(d)) return d;
  return 'beginner';
};

export const normalizeGoal = (goal) => {
  if (!goal) return 'understanding';
  const g = String(goal).toLowerCase();
  if (g.includes('interview')) return 'interview';
  if (g.includes('exam') || g.includes('revision')) return 'revision';
  if (g.includes('viva')) return 'viva';
  if (['understanding', 'exam', 'interview', 'viva', 'revision'].includes(g)) return g;
  return 'understanding';
};

/**
 * Helper to persist single or multi-item materials to database
 */
const saveMaterialHelper = async (session, type, generatorData, baseOrder, defaultTitle) => {
  if (!generatorData) return null;

  if (Array.isArray(generatorData)) {
    const createdMaterials = [];
    for (let i = 0; i < generatorData.length; i++) {
      const mat = await Material.create({
        sessionId: session._id,
        type,
        title: `${session.topic} ${defaultTitle} #${i + 1}`,
        content: generatorData[i],
        order: baseOrder + i,
      });
      createdMaterials.push(mat);
    }
    return createdMaterials;
  }

  return await Material.create({
    sessionId: session._id,
    type,
    title: `${session.topic} ${defaultTitle}`,
    content: generatorData,
    order: baseOrder,
  });
};

/**
 * Create a new StudySession record
 */
export const createSession = async ({ topic, difficulty, goal, learningGoal, context, userId }) => {
  const normDiff = normalizeDifficulty(difficulty);
  const normGoal = normalizeGoal(learningGoal || goal);

  return await StudySession.create({
    userId: userId || null,
    topic,
    context: context || '',
    difficulty: normDiff,
    learningGoal: normGoal,
    status: 'completed',
  });
};

/**
 * Fetch study sessions (filtered by user if provided)
 */
export const fetchAllSessions = async (userId = null) => {
  const query = userId ? { userId } : {};
  return await StudySession.find(query).sort({ createdAt: -1 }).limit(30);
};

/**
 * Fetch single study session with associated materials
 */
export const fetchSessionWithMaterials = async (sessionId) => {
  const session = await StudySession.findById(sessionId);
  if (!session) return null;

  const materials = await Material.find({ sessionId: session._id }).sort({ order: 1 });
  return { session, materials };
};

/**
 * Delete a study session and all its generated materials
 */
export const deleteSession = async (sessionId, userId = null) => {
  const query = userId ? { _id: sessionId, userId } : { _id: sessionId };
  const session = await StudySession.findOneAndDelete(query);
  if (session) {
    await Material.deleteMany({ sessionId: session._id });
  }
  return session;
};

/**
 * Generate Roadmap material on-demand
 */
export const generateRoadmapMaterialForSession = async (sessionId) => {
  const session = await StudySession.findById(sessionId);
  if (!session) return null;
  const data = await generateRoadmapForTopic(session.topic, session.difficulty, session.learningGoal);
  return await saveMaterialHelper(session, 'roadmap', data, 1, 'Roadmap');
};

/**
 * Generate Notes material on-demand
 */
export const generateNotesMaterialForSession = async (sessionId) => {
  const session = await StudySession.findById(sessionId);
  if (!session) return null;
  const data = await generateNotesForTopic(session.topic, session.difficulty, session.learningGoal);
  return await saveMaterialHelper(session, 'notes', data, 2, 'Notes');
};

/**
 * Generate MCQs material on-demand
 */
export const generateMCQMaterialForSession = async (sessionId) => {
  const session = await StudySession.findById(sessionId);
  if (!session) return null;
  const data = await generateMCQsForTopic(session.topic, session.difficulty, session.learningGoal);
  return await saveMaterialHelper(session, 'mcq', data, 4, 'MCQ');
};

/**
 * Generate Flashcards material on-demand
 */
export const generateFlashcardMaterialForSession = async (sessionId) => {
  const session = await StudySession.findById(sessionId);
  if (!session) return null;
  const data = await generateFlashcardsForTopic(session.topic, session.difficulty, session.learningGoal);
  return await saveMaterialHelper(session, 'flashcard', data, 7, 'Flashcard');
};

/**
 * Generate Viva material on-demand
 */
export const generateVivaMaterialForSession = async (sessionId) => {
  const session = await StudySession.findById(sessionId);
  if (!session) return null;
  const data = await generateVivaForTopic(session.topic, session.difficulty, session.learningGoal);
  return await saveMaterialHelper(session, 'viva', data, 10, 'Viva');
};

/**
 * Generate Code Example material on-demand
 */
export const generateCodeMaterialForSession = async (sessionId) => {
  const session = await StudySession.findById(sessionId);
  if (!session) return null;
  const data = await generateCodeForTopic(session.topic, session.difficulty, session.learningGoal);
  return await saveMaterialHelper(session, 'code', data, 3, 'Code Example');
};
