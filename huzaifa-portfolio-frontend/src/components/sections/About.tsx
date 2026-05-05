import {
  BrainCircuit,
  Code2,
  GaugeCircle,
  MapPin,
  Palette,
  ShieldCheck,
} from 'lucide-react';
import { profile } from '@/data/profile';
import { stats } from '@/data/stats';
import { useLanguage } from '@/context/LanguageContext';
import SectionHeader from '@/components/ui/SectionHeader';

export default function About() {
  const { t, language } = useLanguage();

  const strengths = [
    {
      icon: <BrainCircuit size={20} />,
      title: language === 'ar' ? 'تفكير مدعوم بالذكاء الاصطناعي' : 'AI-aware thinking',
      text:
        language === 'ar'
          ? 'أحوّل الأفكار إلى تدفقات عمل واضحة ومخرجات قابلة للاستخدام.'
          : 'I turn ideas into structured workflows and usable outputs.',
    },
    {
      icon: <Code2 size={20} />,
      title: language === 'ar' ? 'تنفيذ برمجي عملي' : 'Practical engineering',
      text:
        language === 'ar'
          ? 'أبني واجهات وخدمات خلفية قابلة للتطوير والإدارة.'
          : 'I build interfaces and backend services that can be managed and extended.',
    },
    {
      icon: <Palette size={20} />,
      title: language === 'ar' ? 'حس بصري واضح' : 'Visual design sense',
      text:
        language === 'ar'
          ? 'أهتم بالهوية، القراءة، والترتيب البصري وليس فقط كتابة الكود.'
          : 'I care about identity, readability, and visual structure — not only code.',
    },
  ];

  return (
    <section id="about" className="section about-section">
      <SectionHeader
        eyebrow="01 / About"
        title={{
          en: 'A practical builder between AI, software, and design',
          ar: 'بناء عملي بين الذكاء الاصطناعي والبرمجيات والتصميم',
        }}
        description={profile.bio}
      />

      <div className="about-layout">
        <article className="about-main-card">
          <div className="about-orbit">
            <span />
            <span />
            <span />
          </div>

          <div className="about-badge">
            <ShieldCheck size={18} />
            {language === 'ar' ? 'جاهز لبيئات العمل الحقيقية' : 'Ready for real work environments'}
          </div>

          <h3>
            {language === 'ar'
              ? 'أبني أنظمة توضح طريقة تفكيري، لا مجرد واجهات جميلة.'
              : 'I build systems that show how I think, not just pretty interfaces.'}
          </h3>

          <p>
            {t(profile.bio)}
          </p>

          <div className="about-meta">
            <span>
              <MapPin size={17} />
              {t(profile.location)}
            </span>
            <span>
              <GaugeCircle size={17} />
              {language === 'ar' ? 'تركيز على المنتج والنتيجة' : 'Product and outcome focused'}
            </span>
          </div>
        </article>

        <div className="about-strengths">
          {strengths.map((item) => (
            <article className="about-strength" key={item.title}>
              <div className="about-strength-icon">{item.icon}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="stats-grid about-stats">
        {stats.map((item) => (
          <article className="stat-card" key={item.id}>
            <strong>
              {item.value}
              {item.suffix}
            </strong>
            <span>{t(item.label)}</span>
          </article>
        ))}
      </div>
    </section>
  );
}