import api from './api';

export const companyService = {
  getSettings: async () => {
    try {
      const response = await api.get('/settings/company');
      return response.data;
    } catch (error) {
      console.error('Error fetching company settings:', error);
      throw error;
    }
  },

  updateSettings: async (data) => {
    try {
      const response = await api.put('/settings/company', data);
      return response.data;
    } catch (error) {
      console.error('Error updating company settings:', error);
      throw error;
    }
  },

  uploadLogo: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/settings/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  },

  deleteLogo: async () => {
    try {
      const response = await api.delete('/settings/logo');
      return response.data;
    } catch (error) {
      console.error('Error deleting logo:', error);
      throw error;
    }
  },

  updateTheme: async (theme) => {
    try {
      const response = await api.put('/settings/theme', theme);
      return response.data;
    } catch (error) {
      console.error('Error updating theme:', error);
      throw error;
    }
  },

  updateTax: async (tax) => {
    try {
      const response = await api.put('/settings/tax', tax);
      return response.data;
    } catch (error) {
      console.error('Error updating tax:', error);
      throw error;
    }
  },
};