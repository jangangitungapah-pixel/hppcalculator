import { getScopedStorageKey, getActiveStorageScope, getGuestStorageScope } from './storageScope';
import { getJson } from './localStorageClient';
import { STORAGE_KEYS } from './storageKeys';

/**
 * Get count of business data for a given scope.
 * @param {object} scope
 * @returns {{
 *   calculations: number,
 *   ingredients: number,
 *   recipes: number,
 *   products: number,
 *   channelProfiles: number,
 *   pricingSimulations: number,
 *   bundleSimulations: number,
 *   total: number
 * }}
 */
export const getBusinessDataCountsForScope = (scope) => {
  const calculations = getJson(getScopedStorageKey(STORAGE_KEYS.calculations, scope), []);
  const ingredients = getJson(getScopedStorageKey(STORAGE_KEYS.INGREDIENTS, scope), []);
  const recipes = getJson(getScopedStorageKey(STORAGE_KEYS.RECIPES, scope), []);
  const products = getJson(getScopedStorageKey(STORAGE_KEYS.PRODUCTS, scope), []);
  const channelProfiles = getJson(getScopedStorageKey(STORAGE_KEYS.CHANNEL_PROFILES, scope), []);
  const pricingSimulations = getJson(getScopedStorageKey(STORAGE_KEYS.PRICING_SIMULATIONS, scope), []);
  const bundleSimulations = getJson(getScopedStorageKey(STORAGE_KEYS.BUNDLE_SIMULATIONS, scope), []);

  const counts = {
    calculations: Array.isArray(calculations) ? calculations.length : 0,
    ingredients: Array.isArray(ingredients) ? ingredients.length : 0,
    recipes: Array.isArray(recipes) ? recipes.length : 0,
    products: Array.isArray(products) ? products.length : 0,
    channelProfiles: Array.isArray(channelProfiles) ? channelProfiles.length : 0,
    pricingSimulations: Array.isArray(pricingSimulations) ? pricingSimulations.length : 0,
    bundleSimulations: Array.isArray(bundleSimulations) ? bundleSimulations.length : 0,
  };

  const total = counts.calculations +
                counts.ingredients +
                counts.recipes +
                counts.products +
                counts.channelProfiles +
                counts.pricingSimulations +
                counts.bundleSimulations;

  return { ...counts, total };
};

/**
 * Check if a given scope contains any business data.
 * @param {object} scope
 * @returns {boolean}
 */
export const hasBusinessDataForScope = (scope) => {
  return getBusinessDataCountsForScope(scope).total > 0;
};

/**
 * Get business data counts for guest scope.
 * @returns {object}
 */
export const getGuestBusinessDataCounts = () => {
  return getBusinessDataCountsForScope(getGuestStorageScope());
};

/**
 * Check if guest scope has business data.
 * @returns {boolean}
 */
export const hasGuestBusinessData = () => {
  return hasBusinessDataForScope(getGuestStorageScope());
};

/**
 * Get business data counts for active scope.
 * @returns {object}
 */
export const getActiveScopeBusinessDataCounts = () => {
  return getBusinessDataCountsForScope(getActiveStorageScope());
};

/**
 * Check if active scope has business data.
 * @returns {boolean}
 */
export const hasActiveScopeBusinessData = () => {
  return hasBusinessDataForScope(getActiveStorageScope());
};
