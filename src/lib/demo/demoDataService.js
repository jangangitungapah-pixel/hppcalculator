import { mockCalculations } from '../../data/mockCalculations';
import { demoIngredients } from '../../data/demoIngredients';
import { demoRecipes } from '../../data/demoRecipes';
import { demoProducts } from '../../data/demoProducts';
import { demoChannelProfiles } from '../../data/demoChannelProfiles';
import { demoPricingSimulations } from '../../data/demoPricingSimulations';
import { demoInventorySettings, demoStockMovements } from '../../data/demoInventory';
import { demoSuppliers } from '../../data/demoSuppliers';
import { demoPurchaseLogs, demoPurchaseItems } from '../../data/demoPurchases';

import {
  getSavedCalculations,
  loadDemoCalculations,
  clearDemoCalculations
} from '../storage/calculationsStorage';
import {
  getIngredients,
  loadDemoIngredients,
  clearDemoIngredients
} from '../storage/ingredientsStorage';
import {
  getRecipes,
  loadDemoRecipes,
  clearDemoRecipes
} from '../storage/recipesStorage';
import {
  getProducts,
  loadDemoProducts,
  clearDemoProducts
} from '../storage/productsStorage';
import {
  getChannelProfiles,
  loadDemoChannelProfiles,
  clearDemoChannelProfiles
} from '../storage/channelProfilesStorage';
import {
  getPricingSimulations,
  loadDemoPricingSimulations,
  clearDemoPricingSimulations
} from '../storage/pricingSimulationsStorage';
import {
  getBundleSimulations,
  clearDemoBundleSimulations
} from '../storage/bundleSimulationsStorage';
import {
  getInventorySettings,
  getStockMovements,
  loadDemoInventorySettings,
  loadDemoStockMovements,
  clearDemoInventorySettings,
  clearDemoStockMovements
} from '../storage/inventoryStorage';
import {
  getSuppliers,
  loadDemoSuppliers,
  clearDemoSuppliers
} from '../storage/suppliersStorage';
import {
  getPurchaseLogs,
  getPurchaseItems,
  loadDemoPurchases,
  clearDemoPurchases
} from '../storage/purchaseStorage';

/**
 * 1. Load mockCalculations only to saved calculations
 */
export const loadDemoCalculationsOnly = () => {
  return loadDemoCalculations(mockCalculations);
};

/**
 * 2. Load demo business library (Ingredients -> Recipes -> Products)
 */
export const loadDemoBusinessLibrary = () => {
  const ingredients = loadDemoIngredients(demoIngredients);
  const recipes = loadDemoRecipes(demoRecipes);
  const products = loadDemoProducts(demoProducts);
  const inventorySettings = loadDemoInventorySettings(demoInventorySettings);
  const stockMovements = loadDemoStockMovements(demoStockMovements);
  const suppliers = loadDemoSuppliers(demoSuppliers);
  const purchases = loadDemoPurchases(demoPurchaseLogs, demoPurchaseItems);
  return { ingredients, recipes, products, inventorySettings, stockMovements, suppliers, purchases };
};

/**
 * 3. Load complete demo workspace (calculations, business library, channel profiles, simulations)
 */
export const loadCompleteDemoWorkspace = () => {
  loadDemoCalculationsOnly();
  loadDemoBusinessLibrary();
  
  if (demoChannelProfiles && demoChannelProfiles.length > 0) {
    loadDemoChannelProfiles(demoChannelProfiles);
  }
  if (demoPricingSimulations && demoPricingSimulations.length > 0) {
    loadDemoPricingSimulations(demoPricingSimulations);
  }
  
  return true;
};

/**
 * 4. Clear only demo data (source === "demo") from all modules
 */
export const clearDemoDataOnly = () => {
  clearDemoCalculations();
  clearDemoIngredients();
  clearDemoRecipes();
  clearDemoProducts();
  clearDemoChannelProfiles();
  clearDemoPricingSimulations();
  clearDemoBundleSimulations();
  clearDemoInventorySettings();
  clearDemoStockMovements();
  clearDemoSuppliers();
  clearDemoPurchases();
  return true;
};

/**
 * 5. Return true if there is any record with source === "demo" in any module
 */
export const hasDemoData = () => {
  const calculations = getSavedCalculations();
  const ingredients = getIngredients();
  const recipes = getRecipes();
  const products = getProducts();
  const channelProfiles = getChannelProfiles();
  const pricingSimulations = getPricingSimulations();
  const bundleSimulations = getBundleSimulations();
  const inventorySettings = getInventorySettings();
  const stockMovements = getStockMovements();
  const suppliers = getSuppliers();
  const purchaseLogs = getPurchaseLogs();
  const purchaseItems = getPurchaseItems();

  return (
    calculations.some(c => c.source === 'demo') ||
    ingredients.some(i => i.source === 'demo') ||
    recipes.some(r => r.source === 'demo') ||
    products.some(p => p.source === 'demo') ||
    channelProfiles.some(p => p.source === 'demo') ||
    pricingSimulations.some(s => s.source === 'demo') ||
    bundleSimulations.some(s => s.source === 'demo') ||
    inventorySettings.some(s => s.source === 'demo') ||
    stockMovements.some(s => s.source === 'demo') ||
    suppliers.some(s => s.source === 'demo') ||
    purchaseLogs.some(l => l.source === 'demo') ||
    purchaseItems.some(i => i.source === 'demo')
  );
};

/**
 * 6. Get counts of demo data per module
 */
export const getDemoDataSummary = () => {
  const calculations = getSavedCalculations().filter(c => c.source === 'demo').length;
  const ingredients = getIngredients().filter(i => i.source === 'demo').length;
  const recipes = getRecipes().filter(r => r.source === 'demo').length;
  const products = getProducts().filter(p => p.source === 'demo').length;
  const channelProfiles = getChannelProfiles().filter(p => p.source === 'demo').length;
  const pricingSimulations = getPricingSimulations().filter(s => s.source === 'demo').length;
  const bundleSimulations = getBundleSimulations().filter(s => s.source === 'demo').length;
  const inventorySettings = getInventorySettings().filter(s => s.source === 'demo').length;
  const stockMovements = getStockMovements().filter(s => s.source === 'demo').length;
  const suppliers = getSuppliers().filter(s => s.source === 'demo').length;
  const purchaseLogs = getPurchaseLogs().filter(l => l.source === 'demo').length;
  const purchaseItems = getPurchaseItems().filter(i => i.source === 'demo').length;

  const total = calculations + ingredients + recipes + products + channelProfiles + pricingSimulations + bundleSimulations + inventorySettings + stockMovements + suppliers + purchaseLogs + purchaseItems;

  return {
    calculations,
    ingredients,
    recipes,
    products,
    channelProfiles,
    pricingSimulations,
    bundleSimulations,
    inventorySettings,
    stockMovements,
    suppliers,
    purchaseLogs,
    purchaseItems,
    total
  };
};
