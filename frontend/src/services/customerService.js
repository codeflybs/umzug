import api from './api';

export const customerService = {
  getAll: async (activeOnly = true) => {
    try {
      const response = await api.get('/customers', {
        params: { active_only: activeOnly }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/customers', data);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/customers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  getNextNumber: async () => {
    try {
      const response = await api.get('/customers/next-number');
      return response.data.nextCustomerNumber;
    } catch (error) {
      console.error('Error fetching next customer number:', error);
      throw error;
    }
  },
};