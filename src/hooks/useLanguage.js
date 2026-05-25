import { useCallback, useEffect } from 'react';
import { dictionary } from '../i18n/dictionary';
import { useAppData } from './useAppData';
import { useToast } from './useToast';

export function useLanguage() {
  const { settings, updateSettings, isReady } = useAppData();
  const { addToast } = useToast();

  const lang = settings?.language || 'id';

  const setLanguage = useCallback((newLang) => {
    if (newLang !== lang) {
      updateSettings({ language: newLang });
      
      const messages = {
        'id': 'Bahasa diperbarui',
        'en': 'Language updated'
      };
      
      addToast({
        type: 'success',
        title: messages[newLang] || messages['id']
      });
    }
  }, [lang, updateSettings, addToast]);

  const t = useCallback((key) => {
    // Prevent breaking if not ready
    if (!isReady) return key;

    const keys = key.split('.');
    let result = dictionary[lang] || dictionary['id'];
    
    for (const k of keys) {
      if (result === undefined) return key;
      result = result[k];
    }
    return result || key;
  }, [lang, isReady]);

  return { lang, setLanguage, t };
}
