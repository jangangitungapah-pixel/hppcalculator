import { getJson, setJson, isLocalStorageAvailable } from './localStorageClient';
import { STORAGE_KEYS } from './storageKeys';
import { getScopedStorageKey, getGuestStorageScope, getActiveStorageScope } from './storageScope';

const MIGRATION_KEY = 'modalin:v1:scopeMigrationDone';

// We migrate all these business and settings keys
const keysToMigrate = [
  STORAGE_KEYS.calculations,
  STORAGE_KEYS.settings,
  STORAGE_KEYS.INGREDIENTS,
  STORAGE_KEYS.RECIPES,
  STORAGE_KEYS.PRODUCTS,
  STORAGE_KEYS.CHANNEL_PROFILES,
  STORAGE_KEYS.PRICING_SIMULATIONS,
  STORAGE_KEYS.BUNDLE_SIMULATIONS
];

/**
 * Migrate global localStorage data to guest scope on first load.
 */
export const migrateGlobalDataToGuestScope = () => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const isMigrated = getJson(MIGRATION_KEY, false);
    if (isMigrated) return true; // Already migrated

    if (import.meta.env.DEV) {
      console.info('[ScopeMigration] Starting global to guest scope migration...');
    }

    const guestScope = getGuestStorageScope();
    let dataMigrated = false;
    const migrationSummary = {};

    keysToMigrate.forEach(baseKey => {
      const globalData = getJson(baseKey, null);
      if (globalData) {
        const guestKey = getScopedStorageKey(baseKey, guestScope);
        
        // Only write if guest doesn't already have something (safety check)
        const existingGuestData = getJson(guestKey, null);
        if (!existingGuestData) {
          setJson(guestKey, globalData);
          dataMigrated = true;
          
          let count = 0;
          if (Array.isArray(globalData)) {
            count = globalData.length;
          } else if (globalData && typeof globalData === 'object') {
            count = 1;
          }
          migrationSummary[baseKey] = count;
        }
      }
    });

    // Mark as done
    setJson(MIGRATION_KEY, true);
    
    if (import.meta.env.DEV) {
      console.info(`[ScopeMigration] Migration finished. Data migrated: ${dataMigrated}`, migrationSummary);
    }
    
    return true;
  } catch (error) {
    console.error('[ScopeMigration] Failed to migrate global data:', error);
    return false;
  }
};

/**
 * Import guest data into the active user scope.
 * Merges arrays by ID (newest updatedAt wins) and shallow merges settings (user priority).
 * Guest data is NOT deleted.
 */
export const importGuestDataToActiveUser = () => {
  if (!isLocalStorageAvailable()) {
    return { success: false, importedCounts: {}, skippedCounts: {} };
  }
  
  const activeScope = getActiveStorageScope();
  if (activeScope.type !== 'user' || !activeScope.uid) {
    console.warn('[ScopeMigration] Cannot import guest data: Active scope is not user.');
    return { success: false, importedCounts: {}, skippedCounts: {} };
  }

  const guestScope = getGuestStorageScope();
  const importedCounts = {};
  const skippedCounts = {};

  try {
    // Array business modules
    const arrayModules = [
      { key: STORAGE_KEYS.calculations, name: 'calculations' },
      { key: STORAGE_KEYS.INGREDIENTS, name: 'ingredients' },
      { key: STORAGE_KEYS.RECIPES, name: 'recipes' },
      { key: STORAGE_KEYS.PRODUCTS, name: 'products' },
      { key: STORAGE_KEYS.CHANNEL_PROFILES, name: 'channelProfiles' },
      { key: STORAGE_KEYS.PRICING_SIMULATIONS, name: 'pricingSimulations' },
      { key: STORAGE_KEYS.BUNDLE_SIMULATIONS, name: 'bundleSimulations' }
    ];

    arrayModules.forEach(({ key, name }) => {
      const guestKey = getScopedStorageKey(key, guestScope);
      const userKey = getScopedStorageKey(key, activeScope);

      const guestData = getJson(guestKey, []);
      const userData = getJson(userKey, []);

      importedCounts[name] = 0;
      skippedCounts[name] = 0;

      if (Array.isArray(guestData) && guestData.length > 0) {
        const userMap = new Map(userData.map(item => [item.id, item]));
        
        guestData.forEach(guestItem => {
          if (!guestItem.id) {
            skippedCounts[name]++;
            return;
          }
          
          if (userMap.has(guestItem.id)) {
            const userItem = userMap.get(guestItem.id);
            const userTime = new Date(userItem.updatedAt || userItem.createdAt || 0).getTime();
            const guestTime = new Date(guestItem.updatedAt || guestItem.createdAt || 0).getTime();
            
            // If guest item is newer, overwrite user item
            if (guestTime > userTime) {
              userMap.set(guestItem.id, guestItem);
              importedCounts[name]++;
            } else {
              skippedCounts[name]++;
            }
          } else {
            userMap.set(guestItem.id, guestItem);
            importedCounts[name]++;
          }
        });

        setJson(userKey, Array.from(userMap.values()));
      }
    });

    // Settings module (non-array, object)
    const settingsGuestKey = getScopedStorageKey(STORAGE_KEYS.settings, guestScope);
    const settingsUserKey = getScopedStorageKey(STORAGE_KEYS.settings, activeScope);

    const guestSettings = getJson(settingsGuestKey, null);
    const userSettings = getJson(settingsUserKey, null);

    importedCounts.settings = 0;
    skippedCounts.settings = 0;

    if (guestSettings) {
      // Merge shallow: user settings take priority except where user settings is empty
      // If userSettings is missing, it will use all guestSettings keys.
      const mergedSettings = { ...guestSettings, ...(userSettings || {}) };
      setJson(settingsUserKey, mergedSettings);
      importedCounts.settings = 1;
    }

    const summary = {
      success: true,
      importedCounts,
      skippedCounts
    };

    if (import.meta.env.DEV) {
      console.info('[ScopeMigration] Guest to User Import Summary:', summary);
    }

    return summary;
  } catch (error) {
    console.error('[ScopeMigration] Failed to import guest data:', error);
    return { success: false, importedCounts, skippedCounts, error: error.message };
  }
};
