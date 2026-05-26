import { STORAGE_KEYS } from './storageKeys';
import { getScopedJson, setScopedJson } from './localStorageClient';
import { defaultChannelProfiles } from '../channelPricing/channelPresets';

export const getChannelProfiles = () => {
  return getScopedJson(STORAGE_KEYS.CHANNEL_PROFILES, []);
};

export const saveChannelProfiles = (profiles) => {
  setScopedJson(STORAGE_KEYS.CHANNEL_PROFILES, profiles);
};

export const getChannelProfileById = (id) => {
  const profiles = getChannelProfiles();
  return profiles.find(p => p.id === id) || null;
};

export const saveChannelProfile = (input) => {
  const profiles = getChannelProfiles();
  
  const newProfile = {
    ...input,
    id: crypto.randomUUID(),
    version: 1,
    isPreset: false,
    source: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  profiles.push(newProfile);
  saveChannelProfiles(profiles);
  return newProfile;
};

export const updateChannelProfile = (id, updates) => {
  const profiles = getChannelProfiles();
  const index = profiles.findIndex(p => p.id === id);
  
  if (index !== -1) {
    profiles[index] = {
      ...profiles[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveChannelProfiles(profiles);
    return profiles[index];
  }
  return null;
};

export const deleteChannelProfile = (id) => {
  const profiles = getChannelProfiles();
  const filtered = profiles.filter(p => p.id !== id);
  saveChannelProfiles(filtered);
};

export const hasChannelProfiles = () => {
  const profiles = getChannelProfiles();
  return profiles.length > 0;
};

export const loadPresetChannelProfiles = () => {
  const profiles = getChannelProfiles();
  
  // Only add presets that don't already exist by checking the preset ID
  const existingPresetIds = profiles.map(p => p.id);
  const newPresets = defaultChannelProfiles.filter(preset => !existingPresetIds.includes(preset.id));
  
  if (newPresets.length > 0) {
    const combined = [...profiles, ...newPresets];
    saveChannelProfiles(combined);
  }
};

export const loadDemoChannelProfiles = (demoProfiles) => {
  const current = getChannelProfiles();
  const userProfiles = current.filter(p => p.source !== 'demo');
  
  const newDemo = demoProfiles.map(d => ({
    ...d,
    id: d.id || crypto.randomUUID(),
    source: 'demo'
  }));
  
  saveChannelProfiles([...newDemo, ...userProfiles]);
};

export const clearDemoChannelProfiles = () => {
  const current = getChannelProfiles();
  const userProfiles = current.filter(p => p.source !== 'demo');
  saveChannelProfiles(userProfiles);
  return userProfiles;
};
