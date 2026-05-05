import { AppRouter } from './router';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import GlobalBackground from '@/components/ui/GlobalBackground';
import MouseGlow from '@/components/ui/MouseGlow';
import CustomCursor from '@/components/ui/CustomCursor';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <GlobalBackground />
          <MouseGlow />
          <CustomCursor />
          <div className="app-space-layer" />
          <AppRouter />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}