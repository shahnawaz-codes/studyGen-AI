import Material from './material.model.js';

/**
 * Fetch all materials sorted by creation date descending
 */
export const fetchMaterials = async () => {
  return await Material.find().sort({ createdAt: -1 });
};

/**
 * Create a new material record
 */
export const createNewMaterial = async ({ sessionId, type, title, content, order }) => {
  return await Material.create({
    sessionId,
    type,
    title,
    content,
    order: order || 0,
  });
};

/**
 * Delete a material record by ID
 */
export const deleteMaterialById = async (id) => {
  return await Material.findByIdAndDelete(id);
};
