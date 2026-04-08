import api from './api';

export const rentalService = {
  // Get all rental requests (filtered by role on backend)
  getAllRequests: async () => {
    const response = await api.get('/rentals/');
    return response.data;
  },

  // Get single request
  getRequest: async (id) => {
    const response = await api.get(`/rentals/${id}/`);
    return response.data;
  },

  // Create rental request
  createRequest: async (requestData) => {
    const response = await api.post('/rentals/', requestData);
    return response.data;
  },

  // Approve request (admin only)
  approveRequest: async (id, adminNote = '') => {
    const response = await api.post(`/rentals/${id}/approve/`, { admin_note: adminNote });
    return response.data;
  },

  // Reject request (admin only)
  rejectRequest: async (id, adminNote = '') => {
    const response = await api.post(`/rentals/${id}/reject/`, { admin_note: adminNote });
    return response.data;
  },

  // Cancel request (tenant)
  cancelRequest: async (id) => {
    const response = await api.post(`/rentals/${id}/cancel/`);
    return response.data;
  }
};
