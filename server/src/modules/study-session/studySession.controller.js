import asyncHandler from '../../middleware/asyncHandler.js';
import * as studySessionService from './studySession.service.js';

/**
 * @desc Create a new StudySession
 * @route POST /api/study/sessions
 */
export const createStudySession = asyncHandler(async (req, res) => {
  const { topic, difficulty, goal, learningGoal, context } = req.body;
  const userId = req.user ? req.user._id : (req.body.userId || null);

  if (!topic) {
    return res.status(400).json({ success: false, message: 'Please provide a topic for the study session.' });
  }

  const session = await studySessionService.createSession({ topic, difficulty, goal, learningGoal, context, userId });
  res.status(201).json({ success: true, data: session });
});

/**
 * @desc Get history of study sessions for logged in user
 * @route GET /api/study/sessions
 */
export const getAllStudySessions = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const sessions = await studySessionService.fetchAllSessions(userId);
  res.status(200).json({ success: true, count: sessions.length, data: sessions });
});

/**
 * @desc Get single study session with all associated materials generated so far
 * @route GET /api/study/sessions/:id
 */
export const getStudySessionById = asyncHandler(async (req, res) => {
  const data = await studySessionService.fetchSessionWithMaterials(req.params.id);
  if (!data) {
    return res.status(404).json({ success: false, message: 'Study session not found' });
  }
  res.status(200).json({ success: true, data });
});

/**
 * @desc Delete a study session
 * @route DELETE /api/study/sessions/:id
 */
export const deleteStudySession = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const session = await studySessionService.deleteSession(req.params.id, userId);
  if (!session) {
    return res.status(404).json({ success: false, message: 'Study session not found' });
  }
  res.status(200).json({ success: true, message: 'Study session deleted successfully' });
});

/**
 * Helper generator wrapper for material endpoints
 */
const handleMaterialGeneration = (serviceMethod) => asyncHandler(async (req, res) => {
  const material = await serviceMethod(req.params.sessionId);
  if (!material) {
    return res.status(404).json({ success: false, message: 'Study session not found' });
  }
  res.status(201).json({ success: true, data: material });
});

export const generateRoadmapMaterial = handleMaterialGeneration(studySessionService.generateRoadmapMaterialForSession);
export const generateNotesMaterial = handleMaterialGeneration(studySessionService.generateNotesMaterialForSession);
export const generateMCQMaterial = handleMaterialGeneration(studySessionService.generateMCQMaterialForSession);
export const generateFlashcardMaterial = handleMaterialGeneration(studySessionService.generateFlashcardMaterialForSession);
export const generateVivaMaterial = handleMaterialGeneration(studySessionService.generateVivaMaterialForSession);
export const generateCodeMaterial = handleMaterialGeneration(studySessionService.generateCodeMaterialForSession);
