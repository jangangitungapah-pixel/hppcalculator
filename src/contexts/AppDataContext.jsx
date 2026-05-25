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

  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);

  const [channelProfiles, setChannelProfiles] = useState([]);
  const [pricingSimulations, setPricingSimulations] = useState([]);
  const [bundleSimulations, setBundleSimulations] = useState([]);

  // Centralized reload function
  const refreshData = useCallback(() => {
    try {
      setSettings(storage.getSettings());
      setCalculations(storage.getSavedCalculations());
      setCalculatorDraft(storage.getCalculatorDraft());
      setStats(storage.getCalculationStats());
      setIngredients(storage.getIngredients());
      setRecipes(storage.getRecipes());
      setProducts(storage.getProducts());
      setChannelProfiles(storage.getChannelProfiles());
      setPricingSimulations(storage.getPricingSimulations());
      setBundleSimulations(storage.getBundleSimulations());
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
    const saved = storage.saveCalculation(input, result, options);
    refreshData();
    return saved;
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

  // Ingredients Actions
  const saveIngredient = useCallback((input) => {
    const saved = storage.saveIngredient(input);
    refreshData();
    return saved;
  }, [refreshData]);

  const updateIngredient = useCallback((id, updates) => {
    const updated = storage.updateIngredient(id, updates);
    refreshData();
    return updated;
  }, [refreshData]);

  const deleteIngredient = useCallback((id) => {
    storage.deleteIngredient(id);
    refreshData();
  }, [refreshData]);

  const loadDemoIngredientsAction = useCallback((demoData) => {
    storage.loadDemoIngredients(demoData);
    refreshData();
  }, [refreshData]);

  // Recipes Actions
  const saveRecipe = useCallback((input, result) => {
    const saved = storage.saveRecipe(input, result);
    refreshData();
    return saved;
  }, [refreshData]);

  const updateRecipe = useCallback((id, updates) => {
    const updated = storage.updateRecipe(id, updates);
    refreshData();
    return updated;
  }, [refreshData]);

  const deleteRecipe = useCallback((id) => {
    storage.deleteRecipe(id);
    refreshData();
  }, [refreshData]);

  const loadDemoRecipesAction = useCallback((demoData, demoIngredients) => {
    storage.loadDemoRecipes(demoData, demoIngredients);
    refreshData();
  }, [refreshData]);

  // Products Actions
  const saveProduct = useCallback((input) => {
    const saved = storage.saveProduct(input);
    refreshData();
    return saved;
  }, [refreshData]);

  const updateProduct = useCallback((id, updates) => {
    const updated = storage.updateProduct(id, updates);
    refreshData();
    return updated;
  }, [refreshData]);

  const deleteProduct = useCallback((id) => {
    storage.deleteProduct(id);
    refreshData();
  }, [refreshData]);

  const loadDemoProductsAction = useCallback((demoData) => {
    storage.loadDemoProducts(demoData);
    refreshData();
  }, [refreshData]);

  const loadPhase7DemoData = useCallback((demoIngredients, demoRecipes, demoProducts) => {
    storage.loadDemoIngredients(demoIngredients || []);
    storage.loadDemoRecipes(demoRecipes || [], demoIngredients || []);
    storage.loadDemoProducts(demoProducts || []);
    refreshData();
  }, [refreshData]);

  // Channel Profiles Actions
  const saveChannelProfile = useCallback((input) => {
    const saved = storage.saveChannelProfile(input);
    refreshData();
    return saved;
  }, [refreshData]);

  const updateChannelProfile = useCallback((id, updates) => {
    const updated = storage.updateChannelProfile(id, updates);
    refreshData();
    return updated;
  }, [refreshData]);

  const deleteChannelProfile = useCallback((id) => {
    storage.deleteChannelProfile(id);
    refreshData();
  }, [refreshData]);

  const loadPresetChannelProfiles = useCallback(() => {
    storage.loadPresetChannelProfiles();
    refreshData();
  }, [refreshData]);

  const loadDemoChannelProfiles = useCallback((demoData) => {
    storage.loadDemoChannelProfiles(demoData);
    refreshData();
  }, [refreshData]);

  // Pricing Simulations Actions
  const savePricingSimulation = useCallback((input, result, type, source) => {
    const saved = storage.savePricingSimulation(input, result, type, source);
    refreshData();
    return saved;
  }, [refreshData]);

  const updatePricingSimulation = useCallback((id, updates) => {
    const updated = storage.updatePricingSimulation(id, updates);
    refreshData();
    return updated;
  }, [refreshData]);

  const deletePricingSimulation = useCallback((id) => {
    storage.deletePricingSimulation(id);
    refreshData();
  }, [refreshData]);

  const deleteAllPricingSimulations = useCallback(() => {
    storage.deleteAllPricingSimulations();
    refreshData();
  }, [refreshData]);

  const loadDemoPricingSimulations = useCallback((demoData) => {
    storage.loadDemoPricingSimulations(demoData);
    refreshData();
  }, [refreshData]);

  // Bundle Simulations Actions
  const saveBundleSimulation = useCallback((input, result, source) => {
    const saved = storage.saveBundleSimulation(input, result, source);
    refreshData();
    return saved;
  }, [refreshData]);

  const updateBundleSimulation = useCallback((id, updates) => {
    const updated = storage.updateBundleSimulation(id, updates);
    refreshData();
    return updated;
  }, [refreshData]);

  const deleteBundleSimulation = useCallback((id) => {
    storage.deleteBundleSimulation(id);
    refreshData();
  }, [refreshData]);

  const deleteAllBundleSimulations = useCallback(() => {
    storage.deleteAllBundleSimulations();
    refreshData();
  }, [refreshData]);

  const value = {
    isReady,
    calculations,
    settings,
    calculatorDraft,
    stats: {
      ...stats,
      channelProfileCount: channelProfiles.length,
      pricingSimulationCount: pricingSimulations.length,
      bundleSimulationCount: bundleSimulations.length
    },
    ingredients,
    recipes,
    products,
    channelProfiles,
    pricingSimulations,
    bundleSimulations,
    saveCalculation,
    deleteCalculation,
    deleteAllCalculations,
    loadDemoData,
    updateSettings,
    resetSettings,
    saveDraft,
    clearDraft,
    saveIngredient,
    updateIngredient,
    deleteIngredient,
    loadDemoIngredients: loadDemoIngredientsAction,
    saveRecipe,
    updateRecipe,
    deleteRecipe,
    loadDemoRecipes: loadDemoRecipesAction,
    saveProduct,
    updateProduct,
    deleteProduct,
    loadDemoProducts: loadDemoProductsAction,
    loadPhase7DemoData,
    saveChannelProfile,
    updateChannelProfile,
    deleteChannelProfile,
    loadPresetChannelProfiles,
    loadDemoChannelProfiles,
    savePricingSimulation,
    updatePricingSimulation,
    deletePricingSimulation,
    deleteAllPricingSimulations,
    loadDemoPricingSimulations,
    saveBundleSimulation,
    updateBundleSimulation,
    deleteBundleSimulation,
    deleteAllBundleSimulations,
    refreshData
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

