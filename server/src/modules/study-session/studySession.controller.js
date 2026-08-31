import StudySession from './studySession.model.js';
import Material from '../material/material.model.js';
import {
  generateRoadmapForTopic,
  generateNotesForTopic,
  generateMCQsForTopic,
  generateFlashcardsForTopic,
  generateVivaForTopic,
  generateCodeForTopic,
} from '../../services/ai.service.js';

// Helpers to normalize parameters
const normalizeDifficulty = (diff) => {
  if (!diff) return 'beginner';
  const d = String(diff).toLowerCase();
  if (['beginner', 'intermediate', 'advanced'].includes(d)) return d;
  return 'beginner';
};

const normalizeGoal = (goal) => {
  if (!goal) return 'understanding';
  const g = String(goal).toLowerCase();
  if (g.includes('interview')) return 'interview';
  if (g.includes('exam') || g.includes('revision')) return 'revision';
  if (g.includes('viva')) return 'viva';
  if (['understanding', 'exam', 'interview', 'viva', 'revision'].includes(g)) return g;
  return 'understanding';
};

/**
 * @desc Create a new StudySession (without immediately generating all materials)
 * @route POST /api/study/sessions
 */
export const createStudySession = async (req, res) => {
  try {
    const { topic, difficulty, goal, learningGoal, context, userId } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, message: 'Please provide a topic for the study session.' });
    }

    const normDiff = normalizeDifficulty(difficulty);
    const normGoal = normalizeGoal(learningGoal || goal);

    const session = await StudySession.create({
      userId: userId || null,
      topic,
      context: context || '',
      difficulty: normDiff,
      learningGoal: normGoal,
      status: 'completed',
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get history of all study sessions
 * @route GET /api/study/sessions
 */
export const getAllStudySessions = async (req, res) => {
  try {
    const sessions = await StudySession.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get single study session with all associated materials generated so far
 * @route GET /api/study/sessions/:id
 */
export const getStudySessionById = async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Study session not found' });
    }

    const materials = await Material.find({ sessionId: session._id }).sort({ order: 1 });
    res.status(200).json({ success: true, data: { session, materials } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Generate Roadmap material on-demand for a session
 * @route POST /api/study/sessions/:sessionId/roadmap
 */
export const generateRoadmapMaterial = async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Study session not found' });

    const roadmapData = await generateRoadmapForTopic(session.topic, session.difficulty, session.learningGoal);

    const material = await Material.create({
      sessionId: session._id,
      type: 'roadmap',
      title: `${session.topic} Roadmap`,
      content: roadmapData,
      order: 1,
    });

    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Generate Notes material on-demand for a session
 * @route POST /api/study/sessions/:sessionId/notes
 */
export const generateNotesMaterial = async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Study session not found' });

    const notesData = await generateNotesForTopic(session.topic, session.difficulty, session.learningGoal);

    const material = await Material.create({
      sessionId: session._id,
      type: 'notes',
      title: `Notes: ${session.topic}`,
      content: notesData,
      order: 2,
    });

    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Generate MCQs material on-demand for a session
 * @route POST /api/study/sessions/:sessionId/mcqs
 */
export const generateMCQMaterial = async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Study session not found' });

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

    res.status(201).json({ success: true, data: createdMaterials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Generate Flashcards material on-demand for a session
 * @route POST /api/study/sessions/:sessionId/flashcards
 */
export const generateFlashcardMaterial = async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Study session not found' });

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

    res.status(201).json({ success: true, data: createdMaterials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Generate Viva material on-demand for a session
 * @route POST /api/study/sessions/:sessionId/viva
 */
export const generateVivaMaterial = async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Study session not found' });

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

    res.status(201).json({ success: true, data: createdMaterials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Generate Code Example material on-demand for a session
 * @route POST /api/study/sessions/:sessionId/code
 */
export const generateCodeMaterial = async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Study session not found' });

    const codeData = await generateCodeForTopic(session.topic, session.difficulty, session.learningGoal);

    const material = await Material.create({
      sessionId: session._id,
      type: 'code',
      title: `${session.topic} Code Example`,
      content: codeData,
      order: 3,
    });

    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
