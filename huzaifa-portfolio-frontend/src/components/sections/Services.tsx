import { services } from '@/data/services';
import { useLanguage } from '@/context/LanguageContext';
import SectionHeader from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';

export default function Services() {
  const { t, language } = useLanguage();

  return (
    <section id="services" className="section services-section">
      <SectionHeader
        eyebrow="02 / Services"
        title={{
          en: 'What I can build for your team',
          ar: 'ما يمكنني بناؤه لفريقك',
        }}
        description={{
          en: 'Focused capabilities combining engineering, AI workflows, and visual execution.',
          ar: 'قدرات مركزة تجمع بين الهندسة والذكاء الاصطناعي والتنفيذ البصري.',
        }}
      />

      <div className="services-grid">
        {services.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.08}>
            <article className="service-card">
              <div className="service-icon">{item.icon}</div>

              <h3>{t(item.title)}</h3>

              <p>{t(item.description)}</p>

              <ul>
                {item.features.map((f, i) => (
                  <li key={i}>{t(f)}</li>
                ))}
              </ul>

              <div className="service-footer">
                {language === 'ar' ? 'قابل للتطبيق مباشرة' : 'Production ready'}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}