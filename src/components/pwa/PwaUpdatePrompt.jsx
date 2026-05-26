import React, { useEffect } from 'react';
import { usePwaContext } from '../../contexts/PwaContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';

export const PwaUpdatePrompt = () => {
  const { updateAvailable, applyUpdate } = usePwaContext();
  const { t } = useLanguage();
  const { addToast } = useToast();

  useEffect(() => {
    if (updateAvailable) {
      addToast({
        type: 'info',
        title: t('pwa.updateAvailableTitle'),
        message: t('pwa.updateAvailableBody'),
        action: {
          label: t('pwa.refresh'),
          onClick: () => applyUpdate(true)
        },
        duration: 30000 // keep it longer so user sees it
      });
    }
  }, [updateAvailable, addToast, t, applyUpdate]);

  return null;
};
