import express from 'express';
import {
  createStudySession,
  getAllStudySessions,
  getStudySessionById,
  generateRoadmapMaterial,
  generateNotesMaterial,
  generateMCQMaterial,
  generateFlashcardMaterial,
  generateVivaMaterial,
  generateCodeMaterial,
} from './studySession.controller.js';

const router = express.Router();

// Session Management Routes
router.post('/sessions', createStudySession);
router.get('/sessions', getAllStudySessions);
router.get('/sessions/:id', getStudySessionById);

// On-Demand Material Generation Routes
router.post('/sessions/:sessionId/roadmap', generateRoadmapMaterial);
router.post('/sessions/:sessionId/notes', generateNotesMaterial);
router.post('/sessions/:sessionId/mcqs', generateMCQMaterial);
router.post('/sessions/:sessionId/flashcards', generateFlashcardMaterial);
router.post('/sessions/:sessionId/viva', generateVivaMaterial);
router.post('/sessions/:sessionId/code', generateCodeMaterial);

export default router;
