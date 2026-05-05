import { motion } from 'framer-motion';
import { ArrowDownToLine, BriefcaseBusiness, Cpu, Layers3, Sparkles } from 'lucide-react';
import { profile } from '@/data/profile';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
  const { language, t } = useLanguage();

  return (
    <section className="hero cinematic-hero">
      <div className="hero-visual-system">
        <div className="hero-grid-lines" />
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-orb hero-orb-c" />
        <div className="code-rain">
          <span>prompt.engineer()</span>
          <span>design.system()</span>
          <span>api.secure()</span>
          <span>ship.product()</span>
        </div>
      </div>

      <div className="hero-grid">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div className="hero-kicker hero-kicker-glow">
            <Sparkles size={16} />
            <span>
              {language === 'ar'
                ? 'هندسة معلومات • ذكاء اصطناعي • تصميم بصري'
                : 'Information Engineering • AI Prompting • Visual Systems'}
            </span>
          </div>

          <h1>{language === 'ar' ? 'المهندس حذيفة الأحمد' : profile.name}</h1>

          <h2>{t(profile.title)}</h2>

          <p className="hero-lead">
            {language === 'ar'
              ? 'أبني منتجات رقمية تجمع بين العمق الهندسي، قوة الذكاء الاصطناعي، والحس البصري — لتكون واضحة، قابلة للإدارة، وجاهزة للإقناع.'
              : 'I build digital products where engineering depth, AI workflows, and visual design meet — clear, manageable, and built to impress hiring teams.'}
          </p>

          <div className="hero-proof">
            <span>
              <Cpu size={15} /> AI-aware systems
            </span>
            <span>
              <Layers3 size={15} /> Full-stack execution
            </span>
            <span>
              <BriefcaseBusiness size={15} /> Hiring-ready portfolio
            </span>
          </div>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary magnetic-btn">
              {language === 'ar' ? 'رؤية الأعمال' : 'View Work'}
            </a>

            <a href={profile.cvUrl} download className="btn btn-secondary magnetic-btn">
              <ArrowDownToLine size={18} />
              {language === 'ar' ? 'تنزيل السيرة الذاتية' : 'Download CV'}
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero-card premium-hero-card"
          initial={{ opacity: 0, rotateX: 12, rotateY: -12, y: 30 }}
          animate={{ opacity: 1, rotateX: 0, rotateY: 0, y: 0 }}
          transition={{ duration: 0.95, delay: 0.12, ease: 'easeOut' }}
        >
          <div className="hero-card-scan" />

          <div className="hero-card-top">
            <span>{language === 'ar' ? 'متاح للتوظيف' : 'Available for hiring'}</span>
            <b>2026</b>
          </div>

          <h3>
            {language === 'ar'
              ? 'أحوّل الفكرة إلى نظام، والنظام إلى تجربة رقمية قابلة للإثبات.'
              : 'I turn ideas into systems, and systems into provable digital experiences.'}
          </h3>

          <p>
            {language === 'ar'
              ? 'هذا الموقع ليس مجرد بورتفوليو؛ هو لوحة تشغيل مصغّرة تعرض قدرتي على بناء منتج كامل من الواجهة إلى قاعدة البيانات.'
              : 'This is not just a portfolio; it is a small operating system that demonstrates how I think, build, secure, and present products.'}
          </p>

          <div className="hero-metrics">
            <article>
              <strong>React</strong>
              <span>Interactive UI</span>
            </article>
            <article>
              <strong>Node</strong>
              <span>Secure API</span>
            </article>
            <article>
              <strong>Prisma</strong>
              <span>Database logic</span>
            </article>
            <article>
              <strong>AI</strong>
              <span>Prompt systems</span>
            </article>
          </div>

          <div className="code-card">{'{ prompt → architecture → product → impact }'}</div>
        </motion.div>
      </div>
    </section>
  );
}