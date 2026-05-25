import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as storage from '../lib/storage';
import { mockCalculations } from '../data/mockCalculations';

export const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [calculations, setCalculations] = useState([]);
  const [settings, setSettings] = useState(storage.DEFAULT_SETTINGS);
  const [calculatorDraft, setCalculatorDraft] = useState(null);
  const [stats, setStats] = useState({});

  // Centralized reload function
  const refreshData = useCallback(() => {
    try {
      setSettings(storage.getSettings());
      setCalculations(storage.getSavedCalculations());
      setCalculatorDraft(storage.getCalculatorDraft());
      setStats(storage.getCalculationStats());
    } catch (e) {
      console.error("[AppDataContext] Error refreshing data", e);
    }
  }, []);

  // Initialize storage once on mount
  useEffect(() => {
    try {
      storage.runStorageMigrations();
      refreshData();
    } catch (e) {
      console.error("[AppDataContext] Initialization failed", e);
    } finally {
      setIsReady(true);
    }
  }, [refreshData]);

  const saveCalculation = useCallback((input, result, options) => {
    storage.saveCalculation(input, result, options);
    refreshData();
  }, [refreshData]);

  const deleteCalculation = useCallback((id) => {
    storage.deleteCalculation(id);
    refreshData();
  }, [refreshData]);

  const deleteAllCalculations = useCallback(() => {
    storage.deleteAllCalculations();
    refreshData();
  }, [refreshData]);

  const loadDemoData = useCallback(() => {
    storage.loadDemoCalculations(mockCalculations);
    refreshData();
  }, [refreshData]);

  const updateSettings = useCallback((partialSettings) => {
    storage.updateSettings(partialSettings);
    refreshData();
  }, [refreshData]);

  const resetSettings = useCallback(() => {
    storage.resetSettings();
    refreshData();
  }, [refreshData]);

  const saveDraft = useCallback((form) => {
    storage.saveCalculatorDraft(form);
    refreshData();
  }, [refreshData]);

  const clearDraft = useCallback(() => {
    storage.clearCalculatorDraft();
    refreshData();
  }, [refreshData]);

  const value = {
    isReady,
    calculations,
    settings,
    calculatorDraft,
    stats,
    saveCalculation,
    deleteCalculation,
    deleteAllCalculations,
    loadDemoData,
    updateSettings,
    resetSettings,
    saveDraft,
    clearDraft,
    refreshData
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};
