import { CSSProperties, FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Award,
  Briefcase,
  Code2,
  Download,
  GraduationCap,
  Layers3,
  Mail,
  MapPin,
  Menu,
  Palette,
  PenTool,
  Phone,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { profile } from '@/data/profile';
import { services } from '@/data/services';
import { socialLinks } from '@/data/socialLinks';
import { stats } from '@/data/stats';
import { projects as fallbackProjects } from '@/data/projects';
import { skills as fallbackSkills } from '@/data/skills';
import { experiences as fallbackExperiences } from '@/data/experience';
import { testimonials as fallbackTestimonials } from '@/data/testimonials';
import {
  certifications as fallbackCertifications,
  education as fallbackEducation,
} from '@/data/education';
import { contactApi } from '@/services/api/contactApi';
import { educationApi } from '@/services/api/educationApi';
import { experienceApi } from '@/services/api/experienceApi';
import { metricsApi } from '@/services/api/metricsApi';
import { projectApi } from '@/services/api/projectApi';
import { skillApi } from '@/services/api/skillApi';

type Lang = 'en' | 'ar';
type LocalizedValue = string | { en?: string; ar?: string } | null | undefined;

type ProjectItem = {
  id: string;
  title: LocalizedValue;
  slug: string;
  category: string;
  description: LocalizedValue;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
};

type SkillItem = {
  id: string;
  name: LocalizedValue;
  category: string;
  proficiency: number;
  yearsOfExperience: number;
};

type ExperienceItem = {
  id: string;
  company: LocalizedValue;
  role: LocalizedValue;
  location: LocalizedValue;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description: LocalizedValue;
  technologies: string[];
};

type EducationItem = {
  id: string;
  degree: LocalizedValue;
  institution: LocalizedValue;
  field: LocalizedValue;
  startDate?: string;
  endDate?: string;
};

type CertificationItem = {
  id: string;
  name: LocalizedValue;
  issuer: LocalizedValue;
  issueDate: string;
};

type TestimonialItem = {
  id: string;
  clientName: LocalizedValue;
  clientRole: LocalizedValue;
  clientCompany: LocalizedValue;
  text: LocalizedValue;
  rating: number;
};

type Envelope<T> = {
  data?: T;
};

const ui = {
  en: {
    brand: 'Huzaifa',
    languageButton: 'عربي',
    menuOpen: 'Open navigation',
    menuClose: 'Close navigation',
    nav: [
      ['about', 'About'],
      ['services', 'Services'],
      ['skills', 'Skills'],
      ['work', 'Work'],
      ['contact', 'Contact'],
    ],
    navCta: 'Start a Project',
    status: 'Available for freelance and full-time roles',
    name: 'Huzaifa Alahmad',
    role:
      'Graphic Designer, Brand Identity Specialist, AI Prompt Engineer, and full-stack builder creating sharp digital systems from Dubai.',
    viewWork: 'View Work',
    downloadCv: 'Download CV',
    marquee: ['Brand Identity', 'Graphic Design', 'AI Workflows', 'React', 'Node.js', 'Visual Systems'],
    aboutEyebrow: '01 / About',
    aboutTitle: 'Designer Who Speaks Both Design & Code',
    aboutText: [
      'Dear Hiring Manager,',
      'I am a Dubai-based Graphic Designer and Brand Identity Specialist with 3+ years of hands-on experience delivering visual solutions across branding, social media content, and digital design. Holding a Bachelor\'s degree in Information Engineering, I bring a rare combination of technical precision and creative execution, enhanced by my professional use of AI tools and prompt engineering workflows that accelerate output without compromising quality.',
      'My toolkit includes the full Adobe Creative Suite (Photoshop, Illustrator, InDesign, Premiere Pro), HTML/CSS/JavaScript, and industry-leading AI design platforms. I have successfully developed brand identities, social media campaigns, and marketing collateral for clients across multiple industries.',
      'Beyond design, I have demonstrated leadership experience as a Supervisor managing a team of 6. I understand deadlines, client expectations, and operational pressure.',
      'I am immediately available, based in Dubai with a valid UAE residence visa, and highly motivated to contribute to a team where design drives real business results.',
    ],
    signatureRole: 'Graphic Designer · Brand Specialist · Front-End Developer',
    servicesEyebrow: '02 / Services',
    servicesTitle: 'Services & Expertise',
    skillsEyebrow: '03 / Skills',
    skillsTitle: 'Tools & Proficiency',
    experienceEyebrow: '04 / Experience',
    experienceTitle: 'Professional Experience',
    workEyebrow: '05 / Work',
    workTitle: 'Selected Work',
    adminNote: '',
    educationEyebrow: '06 / Education',
    educationTitle: 'Education & Certifications',
    testimonialsEyebrow: '07 / Testimonials',
    testimonialsTitle: 'Client Notes',
    contactEyebrow: '08 / Contact',
    contactTitle: "Let's Work Together",
    email: 'Email',
    phone: 'Phone',
    location: 'Location',
    form: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      subject: 'Subject',
      message: 'Message',
      sending: 'Sending...',
      send: 'Send Message',
      success: 'Message sent successfully.',
      error: 'Could not send message.',
    },
    present: 'Present',
    recent: 'Recent',
    footer: 'Graphic Design / Brand Identity / Full-Stack Systems',
    loader: 'Loading portfolio',
    scroll: 'Scroll',
    noProjects: 'No projects are published yet.',
  },
  ar: {
    brand: 'حذيفة',
    languageButton: 'EN',
    menuOpen: 'فتح القائمة',
    menuClose: 'إغلاق القائمة',
    nav: [
      ['about', 'نبذة'],
      ['services', 'الخدمات'],
      ['skills', 'المهارات'],
      ['work', 'الأعمال'],
      ['contact', 'تواصل'],
    ],
    navCta: 'ابدأ مشروعك',
    status: 'متاح للعمل الحر والفرص بدوام كامل',
    name: 'حذيفة الأحمد',
    role:
      'مصمم جرافيك ومتخصص هوية بصرية ومهندس تلقين ذكاء اصطناعي ومطور ويب متكامل، أبني أنظمة رقمية واضحة من دبي.',
    viewWork: 'شاهد الأعمال',
    downloadCv: 'تحميل السيرة الذاتية',
    marquee: ['هوية بصرية', 'تصميم جرافيك', 'سير عمل ذكية', 'React', 'Node.js', 'أنظمة بصرية'],
    aboutEyebrow: '01 / نبذة',
    aboutTitle: 'مصمم يجمع بين التصميم والكود',
    aboutText: [
      'إلى مدير التوظيف،',
      'أنا مصمم جرافيك ومتخصص هوية بصرية مقيم في دبي، أملك أكثر من 3 سنوات من الخبرة العملية في تقديم حلول بصرية في مجالات الهوية البصرية، محتوى السوشال ميديا، والتصميم الرقمي. أحمل درجة البكالوريوس في هندسة المعلومات، وهذا يمنحني مزيجا نادرا من الدقة التقنية والتنفيذ الإبداعي، مدعوما باستخدام احترافي لأدوات الذكاء الاصطناعي وهندسة التلقين لتسريع الإنتاج دون التأثير على الجودة.',
      'تشمل أدواتي Adobe Creative Suite بالكامل مثل Photoshop وIllustrator وInDesign وPremiere Pro، إضافة إلى HTML وCSS وJavaScript ومنصات التصميم المعتمدة على الذكاء الاصطناعي. أنجزت هويات بصرية وحملات سوشال ميديا ومواد تسويقية لعملاء من قطاعات مختلفة.',
      'إلى جانب التصميم، لدي خبرة قيادية كمشرف أدرت فريقا من 6 أشخاص، وأفهم ضغط المواعيد النهائية وتوقعات العملاء ومتطلبات التشغيل.',
      'أنا متاح للعمل مباشرة، مقيم في دبي مع إقامة إماراتية سارية، ومتحمس للمساهمة ضمن فريق يستخدم التصميم لتحقيق نتائج تجارية حقيقية.',
    ],
    signatureRole: 'مصمم جرافيك · متخصص هوية بصرية · مطور واجهات',
    servicesEyebrow: '02 / الخدمات',
    servicesTitle: 'الخدمات والخبرة',
    skillsEyebrow: '03 / المهارات',
    skillsTitle: 'الأدوات ومستوى الإتقان',
    experienceEyebrow: '04 / الخبرة',
    experienceTitle: 'الخبرة المهنية',
    workEyebrow: '05 / الأعمال',
    workTitle: 'أعمال مختارة',
    adminNote: '',
    educationEyebrow: '06 / التعليم',
    educationTitle: 'التعليم والشهادات',
    testimonialsEyebrow: '07 / آراء العملاء',
    testimonialsTitle: 'ملاحظات العملاء',
    contactEyebrow: '08 / التواصل',
    contactTitle: 'لنعمل معا',
    email: 'البريد',
    phone: 'الهاتف',
    location: 'الموقع',
    form: {
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      subject: 'الموضوع',
      message: 'الرسالة',
      sending: 'جار الإرسال...',
      send: 'إرسال الرسالة',
      success: 'تم إرسال الرسالة بنجاح.',
      error: 'تعذر إرسال الرسالة.',
    },
    present: 'حتى الآن',
    recent: 'حديث',
    footer: 'تصميم جرافيك / هوية بصرية / أنظمة ويب متكاملة',
    loader: 'جاري تحميل البورتفوليو',
    scroll: 'مرر',
    noProjects: 'لا توجد أعمال منشورة بعد.',
  },
} as const;

const serviceCopy: Record<string, Record<Lang, { title: string; description: string }>> = {
  ai: {
    en: {
      title: 'AI Prompt Engineering',
      description: 'Prompt systems for LLMs, image generation, automation, and repeatable AI workflows.',
    },
    ar: {
      title: 'هندسة تلقين الذكاء الاصطناعي',
      description: 'أنظمة تلقين للنماذج اللغوية وتوليد الصور والأتمتة وسير العمل الذكي القابل للتكرار.',
    },
  },
  web: {
    en: {
      title: 'Full-Stack Development',
      description: 'Production-ready React, TypeScript, Node.js, API, and database systems.',
    },
    ar: {
      title: 'تطوير ويب متكامل',
      description: 'أنظمة جاهزة للإنتاج باستخدام React وTypeScript وNode.js وواجهات API وقواعد بيانات.',
    },
  },
  automation: {
    en: {
      title: 'Automation & Workflow Systems',
      description: 'Automated operations that reduce manual work and improve team reliability.',
    },
    ar: {
      title: 'الأتمتة وأنظمة سير العمل',
      description: 'عمليات مؤتمتة تقلل العمل اليدوي وترفع وضوح العمل وموثوقية الفرق.',
    },
  },
  design: {
    en: {
      title: 'UI/UX & Visual Design',
      description: 'Refined interfaces that look credible, convert visitors, and communicate value.',
    },
    ar: {
      title: 'تصميم الواجهات والهوية البصرية',
      description: 'واجهات مصقولة تبني الثقة وتحول الزوار وتوصل القيمة بوضوح.',
    },
  },
};

const skillLabels: Record<string, Record<Lang, string>> = {
  frontend: { en: 'Frontend', ar: 'الواجهة الأمامية' },
  backend: { en: 'Backend', ar: 'الباكند' },
  ai: { en: 'AI & Prompting', ar: 'الذكاء الاصطناعي والتلقين' },
  database: { en: 'Databases', ar: 'قواعد البيانات' },
  design: { en: 'Design', ar: 'التصميم' },
  automation: { en: 'Automation', ar: 'الأتمتة' },
  branding: { en: 'Branding', ar: 'الهوية البصرية' },
  production: { en: 'Production', ar: 'الإنتاج والطباعة' },
  marketing: { en: 'Marketing', ar: 'التسويق' },
  analytics: { en: 'Testing & SEO', ar: 'الاختبار وSEO' },
  office: { en: 'Office', ar: 'الأدوات المكتبية' },
  motion: { en: 'Motion', ar: 'الموشن' },
};

const statLabels: Record<string, Record<Lang, string>> = {
  years: { en: 'Years Experience', ar: 'سنوات خبرة' },
  projects: { en: 'Projects Completed', ar: 'مشاريع مكتملة' },
  clients: { en: 'Happy Clients', ar: 'عملاء سعداء' },
  tech: { en: 'Technologies Used', ar: 'تقنيات مستخدمة' },
};

const categoryLabels: Record<string, Record<Lang, string>> = {
  'Full-Stack': { en: 'Full-Stack', ar: 'تطوير متكامل' },
  'AI Systems': { en: 'AI Systems', ar: 'أنظمة ذكاء اصطناعي' },
  Branding: { en: 'Branding', ar: 'هوية بصرية' },
  'Social Media': { en: 'Social Media', ar: 'سوشال ميديا' },
  'Web Design': { en: 'Web Design', ar: 'تصميم ويب' },
  'Packaging & Print': { en: 'Packaging & Print', ar: 'تغليف وطباعة' },
  'Motion & Video': { en: 'Motion & Video', ar: 'موشن وفيديو' },
  'AI Design': { en: 'AI Design', ar: 'تصميم بالذكاء الاصطناعي' },
  Automation: { en: 'Automation', ar: 'أتمتة' },
  Work: { en: 'Work', ar: 'عمل' },
};

const profileLocation: Record<Lang, string> = {
  en: 'Dubai, UAE',
  ar: 'دبي، الإمارات',
};

const testimonialCopy: Record<
  string,
  Record<Lang, { clientName: string; clientRole: string; clientCompany: string; text: string }>
> = {
  '1': {
    en: {
      clientName: 'Startup Founder',
      clientRole: 'Founder',
      clientCompany: 'Private Client',
      text:
        'Huzaifa understands both technical structure and visual presentation, which makes collaboration faster and clearer.',
    },
    ar: {
      clientName: 'مؤسس شركة ناشئة',
      clientRole: 'مؤسس',
      clientCompany: 'عميل خاص',
      text: 'حذيفة يفهم البنية التقنية والعرض البصري معا، وهذا يجعل التعاون أسرع وأكثر وضوحا.',
    },
  },
  '2': {
    en: {
      clientName: 'Product Lead',
      clientRole: 'Product Lead',
      clientCompany: 'Digital Team',
      text: 'He turns vague ideas into structured interfaces, workflows, and implementation steps.',
    },
    ar: {
      clientName: 'قائد منتج',
      clientRole: 'قائد منتج',
      clientCompany: 'فريق رقمي',
      text: 'يحول الأفكار غير الواضحة إلى واجهات منظمة وسير عمل وخطوات تنفيذ قابلة للتطبيق.',
    },
  },
};

function text(value: LocalizedValue, fallback = '', lang: Lang = 'en') {
  if (typeof value === 'string') return value || fallback;
  if (value && typeof value === 'object') {
    return String(value[lang] || value.en || value.ar || fallback);
  }
  return fallback;
}

function envelopeData<T>(payload: unknown, fallback: T): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return ((payload as Envelope<T>).data || fallback) as T;
  }
  return fallback;
}

function arrayData<T>(payload: unknown, fallback: T[]): T[] {
  const data = envelopeData<unknown>(payload, fallback);
  return Array.isArray(data) ? (data as T[]) : fallback;
}

function normalizeProject(item: any): ProjectItem {
  return {
    id: String(item.id),
    title: item.title || '',
    slug: String(item.slug || item.id),
    category: String(item.category || 'Work'),
    description: item.description || item.shortDescription || item.fullDescription || '',
    technologies: Array.isArray(item.technologies) ? item.technologies.map(String) : [],
    imageUrl: item.imageUrl ? String(item.imageUrl) : undefined,
    liveUrl: item.liveUrl ? String(item.liveUrl) : undefined,
  };
}

function normalizeSkill(item: any): SkillItem {
  return {
    id: String(item.id),
    name: item.name || '',
    category: String(item.category || 'design'),
    proficiency: Number(item.proficiency || 70),
    yearsOfExperience: Number(item.yearsOfExperience || 1),
  };
}

function normalizeExperience(item: any): ExperienceItem {
  return {
    id: String(item.id),
    company: item.company || '',
    role: item.role || '',
    location: item.location || '',
    startDate: String(item.startDate || ''),
    endDate: item.endDate ? String(item.endDate) : undefined,
    isCurrent: Boolean(item.isCurrent),
    description: item.description || '',
    technologies: Array.isArray(item.technologies) ? item.technologies.map(String) : [],
  };
}

function normalizeEducation(item: any): EducationItem {
  return {
    id: String(item.id),
    degree: item.degree || '',
    institution: item.institution || '',
    field: item.field || '',
    startDate: item.startDate ? String(item.startDate) : undefined,
    endDate: item.endDate ? String(item.endDate) : undefined,
  };
}

function normalizeCertification(item: any): CertificationItem {
  return {
    id: String(item.id),
    name: item.name || '',
    issuer: item.issuer || '',
    issueDate: String(item.issueDate || ''),
  };
}

function normalizeTestimonial(item: any): TestimonialItem {
  return {
    id: String(item.id),
    clientName: item.clientName || '',
    clientRole: item.clientRole || '',
    clientCompany: item.clientCompany || '',
    text: item.text || '',
    rating: Number(item.rating || 5),
  };
}

function ServiceIcon({ icon }: { icon: string }) {
  if (icon === 'code') return <Code2 size={24} />;
  if (icon === 'pen') return <PenTool size={24} />;
  if (icon === 'spark' || icon === 'brain') return <Sparkles size={24} />;
  return <Layers3 size={24} />;
}

function getStoredLanguage(): Lang {
  try {
    return localStorage.getItem('huzaifa-language') === 'ar' ? 'ar' : 'en';
  } catch {
    return 'en';
  }
}

export default function ReferencePortfolio() {
  const [language, setLanguage] = useState<Lang>(getStoredLanguage);
  const [navOpen, setNavOpen] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [loaderOut, setLoaderOut] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>(fallbackProjects.map(normalizeProject));
  const [skills, setSkills] = useState<SkillItem[]>(fallbackSkills.map(normalizeSkill));
  const [experiences, setExperiences] = useState<ExperienceItem[]>(
    fallbackExperiences.map(normalizeExperience)
  );
  const [education, setEducation] = useState<EducationItem[]>(
    fallbackEducation.map(normalizeEducation)
  );
  const [certifications, setCertifications] = useState<CertificationItem[]>(
    fallbackCertifications.map(normalizeCertification)
  );
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  const c = ui[language];
  const visibleStats = stats.filter((item) => item.isVisible).sort((a, b) => a.order - b.order);
  const visibleTestimonials = useMemo(
    () =>
      fallbackTestimonials
        .filter((item) => item.isVisible)
        .sort((a, b) => a.order - b.order)
        .map(normalizeTestimonial),
    []
  );

  useEffect(() => {
    try {
      localStorage.setItem('huzaifa-language', language);
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    } catch {
      // Ignore storage failures in private browsing.
    }
  }, [language]);

  useEffect(() => {
    const outTimer = window.setTimeout(() => setLoaderOut(true), 900);
    const hideTimer = window.setTimeout(() => setLoaderVisible(false), 1450);
    return () => {
      window.clearTimeout(outTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    async function loadCmsContent() {
      const [projectRes, skillRes, experienceRes, educationRes] = await Promise.allSettled([
        projectApi.list(),
        skillApi.getAll(),
        experienceApi.getAll(),
        educationApi.getAll(),
      ]);

      if (projectRes.status === 'fulfilled') {
        const rows = arrayData<any>(projectRes.value, []);
        if (rows.length) setProjects(rows.map(normalizeProject));
      }

      if (skillRes.status === 'fulfilled') {
        const rows = arrayData<any>(skillRes.value, []);
        if (rows.length) setSkills(rows.map(normalizeSkill));
      }

      if (experienceRes.status === 'fulfilled') {
        const rows = arrayData<any>(experienceRes.value, []);
        if (rows.length) setExperiences(rows.map(normalizeExperience));
      }

      if (educationRes.status === 'fulfilled') {
        const data = envelopeData<{ education?: any[]; certifications?: any[] }>(educationRes.value, {});
        if (data.education?.length) setEducation(data.education.map(normalizeEducation));
        if (data.certifications?.length) {
          setCertifications(data.certifications.map(normalizeCertification));
        }
      }
    }

    void loadCmsContent();
  }, []);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem('huzaifa-visit-recorded')) {
        sessionStorage.setItem('huzaifa-visit-recorded', 'true');
        void metricsApi.recordVisit().catch(() => undefined);
      }
    } catch {
      void metricsApi.recordVisit().catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.max(38, Math.min(90, Math.floor(width / 18)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r: Math.random() * 1.8 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(243, 156, 18, 0.52)';
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 125) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(42, 80, 184, ${0.16 * (1 - distance / 125)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let frame = 0;

    const move = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = window.requestAnimationFrame(tick);
    };

    const hover = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest('a, button, input, textarea, .svc-card, .wc, .ct-card')) {
        ring.classList.add('hover');
      } else {
        ring.classList.remove('hover');
      }
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', hover);
    tick();
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', hover);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.rv'));
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('on'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('on');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [projects, skills, experiences, education, certifications, language]);

  const skillGroups = useMemo(() => {
    return Object.entries(
      skills.reduce<Record<string, SkillItem[]>>((acc, skill) => {
        acc[skill.category] = acc[skill.category] || [];
        acc[skill.category].push(skill);
        return acc;
      }, {})
    );
  }, [skills]);

  function toggleLanguage() {
    setLanguage((current) => (current === 'en' ? 'ar' : 'en'));
    setNavOpen(false);
  }

  function closeNav() {
    setNavOpen(false);
  }

  function recordCvDownload() {
    void metricsApi.recordCvDownload().catch(() => undefined);
  }

  async function submitContact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setContactStatus('sending');

    try {
      await contactApi.send({
        name: String(data.get('name')),
        email: String(data.get('email')),
        phone: String(data.get('phone') || ''),
        subject: String(data.get('subject')),
        message: String(data.get('message')),
        preferredLanguage: language,
      });
      setContactStatus('success');
      form.reset();
    } catch {
      setContactStatus('error');
    }
  }

  return (
    <div className={`ref-site ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'} lang={language}>
      {loaderVisible ? (
        <div id="ldr" className={`ldr ${loaderOut ? 'out' : ''}`} aria-hidden="true">
          <div className="ldr-mark">
            <img src="/assets/images/logo.png" alt="" />
            <span>{c.loader}</span>
          </div>
        </div>
      ) : null}

      <canvas id="pc" ref={canvasRef} className="particle-canvas" aria-hidden="true" />
      <div id="cd" ref={cursorDotRef} className="cursor-dot" aria-hidden="true" />
      <div id="cr" ref={cursorRingRef} className="cursor-ring" aria-hidden="true" />

      <nav className="ref-nav" aria-label="Main navigation">
        <a className="nb" href="#hero" aria-label="Huzaifa Alahmad home" onClick={closeNav}>
          <img src="/assets/images/logo.png" alt="" />
          <span>{c.brand}</span>
        </a>

        <button
          className="hbg"
          type="button"
          aria-label={navOpen ? c.menuClose : c.menuOpen}
          aria-expanded={navOpen}
          onClick={() => setNavOpen((open) => !open)}
        >
          {navOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`nl ${navOpen ? 'open' : ''}`}>
          {c.nav.map(([target, label]) => (
            <a href={`#${target}`} key={target} onClick={closeNav}>
              {label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <button className="lang-toggle" type="button" onClick={toggleLanguage}>
            {c.languageButton}
          </button>
          <a className="n-cta" href="#contact" onClick={closeNav}>
            {c.navCta}
          </a>
        </div>
      </nav>

      <section id="hero" className="hero-ref">
        <div className="hero-grid" />
        <div className="hero-in rv on">
          <span className="av-tag">
            <span className="av-dot" />
            {c.status}
          </span>

          <div className="hero-logo-wrap" aria-hidden="true">
            <div className="hero-logo-ring" />
            <div className="hero-logo-ring2" />
            <img className="hero-logo-img" src="/assets/images/logo.png" alt="" />
          </div>

          <h1 className="hero-name">{c.name}</h1>
          <p className="hero-role">{c.role}</p>

          <div className="hero-ctas">
            <a className="btn-g" href="#work">
              {c.viewWork}
            </a>
            <a className="btn-o" href={profile.cvUrl} download onClick={recordCvDownload}>
              <Download size={17} />
              {c.downloadCv}
            </a>
          </div>

          <div className="hero-stats">
            {visibleStats.slice(0, 3).map((item) => (
              <div className="hstat" key={item.id}>
                <span className="hstat-n">
                  {item.value}
                  {item.suffix}
                </span>
                <span className="hstat-l">
                  {statLabels[item.id]?.[language] || text(item.label, '', language)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="sc-ind" aria-hidden="true">
          <span className="sc-line" />
          <span className="sc-txt">{c.scroll}</span>
        </div>
      </section>

      <div className="mq-wrap" aria-hidden="true">
        <div className="mq-track">
          {c.marquee.concat(c.marquee).map((label, index) => (
            <span className="mq-item" key={`${label}-${index}`}>
              {label}
              <i className="mq-dot" />
            </span>
          ))}
        </div>
      </div>

      <section id="about" className="ref-section about-grid rv">
        <div className="about-img-col">
          <div className="about-svg">
            <span className="about-orbit" aria-hidden="true" />
            <img src="/assets/images/logo.png" alt="Huzaifa logo" />
          </div>
          <div className="about-stats-row">
            {visibleStats.slice(0, 2).map((item) => (
              <div className="astat rv" key={item.id}>
                <span className="astat-n">
                  {item.value}
                  {item.suffix}
                </span>
                <span className="astat-l">
                  {statLabels[item.id]?.[language] || text(item.label, '', language)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="letter-body">
          <span className="sl-tag">{c.aboutEyebrow}</span>
          <h2 className="letter-head">{c.aboutTitle}</h2>
          {c.aboutText.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="letter-sign">
            <span className="ls-name">{c.name}</span>
            <span className="ls-role">{c.signatureRole}</span>
          </div>
        </div>
      </section>

      <section id="services" className="ref-section rv">
        <SectionTitle eyebrow={c.servicesEyebrow} title={c.servicesTitle} />
        <div className="svc-grid">
          {services
            .filter((service) => service.isVisible)
            .sort((a, b) => a.order - b.order)
            .map((service, index) => {
              const serviceText = serviceCopy[service.id]?.[language] || {
                title: text(service.title, '', language),
                description: text(service.description, '', language),
              };

              return (
                <article className="svc-card rv" key={service.id}>
                  <span className="svc-n">{String(index + 1).padStart(2, '0')}</span>
                  <span className="svc-ico">
                    <ServiceIcon icon={service.icon} />
                  </span>
                  <h3 className="svc-name">{serviceText.title}</h3>
                  <p className="svc-desc">{serviceText.description}</p>
                  <span className="svc-arr">
                    <ArrowUpRight size={18} />
                  </span>
                </article>
              );
            })}
        </div>
      </section>

      <section id="skills" className="ref-section rv">
        <SectionTitle eyebrow={c.skillsEyebrow} title={c.skillsTitle} />
        <div className="sk-grid">
          <div className="sk-bars">
            {skills.map((skill) => (
              <div className="sk-item rv" key={skill.id}>
                <div className="sk-meta">
                  <span className="sk-nm">{text(skill.name, '', language)}</span>
                  <span className="sk-pc">{skill.proficiency}%</span>
                </div>
                <div className="sk-track">
                  <span
                    className="sk-fill"
                    style={{ '--skill-width': `${skill.proficiency}%` } as CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="chips">
            {skillGroups.map(([category, items]) => (
              <span className="chip rv" key={category}>
                {skillLabels[category]?.[language] || category}
                <b>{items.length}</b>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="ref-section rv">
        <SectionTitle eyebrow={c.experienceEyebrow} title={c.experienceTitle} />
        <div className="tl">
          {experiences.map((item) => (
            <article className="tl-it rv" key={item.id}>
              <span className="tn">
                <Briefcase size={18} />
              </span>
              <div className="tl-hd">
                <h3 className="tl-title">{text(item.role, '', language)}</h3>
                <span className="tl-date">
                  {item.startDate} - {item.isCurrent ? c.present : item.endDate || c.recent}
                </span>
              </div>
              <p className="tl-co">
                {text(item.company, '', language)} / {text(item.location, '', language)}
              </p>
              <p className="tl-desc">{text(item.description, '', language)}</p>
              <div className="tl-tags">
                {item.technologies.map((tech) => (
                  <span className="tl-tag" key={tech}>
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="work" className="ref-section rv">
        <div className="work-hdr">
          <SectionTitle eyebrow={c.workEyebrow} title={c.workTitle} />
          {c.adminNote ? <span className="upload-note">{c.adminNote}</span> : null}
        </div>
        {projects.length ? (
          <div className="work-grid">
            {projects.slice(0, 6).map((project, index) => (
              <article className={`wc rv ${index === 0 ? 'big' : ''}`} key={project.id}>
                {project.imageUrl ? <img src={project.imageUrl} alt="" /> : null}
                <div className="wc-in">
                  <span className="wc-ico">
                    <Palette size={20} />
                  </span>
                  <span className="wc-lbl">
                    {categoryLabels[project.category]?.[language] || project.category}
                  </span>
                  <h3>{text(project.title, '', language)}</h3>
                  <p className="wc-sub">{text(project.description, '', language)}</p>
                  <div className="tl-tags">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span className="tl-tag" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-note">{c.noProjects}</p>
        )}
      </section>

      <section id="education" className="ref-section rv">
        <SectionTitle eyebrow={c.educationEyebrow} title={c.educationTitle} />
        <div className="edu-grid">
          {education.map((item) => (
            <article className="edu-c rv" key={item.id}>
              <span className="edu-ico">
                <GraduationCap size={22} />
              </span>
              <h3 className="edu-deg">{text(item.degree, '', language)}</h3>
              <p className="edu-inst">{text(item.institution, '', language)}</p>
              <span className="edu-yr">
                {text(item.field, '', language)}
                {item.startDate ? ` / ${item.startDate}${item.endDate ? ` - ${item.endDate}` : ''}` : ''}
              </span>
            </article>
          ))}
        </div>
        <div className="cert-grid">
          {certifications.map((item) => (
            <article className="cert-it rv" key={item.id}>
              <span className="cert-ico">
                <Award size={18} />
              </span>
              <div>
                <strong>{text(item.name, '', language)}</strong>
                <span>
                  {text(item.issuer, '', language)} / {item.issueDate}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="testimonials" className="ref-section rv">
        <SectionTitle eyebrow={c.testimonialsEyebrow} title={c.testimonialsTitle} />
        <div className="test-grid">
          {visibleTestimonials.map((item) => {
            const clean = testimonialCopy[item.id]?.[language];

            return (
              <article className="test-card rv" key={item.id}>
                <div className="stars" aria-label={`${item.rating} stars`}>
                  {Array.from({ length: item.rating }).map((_, index) => (
                    <span key={index}>★</span>
                  ))}
                </div>
                <p>{clean?.text || text(item.text, '', language)}</p>
                <div className="test-person">
                  <strong>{clean?.clientName || text(item.clientName, '', language)}</strong>
                  <span>
                    {clean?.clientRole || text(item.clientRole, '', language)} /{' '}
                    {clean?.clientCompany || text(item.clientCompany, '', language)}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="contact" className="ref-section ct-grid rv">
        <div className="ct-cards">
          <SectionTitle eyebrow={c.contactEyebrow} title={c.contactTitle} />
          <ContactCard icon={<Mail size={19} />} label={c.email} value={profile.email} href={`mailto:${profile.email}`} />
          <ContactCard icon={<Phone size={19} />} label={c.phone} value={profile.phone} href={`tel:${profile.phone}`} />
          <ContactCard icon={<MapPin size={19} />} label={c.location} value={profileLocation[language]} />
          <div className="social-row">
            {socialLinks
              .filter((link) => link.isVisible)
              .sort((a, b) => a.order - b.order)
              .map((link) => (
                <a href={link.url} key={link.id} target="_blank" rel="noreferrer">
                  {link.platform}
                </a>
              ))}
          </div>
        </div>

        <form className="rp-wrap contact-ref-form rv" onSubmit={submitContact}>
          <span className="rp-ring" aria-hidden="true" />
          <img className="rp-logo" src="/assets/images/logo.png" alt="" />
          <input name="name" placeholder={c.form.name} required />
          <input name="email" type="email" placeholder={c.form.email} required />
          <input name="phone" placeholder={c.form.phone} />
          <input name="subject" placeholder={c.form.subject} required />
          <textarea name="message" rows={4} placeholder={c.form.message} required />
          <button className="btn-g" disabled={contactStatus === 'sending'}>
            <Send size={17} />
            {contactStatus === 'sending' ? c.form.sending : c.form.send}
          </button>
          {contactStatus === 'success' ? <p className="success">{c.form.success}</p> : null}
          {contactStatus === 'error' ? <p className="error">{c.form.error}</p> : null}
        </form>
      </section>

      <footer className="ref-footer">
        <span className="f-logo">{c.name}</span>
        <span>{c.footer}</span>
      </footer>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="st">
      <span className="ssub">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="ct-ico">{icon}</span>
      <span className="ct-lbl">{label}</span>
      <strong className="ct-val">{value}</strong>
    </>
  );

  if (href) {
    return (
      <a className="ct-card rv" href={href}>
        {content}
      </a>
    );
  }

  return <div className="ct-card rv">{content}</div>;
}
