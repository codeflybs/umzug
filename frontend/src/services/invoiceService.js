import api from './api';

export const invoiceService = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/invoices', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/invoices', data);
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/invoices/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },

  getNextNumber: async () => {
    try {
      const response = await api.get('/invoices/next-number');
      return response.data.nextInvoiceNumber;
    } catch (error) {
      console.error('Error fetching next invoice number:', error);
      throw error;
    }
  },

  generatePDF: async (id) => {
    try {
      const response = await api.post(`/invoices/${id}/generate-pdf`);
      return response.data;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  },
};