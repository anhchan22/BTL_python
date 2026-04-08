import api from './api';

export const contractService = {
  // Get all contracts (filtered by role on backend)
  getAllContracts: async () => {
    const response = await api.get('/contracts/');
    return response.data;
  },

  // Get single contract
  getContract: async (id) => {
    const response = await api.get(`/contracts/${id}/`);
    return response.data;
  },

  // Get user's active contracts
  getMyActiveContracts: async () => {
    const response = await api.get('/contracts/my_active/');
    return response.data;
  },

  // Get all active contracts (admin only)
  getAllActiveContracts: async () => {
    const response = await api.get('/contracts/active/');
    return response.data;
  }
};
