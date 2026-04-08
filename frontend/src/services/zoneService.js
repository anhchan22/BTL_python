import api from './api';

export const zoneService = {
  // Get all zones with optional filters
  getAllZones: async (params = {}) => {
    const response = await api.get('/zones/', { params });
    return response.data;
  },

  // Get only available zones
  getAvailableZones: async () => {
    const response = await api.get('/zones/available/');
    return response.data;
  },

  // Get single zone details
  getZone: async (id) => {
    const response = await api.get(`/zones/${id}/`);
    return response.data;
  },

  // Create zone (admin only)
  createZone: async (zoneData) => {
    const response = await api.post('/zones/', zoneData);
    return response.data;
  },

  // Update zone (admin only)
  updateZone: async (id, zoneData) => {
    const response = await api.put(`/zones/${id}/`, zoneData);
    return response.data;
  },

  // Delete zone (admin only)
  deleteZone: async (id) => {
    await api.delete(`/zones/${id}/`);
  }
};
