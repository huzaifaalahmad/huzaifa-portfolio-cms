import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { BilingualText } from '@/types';

type Lang = 'en' | 'ar';
type Dir = 'ltr' | 'rtl';

type Ctx = {
  language: Lang;
  setLanguage: (l: Lang) => void;
  t: (text: BilingualText) => string;
  dir: Dir;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Lang>(
    () => (localStorage.getItem('lang') as Lang) || 'en'
  );

  const dir: Dir = language === 'ar' ? 'rtl' : 'ltr';

  const value = useMemo<Ctx>(
    () => ({
      language,
      setLanguage: (l: Lang) => {
        localStorage.setItem('lang', l);
        setLanguageState(l);
      },
      t: (text: BilingualText) => text[language],
      dir,
    }),
    [language, dir]
  );

  return (
    <LanguageContext.Provider value={value}>
      <div dir={dir} lang={language}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('LanguageProvider missing');
  return context;
};