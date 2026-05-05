import { profile } from '@/data/profile';
import { socialLinks } from '@/data/socialLinks';
import { useLanguage } from '@/context/LanguageContext';
export default function Footer(){const{t}=useLanguage();return <footer className="footer"><div><h3>{profile.name}</h3><p>{t(profile.tagline)}</p></div><div className="footer-links">{socialLinks.map(s=><a key={s.id} href={s.url}>{s.platform}</a>)}</div><small>© {new Date().getFullYear()} Huzaifa Alahmad. All rights reserved.</small></footer>}
