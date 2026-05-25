import { getJson, setJson, isLocalStorageAvailable } from './localStorageClient';
import { STORAGE_KEYS } from './storageKeys';
import { getScopedStorageKey, getGuestStorageScope, getActiveStorageScope } from './storageScope';

const MIGRATION_KEY = 'modalin:v1:scopeMigrationDone';

// We only migrate business data keys
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

    keysToMigrate.forEach(baseKey => {
      const globalData = getJson(baseKey, null);
      if (globalData) {
        // If global data exists, copy it to guest scope
        const guestKey = getScopedStorageKey(baseKey, guestScope);
        
        // Only write if guest doesn't already have something (safety check)
        const existingGuestData = getJson(guestKey, null);
        if (!existingGuestData) {
          setJson(guestKey, globalData);
          dataMigrated = true;
          if (import.meta.env.DEV) {
            console.debug(`[ScopeMigration] Migrated ${baseKey} -> ${guestKey}`);
          }
        }
      }
    });

    // Mark as done
    setJson(MIGRATION_KEY, true);
    
    if (import.meta.env.DEV) {
      console.info(`[ScopeMigration] Migration finished. Data migrated: ${dataMigrated}`);
    }
    
    return true;
  } catch (error) {
    console.error('[ScopeMigration] Failed to migrate global data:', error);
    return false;
  }
};

export const importGuestDataToActiveUser = () => {
  if (!isLocalStorageAvailable()) return false;
  const activeScope = getActiveStorageScope();
  
  if (activeScope.type !== 'user') {
    console.warn('[ScopeMigration] Cannot import guest data: Active scope is not user.');
    return false;
  }

  try {
    const guestScope = getGuestStorageScope();
    let dataImported = false;

    keysToMigrate.forEach(baseKey => {
      const guestKey = getScopedStorageKey(baseKey, guestScope);
      const userKey = getScopedStorageKey(baseKey, activeScope);

      const guestData = getJson(guestKey, null);
      if (guestData) {
        // Read existing user data to not blindly overwrite if they want to merge
        // For simplicity, we just overwrite or merge arrays.
        // Array based vs Object based (settings)
        const existingUserData = getJson(userKey, null);
        
        if (Array.isArray(guestData)) {
          const userArr = Array.isArray(existingUserData) ? existingUserData : [];
          // Deduplicate by id if possible, but for simplicity, just concat and filter dupes
          const combined = [...userArr, ...guestData];
          const unique = Array.from(new Map(combined.map(item => [item.id || JSON.stringify(item), item])).values());
          setJson(userKey, unique);
        } else {
          // Object like settings
          const merged = { ...(existingUserData || {}), ...guestData };
          setJson(userKey, merged);
        }
        dataImported = true;
      }
    });

    return dataImported;
  } catch (error) {
    console.error('[ScopeMigration] Failed to import guest data:', error);
    return false;
  }
};
