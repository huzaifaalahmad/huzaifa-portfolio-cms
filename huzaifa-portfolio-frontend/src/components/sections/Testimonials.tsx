import { Quote, Star, User } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import { useLanguage } from '@/context/LanguageContext';
import SectionHeader from '@/components/ui/SectionHeader';

export default function Testimonials() {
  const { t, language } = useLanguage();

  return (
    <section id="testimonials" className="section trust-section">
      <SectionHeader
        eyebrow="07 / Trust"
        title={{
          en: 'How professionals describe working with me',
          ar: 'كيف يصف المحترفون العمل معي',
        }}
        description={{
          en: 'Clear thinking, structured execution, and delivery that reflects real engineering capability.',
          ar: 'تفكير واضح وتنفيذ منظم وتسليم يعكس قدرة هندسية حقيقية.',
        }}
      />

      <div className="trust-grid">
        {testimonials.map((item) => (
          <article className="trust-card" key={item.id}>
            <div className="trust-top">
              <div className="trust-avatar">
                <User size={18} />
              </div>

              <div>
                <strong>{t(item.clientName)}</strong>
                <span>
                  {t(item.clientRole)} — {t(item.clientCompany)}
                </span>
              </div>
            </div>

            <div className="trust-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} />
              ))}
            </div>

            <div className="trust-quote">
              <Quote size={20} />
              <p>{t(item.text)}</p>
            </div>

            <div className="trust-footer">
              {language === 'ar' ? 'تجربة عمل حقيقية' : 'Verified experience'}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}