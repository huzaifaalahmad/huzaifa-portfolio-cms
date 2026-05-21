import { AppRouter } from './router';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
