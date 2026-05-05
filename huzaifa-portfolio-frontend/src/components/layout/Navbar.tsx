import { Link } from 'react-router-dom';
import { Languages, Moon, Sun } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const links = [
    ['#about', 'About', 'نبذة'],
    ['#services', 'Services', 'الخدمات'],
    ['#projects', 'Work', 'الأعمال'],
    ['#contact', 'Contact', 'تواصل'],
  ];

  return (
    <header className="navbar ultra-navbar">
      <Link to="/" className="brand brand-image">
        <img src="/assets/images/logo.png" alt="Huzaifa logo" />
        <strong>{language === 'ar' ? 'المهندس حذيفة' : 'Eng. Huzaifa'}</strong>
      </Link>

      <nav>
        {links.map(([href, en, ar]) => (
          <a key={href} href={href}>
            {language === 'ar' ? ar : en}
          </a>
        ))}
      </nav>

      <div className="nav-actions">
        <button
          className="icon-action"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          aria-label="Change language"
        >
          <Languages size={18} />
          <span>{language === 'en' ? 'AR' : 'EN'}</span>
        </button>

        <button className="icon-action icon-only" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </div>
    </header>
  );
}