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
 * Fetch all study sessions (history)
 */
export const fetchAllSessions = async () => {
  return await StudySession.find().sort({ createdAt: -1 }).limit(20);
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
 * Generate Roadmap material on-demand
 */
export const generateRoadmapMaterialForSession = async (sessionId) => {
  const session = await StudySession.findById(sessionId);
  if (!session) return null;

  const roadmapData = await generateRoadmapForTopic(session.topic, session.difficulty, session.learningGoal);

  return await Material.create({
    sessionId: session._id,
    type: 'roadmap',
    title: `${session.topic} Roadmap`,
    content: roadmapData,
    order: 1,
  });
};

/**
 * Generate Notes material on-demand
 */
export const generateNotesMaterialForSession = async (sessionId) => {
  const session = await StudySession.findById(sessionId);
  if (!session) return null;

  const notesData = await generateNotesForTopic(session.topic, session.difficulty, session.learningGoal);

  return await Material.create({
    sessionId: session._id,
    type: 'notes',
    title: `Notes: ${session.topic}`,
    content: notesData,
    order: 2,
  });
};

/**
 * Generate MCQs material on-demand
 */
export const generateMCQMaterialForSession = async (sessionId) => {
  const session = await StudySession.findById(sessionId);
  if (!session) return null;

  const mcqsData = await generateMCQsForTopic(session.topic, session.difficulty, session.learningGoal);

  const createdMaterials = [];
  if (Array.isArray(mcqsData)) {
    for (let i = 0; i < mcqsData.length; i++) {
      const item = mcqsData[i];
      const mat = await Material.create({
        sessionId: session._id,
        type: 'mcq',
        title: `${session.topic} MCQ #${i + 1}`,
        content: item,
        order: 4 + i,
      });
      createdMaterials.push(mat);
    }
  } else {
    const mat = await Material.create({
      sessionId: session._id,
      type: 'mcq',
      title: `${session.topic} MCQs`,
      content: mcqsData,
      order: 4,
    });
    createdMaterials.push(mat);
  }

  return createdMaterials;
};

/**
 * Generate Flashcards material on-demand
 */
export const generateFlashcardMaterialForSession = async (sessionId) => {
  const session = await StudySession.findById(sessionId);
  if (!session) return null;

  const flashcardsData = await generateFlashcardsForTopic(session.topic, session.difficulty, session.learningGoal);

  const createdMaterials = [];
  if (Array.isArray(flashcardsData)) {
    for (let i = 0; i < flashcardsData.length; i++) {
      const item = flashcardsData[i];
      const mat = await Material.create({
        sessionId: session._id,
        type: 'flashcard',
        title: `${session.topic} Flashcard #${i + 1}`,
        content: item,
        order: 7 + i,
      });
      createdMaterials.push(mat);
    }
  } else {
    const mat = await Material.create({
      sessionId: session._id,
      type: 'flashcard',
      title: `${session.topic} Flashcards`,
      content: flashcardsData,
      order: 7,
    });
    createdMaterials.push(mat);
  }

  return createdMaterials;
};

/**
 * Generate Viva material on-demand
 */
export const generateVivaMaterialForSession = async (sessionId) => {
  const session = await StudySession.findById(sessionId);
  if (!session) return null;

  const vivaData = await generateVivaForTopic(session.topic, session.difficulty, session.learningGoal);

  const createdMaterials = [];
  if (Array.isArray(vivaData)) {
    for (let i = 0; i < vivaData.length; i++) {
      const item = vivaData[i];
      const mat = await Material.create({
        sessionId: session._id,
        type: 'viva',
        title: `${session.topic} Viva #${i + 1}`,
        content: item,
        order: 10 + i,
      });
      createdMaterials.push(mat);
    }
  } else {
    const mat = await Material.create({
      sessionId: session._id,
      type: 'viva',
      title: `${session.topic} Viva Questions`,
      content: vivaData,
      order: 10,
    });
    createdMaterials.push(mat);
  }

  return createdMaterials;
};

/**
 * Generate Code Example material on-demand
 */
export const generateCodeMaterialForSession = async (sessionId) => {
  const session = await StudySession.findById(sessionId);
  if (!session) return null;

  const codeData = await generateCodeForTopic(session.topic, session.difficulty, session.learningGoal);

  return await Material.create({
    sessionId: session._id,
    type: 'code',
    title: `${session.topic} Code Example`,
    content: codeData,
    order: 3,
  });
};
