import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as storage from '../lib/storage';
import { mockCalculations } from '../data/mockCalculations';
import * as demoService from '../lib/demo/demoDataService';

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
  const [inventorySettings, setInventorySettings] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [inventorySnapshots, setInventorySnapshots] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseLogs, setPurchaseLogs] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);

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
      setInventorySettings(storage.getInventorySettings());
      setStockMovements(storage.getStockMovements());
      setInventorySnapshots(storage.getInventorySnapshots());
      setSuppliers(storage.getSuppliers());
      setPurchaseLogs(storage.getPurchaseLogs());
      setPurchaseItems(storage.getPurchaseItems());
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
    demoService.loadCompleteDemoWorkspace();
    refreshData();
  }, [refreshData]);

  const loadDemoCalculationsOnly = useCallback(() => {
    demoService.loadDemoCalculationsOnly();
    refreshData();
  }, [refreshData]);

  const loadDemoBusinessLibrary = useCallback(() => {
    demoService.loadDemoBusinessLibrary();
    refreshData();
  }, [refreshData]);

  const loadCompleteDemoWorkspace = useCallback(() => {
    demoService.loadCompleteDemoWorkspace();
    refreshData();
  }, [refreshData]);

  const clearDemoDataOnly = useCallback(() => {
    demoService.clearDemoDataOnly();
    refreshData();
  }, [refreshData]);

  const getDemoDataSummary = useCallback(() => {
    return demoService.getDemoDataSummary();
  }, []);

  const hasDemoData = useCallback(() => {
    return demoService.hasDemoData();
  }, []);

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

  // Inventory Actions
  const saveInventorySetting = useCallback((input) => {
    const saved = storage.saveInventorySetting(input);
    refreshData();
    return saved;
  }, [refreshData]);

  const updateInventorySetting = useCallback((ingredientId, patch) => {
    const updated = storage.updateInventorySetting(ingredientId, patch);
    refreshData();
    return updated;
  }, [refreshData]);

  const deleteInventorySetting = useCallback((ingredientId) => {
    storage.deleteInventorySetting(ingredientId);
    refreshData();
  }, [refreshData]);

  const saveStockMovement = useCallback((input) => {
    const saved = storage.saveStockMovement(input);
    refreshData();
    return saved;
  }, [refreshData]);

  const updateStockMovement = useCallback((id, patch) => {
    const updated = storage.updateStockMovement(id, patch);
    refreshData();
    return updated;
  }, [refreshData]);

  const deleteStockMovement = useCallback((id) => {
    storage.deleteStockMovement(id);
    refreshData();
  }, [refreshData]);

  const getInventorySnapshotByIngredientId = useCallback((ingredientId) => {
    return storage.getInventorySnapshotByIngredientId(ingredientId);
  }, []);

  // Supplier Actions
  const saveSupplier = useCallback((input) => {
    const saved = storage.saveSupplier(input);
    refreshData();
    return saved;
  }, [refreshData]);

  const updateSupplier = useCallback((id, patch) => {
    const updated = storage.updateSupplier(id, patch);
    refreshData();
    return updated;
  }, [refreshData]);

  const deleteSupplier = useCallback((id) => {
    storage.deleteSupplier(id);
    refreshData();
  }, [refreshData]);

  // Purchase Actions
  const savePurchaseLog = useCallback((input, items) => {
    const result = storage.savePurchaseLog(input, items);
    refreshData();
    return result;
  }, [refreshData]);

  const updatePurchaseLog = useCallback((id, patch) => {
    const updated = storage.updatePurchaseLog(id, patch);
    refreshData();
    return updated;
  }, [refreshData]);

  const deletePurchaseLog = useCallback((id) => {
    storage.deletePurchaseLog(id);
    refreshData();
  }, [refreshData]);

  const getPurchaseDetail = useCallback((id) => {
    return storage.getPurchaseDetail(id);
  }, []);

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
    inventorySettings,
    stockMovements,
    inventorySnapshots,
    saveCalculation,
    deleteCalculation,
    deleteAllCalculations,
    loadDemoData,
    loadDemoCalculationsOnly,
    loadDemoBusinessLibrary,
    loadCompleteDemoWorkspace,
    clearDemoDataOnly,
    getDemoDataSummary,
    hasDemoData,
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
    saveInventorySetting,
    updateInventorySetting,
    deleteInventorySetting,
    saveStockMovement,
    updateStockMovement,
    deleteStockMovement,
    getInventorySnapshotByIngredientId,
    suppliers,
    purchaseLogs,
    purchaseItems,
    saveSupplier,
    updateSupplier,
    deleteSupplier,
    savePurchaseLog,
    updatePurchaseLog,
    deletePurchaseLog,
    getPurchaseDetail,
    refreshData
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

