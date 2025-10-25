import api from './api';

export const offerService = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/offers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/offers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching offer:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/offers', data);
      return response.data;
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/offers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating offer:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/offers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting offer:', error);
      throw error;
    }
  },

  getNextNumber: async () => {
    try {
      const response = await api.get('/offers/next-number');
      return response.data.nextOfferNumber;
    } catch (error) {
      console.error('Error fetching next offer number:', error);
      throw error;
    }
  },

  calculatePricing: async (id, data) => {
    try {
      const response = await api.post(`/offers/${id}/calculate`, data);
      return response.data;
    } catch (error) {
      console.error('Error calculating pricing:', error);
      throw error;
    }
  },

  sendEmail: async (id) => {
    try {
      const response = await api.post(`/offers/${id}/send-email`);
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },
};