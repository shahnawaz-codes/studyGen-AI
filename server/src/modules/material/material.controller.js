import Material from './material.model.js';

/**
 * @desc Get all materials across all sessions
 * @route GET /api/materials
 */
export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: materials.length, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Create a new material manually
 * @route POST /api/materials
 */
export const createMaterial = async (req, res) => {
  try {
    const { sessionId, type, title, content, order } = req.body;
    if (!sessionId || !type || !title || !content) {
      return res.status(400).json({ success: false, message: 'Please provide sessionId, type, title, and content' });
    }

    const material = await Material.create({
      sessionId,
      type,
      title,
      content,
      order: order || 0,
    });

    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Delete a material by ID
 * @route DELETE /api/materials/:id
 */
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }
    res.status(200).json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
