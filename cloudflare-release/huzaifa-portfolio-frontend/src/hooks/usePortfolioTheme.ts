import { useEffect, useState } from 'react';

export function usePortfolioTheme() {
  const [theme, setTheme] = useState<'light'|'dark'>(() => {
    try {
      const saved = localStorage.getItem('huzaifa-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch { /* The toggle also works when browser storage is unavailable. */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  useEffect(() => {
    try { localStorage.setItem('huzaifa-theme', theme); } catch { /* Session-only preference. */ }
  }, [theme]);
  return { theme, toggleTheme: () => setTheme(value => value === 'light' ? 'dark' : 'light') };
}
