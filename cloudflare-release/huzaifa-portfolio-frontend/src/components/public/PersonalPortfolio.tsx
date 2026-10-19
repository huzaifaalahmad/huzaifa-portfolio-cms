import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { FaBehance, FaGithub, FaLinkedinIn, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { usePortfolioTheme } from '@/hooks/usePortfolioTheme';
import ProjectMark from './ProjectMark';
import { useLanguage } from '@/context/LanguageContext';
import { usePublicContent } from '@/hooks/usePublicContent';
import '@/styles/personal-refined.css';

type Copy = { en: string; ar: string };
const asset = '/assets/personal/';
const technicalSkills = [
 {title:{en:'Web development',ar:'تطوير الويب'},tools:'HTML · CSS · JavaScript · TypeScript · React',description:{en:'Responsive interfaces and interactive web applications.',ar:'واجهات متجاوبة وتطبيقات ويب تفاعلية.'}},
 {title:{en:'Software project experience',ar:'خبرة المشاريع البرمجية'},tools:'Node.js · Python · APIs · SQL',description:{en:'Applied through personal projects, with AI-assisted implementation, testing and refinement.',ar:'تطبيق عملي ضمن مشاريعي الشخصية، مع تنفيذ واختبار وتطوير بمساعدة الذكاء الاصطناعي.'}},
 {title:{en:'AI production systems',ar:'أنظمة الإنتاج بالذكاء الاصطناعي'},tools:'ChatGPT · Gemini · Google Flow · NotebookLM · Seedance',description:{en:'Connected research, prompt development, content generation and production workflows.',ar:'ربط البحث وتطوير التعليمات وتوليد المحتوى بمراحل الإنتاج.'}},
];
const capabilities: {title:Copy; description:Copy; tools:string}[] = [
  {title:{en:'Brand & campaign design',ar:'الهوية وتصميم الحملات'},description:{en:'Visual identities, campaign systems, social graphics, catalogues and print-ready layouts.',ar:'هويات بصرية وأنظمة حملات وتصاميم سوشال ميديا وكتالوغات ومواد جاهزة للطباعة.'},tools:'Photoshop · Illustrator · InDesign'},
  {title:{en:'Filming & video production',ar:'التصوير وإنتاج الفيديو'},description:{en:'Product photography, original filming, short-form editing and AI-assisted video production.',ar:'تصوير منتجات ولقطات حقيقية ومونتاج فيديو قصير وإنتاج مشاهد بمساعدة الذكاء الاصطناعي.'},tools:'CapCut · DaVinci Resolve · Premiere Pro'},
  {title:{en:'Marketing & AI workflows',ar:'التسويق وأنظمة عمل AI'},description:{en:'Content calendars, daily publishing, campaign creatives and integrated research-to-production workflows.',ar:'خطط محتوى ونشر يومي ومواد إعلانية وأنظمة تربط البحث والتخطيط بالإنتاج.'},tools:'ChatGPT · Gemini · Flow · NotebookLM · Seedance'},
  {title:{en:'Digital projects',ar:'المشاريع الرقمية'},description:{en:'An Information Engineering foundation applied to websites, content management and AI-assisted software development.',ar:'توظيف خلفيتي في هندسة المعلوماتية في تطوير المواقع وإدارة المحتوى والبرمجة بمساعدة AI.'},tools:'HTML · CSS · JavaScript · React · TypeScript'},
];
export default function PersonalPortfolio() {
 const {content:profile,isPreview}=usePublicContent();
 const {language,setLanguage}=useLanguage();
 const t=(copy:Copy)=>copy[language];
 const say=(en:string,ar:string)=>language==='ar'?ar:en;
 const {theme,toggleTheme}=usePortfolioTheme();
 useEffect(()=>{
   document.title=t(profile.site.name)+' | '+t(profile.site.role);
   document.documentElement.lang=language;
   document.documentElement.dir=language==='ar'?'rtl':'ltr';
 },[language,profile.site.name,profile.site.role]);
 const nav=[['work',say('Work','الأعمال')],['about',say('About','عني')],['experience',say('Experience','الخبرة')],['contact',say('Contact','تواصل')]];
 return <div className="portfolio-v2" data-theme={theme} dir={language==='ar'?'rtl':'ltr'}>
  {isPreview&&<div className="cms-preview-banner">{say('Unsaved preview — only visible in this tab','معاينة مسودة غير محفوظة — تظهر في هذه الصفحة فقط')} <a href="/cms">{say('Back to editor','العودة للإدارة')}</a></div>}
  <a className="pv-skip" href="#main">{say('Skip to content','انتقل إلى المحتوى')}</a>
  <header className="pv-header">
   <a href="#" className="pv-brand" aria-label={say('Huzaifa Alahmad — home','حذيفة الأحمد — الرئيسية')}><img src={asset+'h-logo.svg'} alt=""/><span>Huzaifa<br/><small>Alahmad</small></span></a>
   <nav aria-label={say('Main navigation','التنقل الرئيسي')}>{nav.map(([id,name])=><a key={id} href={'#'+id}>{name}</a>)}</nav>
   <div className="pv-header-actions"><button className="pv-theme" onClick={toggleTheme} aria-label={say('Dark mode','الوضع الليلي')} aria-pressed={theme==='dark'} title={say('Toggle light / dark','تبديل الوضع الفاتح / الليلي')}>{theme==='dark'?<Sun size={18} aria-hidden="true"/>:<Moon size={18} aria-hidden="true"/>}</button>
   <button className="pv-language" onClick={()=>setLanguage(language==='en'?'ar':'en')}>{language==='en'?'العربية':'English'}</button></div>
  </header>
  <main id="main">
   <section className="pv-hero" aria-labelledby="hero-title">
    <div className="pv-intro"><p className="pv-kicker">{say('Creative practice, engineering foundation','إبداع بصري وخلفية هندسية')}</p><h1 id="hero-title">{t(profile.site.name)}</h1>
     <p className="pv-role">{t(profile.site.role)}</p>
     <p className="pv-lead"><strong>{say('Design. Film. Build.','أصمّم. أصوّر. أطوّر.')}</strong>{t(profile.site.intro)}</p>
     <div className="pv-actions"><a className="pv-button" href="#work">{say('Explore my work','شاهد أعمالي')} <span aria-hidden="true">↗</span></a><a className="pv-link" href={profile.site.cvUrl} download>{say('Download CV','تحميل السيرة')} ↓</a></div>
     <p className="pv-location">{t(profile.site.location)}</p>
    </div>
    <div className="pv-portrait-stage"><figure className="pv-portrait"><img src={profile.site.portrait===asset+'portrait.png'?asset+'portrait.webp':profile.site.portrait} width="1254" height="1254" alt={say('Portrait of Huzaifa Alahmad','صورة حذيفة الأحمد')} fetchPriority="high" decoding="async"/></figure><div className="pv-seal-space" aria-hidden="true"><div className="pv-seal"><div className="pv-seal-back"/><div className="pv-seal-edge"/><div className="pv-seal-front"><img src={asset+'h-logo.svg'} alt=""/></div></div></div></div>
   </section>
   <section id="work" className="pv-section pv-behance-section">
    <div className="pv-section-head"><div><p className="pv-kicker">{say('Creative work','أعمالي الإبداعية')}</p><h2>{say('Explore on Behance.','استكشف أعمالي على بيهانس.')}</h2></div><p>{say('Brand identities, campaign design and visual storytelling. Visit my portfolio on Behance.','هويات بصرية وتصاميم حملات وسرد بصري. استعرض معرض أعمالي على بيهانس.')}</p></div>
    <a className="pv-behance-link" href={profile.site.behance} target="_blank" rel="noreferrer"><span className="pv-behance-icon"><FaBehance aria-hidden="true"/></span><span><strong>Behance</strong><span>{say('Open my creative portfolio','افتح معرض أعمالي الإبداعية')}</span></span><span className="pv-behance-arrow" aria-hidden="true">↗</span></a>
   </section>
   <section id="about" className="pv-section pv-practice">
    <div className="pv-section-head"><div><p className="pv-kicker">{say('My practice','مجالات عملي')}</p><h2>{say('One connected practice.','مجالات مترابطة.')}</h2></div><p>{say('I work from concept and planning through visual direction, production and delivery.','أعمل من الفكرة والتخطيط إلى التوجيه البصري والإنتاج والتسليم.')}</p></div>
    <p className="pv-about">{t(profile.site.about)}</p>
    <div className="pv-capabilities">{capabilities.map(c=><article key={c.title.en}><h3>{t(c.title)}</h3><p>{t(c.description)}</p><small dir="ltr">{c.tools}</small></article>)}</div>
    <div className="pv-process"><strong>{say('How I work','كيف أعمل')}</strong><p>{say('Research → Plan → Create → Review → Publish','بحث ← تخطيط ← إنتاج ← مراجعة ← نشر')}</p><span>{say('An integrated workflow, with creative decisions and final review at each stage.','نظام عمل متكامل، مع قرارات إبداعية ومراجعة نهائية بكل مرحلة.')}</span></div>
   </section>
   <section id="skills" className="pv-section">
    <div className="pv-section-head"><div><p className="pv-kicker">{say('Technical skills','المهارات التقنية')}</p><h2>{say('Creative work. Technical depth.','إبداع وخلفية تقنية.')}</h2></div><p>{say('My engineering foundation and the technologies I apply across creative work and personal software projects.','خلفيتي الهندسية والتقنيات التي أستخدمها في عملي الإبداعي ومشاريعي البرمجية الشخصية.')}</p></div>
    <div className="pv-capabilities">{technicalSkills.map(skill=><article key={skill.title.en}><h3>{t(skill.title)}</h3><p>{t(skill.description)}</p><small dir="ltr">{skill.tools}</small></article>)}</div>
   </section>
   <section id="experience" className="pv-section">
    <div className="pv-section-head"><div><p className="pv-kicker">{say('Experience','الخبرة')}</p><h2>{say('The work behind the work.','خبرة وراء كل عمل.')}</h2></div><p>{say('Design, agency production and remote collaboration since 2023. Expand each role for the full scope.','تصميم وإنتاج ضمن وكالة وتعاون عن بعد منذ 2023. افتح كل خبرة لعرض تفاصيلها.')}</p></div>
    <div className="pv-career">{profile.jobs.map((job,i)=><details key={job.company} open={i===0}><summary><span className="pv-career-date">{t(job.dates)}</span><span className="pv-career-title"><strong>{job.company}</strong><span>{t(job.role)}</span></span><span className="pv-plus" aria-hidden="true">+</span></summary><div className="pv-career-body"><p>{t(job.location)}</p><ul>{job.bullets.map(b=><li key={b.en}>{t(b)}</li>)}</ul></div></details>)}</div>
    <a className="pv-link" href={profile.site.masterCvUrl} download>{say('Download the complete career CV','تحميل السيرة التفصيلية بكل الخبرات')} ↓</a>
   </section>
   <section id="projects" className="pv-section pv-digital"><div className="pv-section-head"><div><p className="pv-kicker">{say('Digital projects','المشاريع الرقمية')}</p><h2>{say('Beyond the canvas.','أبعد من التصميم.')}</h2></div><p>{say('Personal software projects and university team work.','مشاريع برمجية شخصية وأعمال جامعية نفّذتها ضمن فريق.')}</p></div>
    <div className="pv-projects">{profile.projects.map(p=><article key={p.name}><ProjectMark name={p.name} logo={p.logo}/><div className="pv-project-content"><p className="pv-project-status">{t(p.status)}</p><h3>{p.name==='APEX Cognition Platform'?say(p.name,'منصة APEX'):p.name}</h3><p>{t(p.desc)}</p>{p.url&&<a className="pv-link" href={p.url} target="_blank" rel="noreferrer">{p.name==='XO 3D Arena'?say('Play XO','جرّب اللعبة'):say('View repository','شاهد المستودع')} ↗</a>}{p.repositoryUrl&&<a className="pv-link pv-repository-link" href={p.repositoryUrl} target="_blank" rel="noreferrer">{say('View repository','شاهد المستودع')} ↗</a>}{p.name==='APEX Cognition Platform'&&<small className="pv-logo-note">{say('Project in development','المشروع قيد التطوير')}</small>}</div></article>)}</div>
   </section>
   <section id="learning" className="pv-section"><div className="pv-section-head"><div><p className="pv-kicker">{say('Education & continuous learning','التعليم والتعلّم المستمر')}</p><h2>{say('Always developing.','تطوير مستمر.')}</h2></div><p>{t(profile.site.education)}</p></div>
    <details className="pv-training"><summary>{say('Explore my training & certificates','استعرض تدريبي وشهاداتي')} <span aria-hidden="true">+</span></summary><div>{profile.certificates.map(c=><a key={c.url} href={c.url} target="_blank" rel="noreferrer"><span>{c.title}</span><small>{t(c.kind)} ↗</small></a>)}</div></details>
   </section>
   <section id="contact" className="pv-contact"><p className="pv-kicker">{say('Let’s connect','لنتواصل')}</p><h2>{say('Start with an idea.','البداية، فكرة.')}</h2><a className="pv-button" href={"mailto:"+profile.contact.email}>{say('Get in touch','تواصل معي')} ↗</a><div className="pv-social-links"><a href={"https://wa.me/"+profile.contact.phone.replace(/\D/g,'')} target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp aria-hidden="true"/> WhatsApp</a><a href={profile.site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram aria-hidden="true"/> Instagram</a><a href={profile.site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn aria-hidden="true"/> LinkedIn</a><a href={profile.site.behance} target="_blank" rel="noreferrer" aria-label="Behance"><FaBehance aria-hidden="true"/> Behance</a><a href={profile.site.github} target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub aria-hidden="true"/> GitHub</a></div></section>
  </main>
  <footer className="pv-footer"><span>© 2026 Huzaifa Alahmad</span><span>{say('Design · Marketing · AI · Digital','تصميم · تسويق · AI · تطوير')}</span><a href="/cms">{say('Manage website','إدارة الموقع')}</a></footer>

 </div>;
}

