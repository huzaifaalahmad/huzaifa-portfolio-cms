import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { apiClient } from '@/services/api/client';
import { Reveal } from '@/components/ui/Reveal';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const res = await apiClient.get('/projects');
      setProjects(res.data.data);
    } catch (e) {
      console.error('Failed to load projects', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="projects" className="section">
      <SectionHeader
        eyebrow="05 / Projects"
        title={{
          en: 'Selected work built to prove capability',
          ar: 'أعمال مختارة لإثبات القدرة',
        }}
        description={{
          en: 'Each project is framed around problem, solution, role, and impact.',
          ar: 'كل مشروع معروض حول المشكلة والحل والدور والأثر.',
        }}
      />

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div className="project-grid">
          {projects.map((p, index) => (
            <Reveal key={p.id} delay={index * 0.08}>
              <article className="project-card">
                <span className="badge">{p.category}</span>

                <h3>{p.title}</h3>

                <p>{p.description}</p>

                <div className="chips">
                  {(p.technologies || []).slice(0, 4).map((tech: string) => (
                    <b key={tech}>{tech}</b>
                  ))}
                </div>

                <Link to={`/projects/${p.slug}`} className="text-link">
                  Case Study →
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}