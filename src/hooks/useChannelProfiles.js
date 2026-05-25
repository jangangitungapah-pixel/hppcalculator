import { useContext } from 'react';
import { AppDataContext } from '../contexts/AppDataContext';

export const useChannelProfiles = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useChannelProfiles must be used within AppDataProvider');
  }

  const getProfileById = (id) => {
    return context.channelProfiles.find(p => p.id === id) || null;
  };

  return {
    channelProfiles: context.channelProfiles,
    getProfileById,
    saveChannelProfile: context.saveChannelProfile,
    updateChannelProfile: context.updateChannelProfile,
    deleteChannelProfile: context.deleteChannelProfile,
    loadPresetChannelProfiles: context.loadPresetChannelProfiles,
    loadDemoChannelProfiles: context.loadDemoChannelProfiles,
    hasProfiles: context.channelProfiles.length > 0
  };
};
