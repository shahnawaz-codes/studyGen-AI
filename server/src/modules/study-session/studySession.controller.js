import * as studySessionService from './studySession.service.js';

/**
 * @desc Create a new StudySession
 * @route POST /api/study/sessions
 */
export const createStudySession = async (req, res) => {
  try {
    const { topic, difficulty, goal, learningGoal, context, userId } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, message: 'Please provide a topic for the study session.' });
    }

    const session = await studySessionService.createSession({ topic, difficulty, goal, learningGoal, context, userId });

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
    const sessions = await studySessionService.fetchAllSessions();
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
    const data = await studySessionService.fetchSessionWithMaterials(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Study session not found' });
    }

    res.status(200).json({ success: true, data });
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
    const material = await studySessionService.generateRoadmapMaterialForSession(req.params.sessionId);
    if (!material) return res.status(404).json({ success: false, message: 'Study session not found' });

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
    const material = await studySessionService.generateNotesMaterialForSession(req.params.sessionId);
    if (!material) return res.status(404).json({ success: false, message: 'Study session not found' });

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
    const materials = await studySessionService.generateMCQMaterialForSession(req.params.sessionId);
    if (!materials) return res.status(404).json({ success: false, message: 'Study session not found' });

    res.status(201).json({ success: true, data: materials });
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
    const materials = await studySessionService.generateFlashcardMaterialForSession(req.params.sessionId);
    if (!materials) return res.status(404).json({ success: false, message: 'Study session not found' });

    res.status(201).json({ success: true, data: materials });
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
    const materials = await studySessionService.generateVivaMaterialForSession(req.params.sessionId);
    if (!materials) return res.status(404).json({ success: false, message: 'Study session not found' });

    res.status(201).json({ success: true, data: materials });
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
    const material = await studySessionService.generateCodeMaterialForSession(req.params.sessionId);
    if (!material) return res.status(404).json({ success: false, message: 'Study session not found' });

    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
