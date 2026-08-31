import express from 'express';
import {
  getAllMaterials,
  createMaterial,
  deleteMaterial,
} from './material.controller.js';

const router = express.Router();

// GET /api/materials - List materials
router.get('/', getAllMaterials);

// POST /api/materials - Create material
router.post('/', createMaterial);

// DELETE /api/materials/:id - Delete material
router.delete('/:id', deleteMaterial);

export default router;
