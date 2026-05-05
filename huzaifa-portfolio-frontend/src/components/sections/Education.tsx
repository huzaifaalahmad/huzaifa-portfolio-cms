import { Award, BookOpenCheck, GraduationCap, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { educationApi } from '@/services/api/educationApi';
import { useLanguage } from '@/context/LanguageContext';
import SectionHeader from '@/components/ui/SectionHeader';

export default function Education() {
  const { language } = useLanguage();
  const [education, setEducation] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEducation();
  }, []);

  async function loadEducation() {
    try {
      const res = await educationApi.getAll();
      setEducation(res.data.education);
      setCertifications(res.data.certifications);
    } catch (error) {
      console.error('Failed to load education', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="education" className="section alt education-section">
      <SectionHeader
        eyebrow="06 / Education"
        title={{
          en: 'Learning shaped by real builds',
          ar: 'تعلم يتشكل عبر مشاريع حقيقية',
        }}
        description={{
          en: 'A foundation in information systems, strengthened by applied AI, full-stack projects, and visual design practice.',
          ar: 'أساس في هندسة المعلومات مدعوم بتطبيقات عملية في الذكاء الاصطناعي والويب والتصميم البصري.',
        }}
      />

      {loading ? (
        <p>Loading education...</p>
      ) : (
        <div className="education-layout">
          <div className="education-column">
            <div className="column-title">
              <GraduationCap size={20} />
              <h3>{language === 'ar' ? 'التعليم الأكاديمي' : 'Academic Education'}</h3>
            </div>

            {education.length === 0 ? (
              <p>No education added yet.</p>
            ) : (
              education.map((item) => (
                <article className="education-card" key={item.id}>
                  <div className="education-icon">
                    <BookOpenCheck size={20} />
                  </div>

                  <div>
                    <span className="education-label">
                      {language === 'ar' ? 'مسار معرفي' : 'Knowledge Track'}
                    </span>

                    <h4>{item.degree}</h4>
                    <p>{item.institution}</p>
                    <small>
                      {item.field}
                      {item.startDate || item.endDate
                        ? ` • ${item.startDate || ''}${item.endDate ? ` - ${item.endDate}` : ''}`
                        : ''}
                    </small>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="education-column">
            <div className="column-title">
              <Award size={20} />
              <h3>{language === 'ar' ? 'الشهادات والتطوير' : 'Certifications'}</h3>
            </div>

            {certifications.length === 0 ? (
              <p>No certifications added yet.</p>
            ) : (
              certifications.map((item) => (
                <article className="education-card" key={item.id}>
                  <div className="education-icon">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <span className="education-label">
                      {language === 'ar' ? 'اعتماد مهاري' : 'Skill Credential'}
                    </span>

                    <h4>{item.name}</h4>
                    <p>{item.issuer}</p>
                    <small>{item.issueDate}</small>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
}