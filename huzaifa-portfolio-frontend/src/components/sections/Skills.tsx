import {
  Bot,
  Code2,
  Database,
  Layers3,
  Palette,
  Workflow,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { skillApi } from '@/services/api/skillApi';
import { useLanguage } from '@/context/LanguageContext';
import SectionHeader from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';

const labels: Record<string, { en: string; ar: string }> = {
  frontend: { en: 'Frontend', ar: 'الواجهة الأمامية' },
  backend: { en: 'Backend', ar: 'الخلفية' },
  ai: { en: 'AI & Prompting', ar: 'الذكاء والتلقين' },
  database: { en: 'Databases', ar: 'قواعد البيانات' },
  design: { en: 'Design', ar: 'التصميم' },
  automation: { en: 'Automation', ar: 'الأتمتة' },
};

const icons: Record<string, React.ReactNode> = {
  frontend: <Layers3 size={19} />,
  backend: <Code2 size={19} />,
  ai: <Bot size={19} />,
  database: <Database size={19} />,
  design: <Palette size={19} />,
  automation: <Workflow size={19} />,
};

export default function Skills() {
  const { t, language } = useLanguage();
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    try {
      const res = await skillApi.getAll();
      setSkills(res.data);
    } catch (error) {
      console.error('Failed to load skills', error);
    } finally {
      setLoading(false);
    }
  }

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="section skills-section">
      <SectionHeader
        eyebrow="03 / Skills"
        title={{
          en: 'A technical toolkit for real products',
          ar: 'مجموعة مهارات لبناء منتجات حقيقية',
        }}
        description={{
          en: 'A cross-functional stack selected for shipping interfaces, APIs, AI workflows, and visual systems.',
          ar: 'مجموعة مهارات تجمع بين الواجهات والواجهات الخلفية وتدفقات الذكاء الاصطناعي والأنظمة البصرية.',
        }}
      />

      {loading ? (
        <p>Loading skills...</p>
      ) : skills.length === 0 ? (
        <p>No skills added yet.</p>
      ) : (
        <div className="skills-board">
          {categories.map((category, groupIndex) => {
            const items = skills.filter((s) => s.category === category);
            const label = labels[category] || { en: category, ar: category };

            return (
              <Reveal key={category} delay={groupIndex * 0.1}>
                <article className="skill-group">
                  <div className="skill-group-head">
                    <div className="skill-group-icon">
                      {icons[category] || <Code2 size={19} />}
                    </div>

                    <div>
                      <h3>{t(label)}</h3>
                      <p>
                        {language === 'ar'
                          ? 'مهارات قابلة للتطبيق ضمن منتجات فعلية'
                          : 'Applied in real product workflows'}
                      </p>
                    </div>
                  </div>

                  <div className="skills-list">
                    {items.map((skill, index) => (
                      <Reveal key={skill.id} delay={index * 0.05}>
                        <div className="skill-card">
                          <div className="skill-top">
                            <strong>{skill.name}</strong>
                            <span>{skill.yearsOfExperience}+ yrs</span>
                          </div>

                          <div className="skill-bar">
                            <i style={{ width: `${skill.proficiency}%` }} />
                          </div>

                          <small>
                            {skill.proficiency}% practical confidence
                          </small>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      )}
    </section>
  );
}