import { useState, useCallback, useMemo } from 'react';
import { dictionary } from '../i18n/dictionary';

// Very basic in-memory language hook for MVP
let currentLang = 'id';

export function useLanguage() {
  const [lang, setLang] = useState(currentLang);

  const setLanguage = useCallback((newLang) => {
    currentLang = newLang;
    setLang(newLang);
  }, []);

  const t = useCallback((key) => {
    const keys = key.split('.');
    let result = dictionary[lang];
    for (const k of keys) {
      if (result === undefined) return key;
      result = result[k];
    }
    return result || key;
  }, [lang]);

  return { lang, setLanguage, t };
}
