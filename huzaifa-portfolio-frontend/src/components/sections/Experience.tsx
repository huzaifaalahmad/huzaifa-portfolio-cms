import { Briefcase, Calendar, MapPin, Rocket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { experienceApi } from '@/services/api/experienceApi';
import { useLanguage } from '@/context/LanguageContext';
import SectionHeader from '@/components/ui/SectionHeader';

export default function Experience() {
  const { language } = useLanguage();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperiences();
  }, []);

  async function loadExperiences() {
    try {
      const res = await experienceApi.getAll();
      setExperiences(res.data);
    } catch (error) {
      console.error('Failed to load experiences', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="experience" className="section experience-section">
      <SectionHeader
        eyebrow="04 / Experience"
        title={{
          en: 'Execution-driven experience',
          ar: 'خبرة قائمة على التنفيذ الفعلي',
        }}
        description={{
          en: 'Real work across development, automation, and AI-driven systems.',
          ar: 'تجارب عملية في التطوير والأتمتة وبناء أنظمة تعتمد على الذكاء الاصطناعي.',
        }}
      />

      {loading ? (
        <p>Loading experience...</p>
      ) : experiences.length === 0 ? (
        <p>No experience added yet.</p>
      ) : (
        <div className="experience-timeline">
          {experiences.map((item) => (
            <article className="experience-card" key={item.id}>
              <div className="experience-dot" />

              <div className="experience-head">
                <div className="experience-role">
                  <Briefcase size={18} />
                  <h3>{item.role}</h3>
                </div>

                <div className="experience-meta">
                  <span>
                    <Calendar size={14} />
                    {item.startDate} —{' '}
                    {item.isCurrent
                      ? language === 'ar'
                        ? 'حتى الآن'
                        : 'Present'
                      : item.endDate}
                  </span>

                  <span>
                    <MapPin size={14} />
                    {item.location}
                  </span>
                </div>
              </div>

              <h4 className="experience-company">{item.company}</h4>

              <p className="experience-desc">{item.description}</p>

              <div className="chips experience-chips">
                {(item.technologies || []).map((tech: string) => (
                  <b key={tech}>{tech}</b>
                ))}
              </div>

              <div className="experience-footer">
                <Rocket size={14} />
                {language === 'ar'
                  ? 'تنفيذ عملي ضمن بيئة حقيقية'
                  : 'Real-world execution'}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}