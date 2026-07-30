import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { setLanguage, getLanguage, t, subscribeToLanguageChange, type Lang } from '../lib/i18n';

export type AppLang = Lang | 'bilingual';

interface I18nContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  lang: Lang;
  setLang: (lang: AppLang) => void;
}

const I18nContext = createContext<I18nContextType>({
  t: (key: string, params?: Record<string, string | number>) => t(key, params),
  lang: getLanguage(),
  setLang: setLanguage,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState(getLanguage());

  useEffect(() => {
    return subscribeToLanguageChange(() => {
      setLangState(getLanguage());
    });
  }, []);

  const setLang = (l: AppLang) => {
    setLanguage(l);
  };

  const contextT = (key: string, params?: Record<string, string | number>) => t(key, params);

  return (
    <I18nContext.Provider value={{ t: contextT, lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}
