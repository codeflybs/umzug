import React, { createContext, useContext, useState, useEffect } from 'react';
import { companyService } from '../services/companyService';

const SettingsContext = createContext(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const data = await companyService.getSettings();
      setSettings(data);
      
      // Apply theme colors to CSS variables
      if (data.theme) {
        document.documentElement.style.setProperty('--color-primary', data.theme.primaryColor);
        document.documentElement.style.setProperty('--color-secondary', data.theme.secondaryColor);
        document.documentElement.style.setProperty('--color-accent', data.theme.accentColor);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      await companyService.updateSettings(newSettings);
      await loadSettings();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateTheme = async (theme) => {
    try {
      await companyService.updateTheme(theme);
      await loadSettings();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings, updateTheme, reload: loadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};