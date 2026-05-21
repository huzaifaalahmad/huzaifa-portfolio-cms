import fs from 'fs/promises';
import path from 'path';
import { prisma } from '@/config/database';
import { BadRequestError } from '@/utils/errorClasses';

const SETTINGS_KEY = 'site-content';

const defaultContent = {
  copy: {
    en: {
      brand: 'Huzaifa',
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
        "I am a Dubai-based Graphic Designer and Brand Identity Specialist with 3+ years of hands-on experience delivering visual solutions across branding, social media content, and digital design. Holding a Bachelor's degree in Information Engineering, I bring a rare combination of technical precision and creative execution, enhanced by my professional use of AI tools and prompt engineering workflows that accelerate output without compromising quality.",
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
      educationEyebrow: '06 / Education',
      educationTitle: 'Education & Certifications',
      testimonialsEyebrow: '07 / Testimonials',
      testimonialsTitle: 'Client Notes',
      contactEyebrow: '08 / Contact',
      contactTitle: "Let's Work Together",
      footer: 'Graphic Design / Brand Identity / Front-End Development / AI Prompt Engineering',
    },
    ar: {
      brand: 'حذيفة',
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
      educationEyebrow: '06 / التعليم',
      educationTitle: 'التعليم والشهادات',
      testimonialsEyebrow: '07 / آراء العملاء',
      testimonialsTitle: 'ملاحظات العملاء',
      contactEyebrow: '08 / التواصل',
      contactTitle: 'لنعمل معا',
      footer: 'تصميم جرافيك / هوية بصرية / تطوير واجهات / هندسة تلقين الذكاء الاصطناعي',
    },
  },
  cv: {
    url: '/assets/cv.pdf',
    fileName: 'cv.pdf',
    uploadedAt: null,
  },
  stats: [
    { id: 'years', label: { en: 'Years Experience', ar: 'سنوات خبرة' }, value: 3, suffix: '+', isVisible: true, order: 1 },
    { id: 'projects', label: { en: 'Projects Completed', ar: 'مشاريع مكتملة' }, value: 50, suffix: '+', isVisible: true, order: 2 },
    { id: 'clients', label: { en: 'Happy Clients', ar: 'عملاء سعداء' }, value: 30, suffix: '+', isVisible: true, order: 3 },
    { id: 'tech', label: { en: 'Technologies Used', ar: 'تقنيات مستخدمة' }, value: 25, suffix: '+', isVisible: true, order: 4 },
  ],
  services: [
    {
      id: 'ai',
      title: { en: 'AI Prompt Engineering', ar: 'هندسة تلقين الذكاء الاصطناعي' },
      description: {
        en: 'Prompt systems for LLMs, image generation, automation, and repeatable AI workflows.',
        ar: 'أنظمة تلقين للنماذج اللغوية وتوليد الصور والأتمتة وسير العمل الذكي القابل للتكرار.',
      },
      icon: 'brain',
      isVisible: true,
      order: 1,
    },
    {
      id: 'web',
      title: { en: 'Full-Stack Development', ar: 'تطوير ويب متكامل' },
      description: {
        en: 'Production-ready React, TypeScript, Node.js, API, and database systems.',
        ar: 'أنظمة جاهزة للإنتاج باستخدام React وTypeScript وNode.js وواجهات API وقواعد بيانات.',
      },
      icon: 'code',
      isVisible: true,
      order: 2,
    },
    {
      id: 'automation',
      title: { en: 'Automation & Workflow Systems', ar: 'الأتمتة وأنظمة سير العمل' },
      description: {
        en: 'Automated operations that reduce manual work and improve team reliability.',
        ar: 'عمليات مؤتمتة تقلل العمل اليدوي وترفع وضوح العمل وموثوقية الفرق.',
      },
      icon: 'spark',
      isVisible: true,
      order: 3,
    },
    {
      id: 'design',
      title: { en: 'UI/UX & Visual Design', ar: 'تصميم الواجهات والهوية البصرية' },
      description: {
        en: 'Refined interfaces that look credible, convert visitors, and communicate value.',
        ar: 'واجهات مصقولة تبني الثقة وتحول الزوار وتوصل القيمة بوضوح.',
      },
      icon: 'pen',
      isVisible: true,
      order: 4,
    },
  ],
  testimonials: [
    {
      id: '1',
      clientName: { en: 'Startup Founder', ar: 'مؤسس شركة ناشئة' },
      clientRole: { en: 'Founder', ar: 'مؤسس' },
      clientCompany: { en: 'Private Client', ar: 'عميل خاص' },
      text: {
        en: 'Huzaifa understands both technical structure and visual presentation, which makes collaboration faster and clearer.',
        ar: 'حذيفة يفهم البنية التقنية والعرض البصري معا، وهذا يجعل التعاون أسرع وأكثر وضوحا.',
      },
      rating: 5,
      isVisible: true,
      order: 1,
    },
    {
      id: '2',
      clientName: { en: 'Product Lead', ar: 'قائد منتج' },
      clientRole: { en: 'Product Lead', ar: 'قائد منتج' },
      clientCompany: { en: 'Digital Team', ar: 'فريق رقمي' },
      text: {
        en: 'He turns vague ideas into structured interfaces, workflows, and implementation steps.',
        ar: 'يحول الأفكار غير الواضحة إلى واجهات منظمة وسير عمل وخطوات تنفيذ قابلة للتطبيق.',
      },
      rating: 5,
      isVisible: true,
      order: 2,
    },
  ],
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeDeep<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(override) ? override : base) as T;
  if (!isPlainObject(base)) return (override === undefined || override === null ? base : override) as T;

  const next: Record<string, unknown> = { ...base };
  if (!isPlainObject(override)) return next as T;

  for (const [key, value] of Object.entries(override)) {
    next[key] = key in next ? mergeDeep(next[key], value) : value;
  }

  return next as T;
}

function safeFileName(name: string) {
  const parsed = path.parse(name || 'cv.pdf');
  const base = parsed.name.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '') || 'cv';
  return `${base}-${Date.now()}.pdf`;
}

export class SiteContentService {
  async getContent() {
    const row = await prisma.siteSetting.findUnique({ where: { key: SETTINGS_KEY } });
    return mergeDeep(defaultContent, row?.value || {});
  }

  async updateContent(data: unknown) {
    const current = await this.getContent();
    const value = mergeDeep(current, data || {});

    await prisma.siteSetting.upsert({
      where: { key: SETTINGS_KEY },
      update: { value },
      create: { key: SETTINGS_KEY, value },
    });

    return value;
  }

  async uploadCv(input: { fileName?: string; mimeType?: string; data?: string }) {
    if (!input.data) throw new BadRequestError('CV file data is required');
    if (input.mimeType && input.mimeType !== 'application/pdf') {
      throw new BadRequestError('Only PDF CV files are allowed');
    }

    const raw = input.data.includes(',') ? input.data.split(',').pop() || '' : input.data;
    const bytes = Buffer.from(raw, 'base64');

    if (!bytes.length || bytes.length > 8 * 1024 * 1024) {
      throw new BadRequestError('CV file must be a non-empty PDF under 8MB');
    }

    if (bytes.subarray(0, 4).toString() !== '%PDF') {
      throw new BadRequestError('Uploaded CV must be a valid PDF file');
    }

    const uploadDir = path.resolve(process.cwd(), 'uploads', 'cv');
    await fs.mkdir(uploadDir, { recursive: true });
    const fileName = safeFileName(input.fileName || 'cv.pdf');
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, bytes);

    const current = await this.getContent();
    const value = mergeDeep(current, {
      cv: {
        url: `/uploads/cv/${fileName}`,
        fileName: input.fileName || fileName,
        uploadedAt: new Date().toISOString(),
      },
    });

    await prisma.siteSetting.upsert({
      where: { key: SETTINGS_KEY },
      update: { value },
      create: { key: SETTINGS_KEY, value },
    });

    return value;
  }
}
