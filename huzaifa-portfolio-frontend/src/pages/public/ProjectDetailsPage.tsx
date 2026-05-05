import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { apiClient } from '@/services/api/client';

export default function ProjectDetailsPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [slug]);

  async function loadProject() {
    try {
      const res = await apiClient.get(`/projects/${slug}`);
      setProject(res.data.data);
    } catch {
      setProject(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="section page-offset">
          <p>Loading project...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="section page-offset">
          <h1>Project not found</h1>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="section page-offset case-study">
        <Link to="/projects" className="text-link">
          ← Back
        </Link>

        <span className="badge">{project.category}</span>

        <h1>{project.title}</h1>

        <p className="lead">{project.description}</p>

        <div className="chips">
          {(project.technologies || []).map((tech: string) => (
            <b key={tech}>{tech}</b>
          ))}
        </div>

        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank">
            Live Demo
          </a>
        )}

        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank">
            GitHub
          </a>
        )}
      </main>

      <Footer />
    </>
  );
}