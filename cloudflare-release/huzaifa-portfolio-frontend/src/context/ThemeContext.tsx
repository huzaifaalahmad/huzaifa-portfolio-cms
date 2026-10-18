import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
type Theme='light'|'dark';
const ThemeContext=createContext<{theme:Theme;toggleTheme:()=>void}|null>(null);
export function ThemeProvider({children}:{children:ReactNode}){ const [theme,setTheme]=useState<Theme>(()=>(localStorage.getItem('theme') as Theme)||'dark'); useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('theme',theme)},[theme]); return <ThemeContext.Provider value={{theme,toggleTheme:()=>setTheme(t=>t==='dark'?'light':'dark')}}>{children}</ThemeContext.Provider> }
export const useTheme=()=>{const c=useContext(ThemeContext); if(!c) throw new Error('ThemeProvider missing'); return c;}
