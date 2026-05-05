import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { contactApi } from '@/services/api/contactApi';
import { projectApi } from '@/services/api/projectApi';
import { skillApi } from '@/services/api/skillApi';
import { experienceApi } from '@/services/api/experienceApi';
import { educationApi } from '@/services/api/educationApi';

export default function AdminCrudPage() {
  const { section = 'section' } = useParams();

  const [messages, setMessages] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (section === 'messages' || section === 'contact') loadMessages();
    if (section === 'projects') loadProjects();
    if (section === 'skills') loadSkills();
    if (section === 'experience') loadExperiences();
    if (section === 'education') loadEducation();
  }, [section]);

  async function loadMessages() {
    setLoading(true);
    try {
      const res = await contactApi.list();
      setMessages(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    await contactApi.markRead(id);
    await loadMessages();
  }

  async function loadProjects() {
    setLoading(true);
    try {
      const res = await projectApi.list();
      setProjects(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function createProject(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    await projectApi.create({
      title: String(fd.get('title')),
      slug: String(fd.get('slug')),
      category: String(fd.get('category')),
      description: String(fd.get('description')),
      technologies: String(fd.get('technologies'))
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
      liveUrl: String(fd.get('liveUrl') || ''),
      githubUrl: String(fd.get('githubUrl') || ''),
      imageUrl: String(fd.get('imageUrl') || ''),
      order: Number(fd.get('order') || 0),
      isVisible: true,
      isFeatured: fd.get('isFeatured') === 'on',
    });

    e.currentTarget.reset();
    await loadProjects();
  }

  async function deleteProject(id: string) {
    if (!confirm('Delete this project?')) return;
    await projectApi.remove(id);
    await loadProjects();
  }

  async function loadSkills() {
    setLoading(true);
    try {
      const res = await skillApi.getAll();
      setSkills(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function createSkill(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    await skillApi.create({
      name: String(fd.get('name')),
      category: String(fd.get('category')),
      proficiency: Number(fd.get('proficiency') || 70),
      yearsOfExperience: Number(fd.get('yearsOfExperience') || 1),
      order: Number(fd.get('order') || 0),
      isVisible: true,
    });

    e.currentTarget.reset();
    await loadSkills();
  }

  async function deleteSkill(id: string) {
    if (!confirm('Delete this skill?')) return;
    await skillApi.delete(id);
    await loadSkills();
  }

  async function loadExperiences() {
    setLoading(true);
    try {
      const res = await experienceApi.getAll();
      setExperiences(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function createExperience(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    await experienceApi.create({
      company: String(fd.get('company')),
      role: String(fd.get('role')),
      location: String(fd.get('location')),
      employmentType: String(fd.get('employmentType') || 'Freelance'),
      startDate: String(fd.get('startDate')),
      endDate: String(fd.get('endDate') || ''),
      isCurrent: fd.get('isCurrent') === 'on',
      description: String(fd.get('description')),
      technologies: String(fd.get('technologies') || '')
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
      achievements: String(fd.get('achievements') || '')
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
      order: Number(fd.get('order') || 0),
      isVisible: true,
      isFeatured: fd.get('isFeatured') === 'on',
    });

    e.currentTarget.reset();
    await loadExperiences();
  }

  async function deleteExperience(id: string) {
    if (!confirm('Delete this experience?')) return;
    await experienceApi.delete(id);
    await loadExperiences();
  }

  async function loadEducation() {
    setLoading(true);
    try {
      const res = await educationApi.getAll();
      setEducation(res.data.education);
      setCertifications(res.data.certifications);
    } finally {
      setLoading(false);
    }
  }

  async function createEducation(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    await educationApi.createEducation({
      degree: String(fd.get('degree')),
      institution: String(fd.get('institution')),
      field: String(fd.get('field')),
      startDate: String(fd.get('startDate') || ''),
      endDate: String(fd.get('endDate') || ''),
      order: Number(fd.get('order') || 0),
      isVisible: true,
    });

    e.currentTarget.reset();
    await loadEducation();
  }

  async function createCertification(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    await educationApi.createCertification({
      name: String(fd.get('name')),
      issuer: String(fd.get('issuer')),
      issueDate: String(fd.get('issueDate')),
      order: Number(fd.get('order') || 0),
      isVisible: true,
    });

    e.currentTarget.reset();
    await loadEducation();
  }

  async function deleteEducation(id: string) {
    if (!confirm('Delete this education item?')) return;
    await educationApi.deleteEducation(id);
    await loadEducation();
  }

  async function deleteCertification(id: string) {
    if (!confirm('Delete this certification?')) return;
    await educationApi.deleteCertification(id);
    await loadEducation();
  }

  if (section === 'messages' || section === 'contact') {
    return (
      <AdminLayout>
        <div>
          <div className="admin-top">
            <div>
              <h1>Contact Messages</h1>
              <p>Messages submitted from the public contact form.</p>
            </div>
            <button className="btn btn-primary" onClick={loadMessages}>Refresh</button>
          </div>

          {loading ? <p>Loading messages...</p> : (
            <div className="admin-table">
              {messages.map((message) => (
                <div className="message-card" key={message.id}>
                  <div className="message-info">
                    <strong>{message.name}</strong>
                    <p>{message.email}</p>
                    <p>{message.subject}</p>
                    <small>{message.message}</small>
                  </div>
                  <div className="message-actions">
                    <span className={`message-status ${message.isRead ? 'read' : 'unread'}`}>
                      {message.isRead ? 'Read' : 'Unread'}
                    </span>
                    {!message.isRead && (
                      <button onClick={() => markAsRead(message.id)}>Mark as Read</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  if (section === 'projects') {
    return (
      <AdminLayout>
        <div>
          <div className="admin-top">
            <div>
              <h1>Projects</h1>
              <p>Add and delete portfolio projects.</p>
            </div>
            <button className="btn btn-primary" onClick={loadProjects}>Refresh</button>
          </div>

          <form className="admin-form" onSubmit={createProject}>
            <input name="title" placeholder="Project title" required />
            <input name="slug" placeholder="project-slug" required />
            <input name="category" placeholder="Category" required />
            <input name="technologies" placeholder="React, Node, Prisma" required />
            <input name="liveUrl" placeholder="Live URL" />
            <input name="githubUrl" placeholder="GitHub URL" />
            <input name="imageUrl" placeholder="Image URL" />
            <input name="order" type="number" placeholder="Order" />
            <textarea name="description" placeholder="Project description" required />
            <label><input name="isFeatured" type="checkbox" /> Featured</label>
            <button className="btn btn-primary">Add Project</button>
          </form>

          <div className="admin-table">
            {projects.map((project) => (
              <div className="message-card" key={project.id}>
                <div className="message-info">
                  <strong>{project.title}</strong>
                  <p>{project.category}</p>
                  <small>{project.description}</small>
                </div>
                <div className="message-actions">
                  <button onClick={() => deleteProject(project.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (section === 'skills') {
    return (
      <AdminLayout>
        <div>
          <div className="admin-top">
            <div>
              <h1>Skills</h1>
              <p>Add and delete skills.</p>
            </div>
            <button className="btn btn-primary" onClick={loadSkills}>Refresh</button>
          </div>

          <form className="admin-form" onSubmit={createSkill}>
            <input name="name" placeholder="Skill name" required />
            <select name="category" required defaultValue="frontend">
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="ai">AI & Prompting</option>
              <option value="database">Databases</option>
              <option value="design">Design</option>
              <option value="automation">Automation</option>
            </select>
            <input name="proficiency" type="number" min="1" max="100" placeholder="Proficiency" required />
            <input name="yearsOfExperience" type="number" step="0.5" min="0" placeholder="Years" required />
            <input name="order" type="number" placeholder="Order" />
            <button className="btn btn-primary">Add Skill</button>
          </form>

          <div className="admin-table">
            {skills.map((skill) => (
              <div className="message-card" key={skill.id}>
                <div className="message-info">
                  <strong>{skill.name}</strong>
                  <p>{skill.category}</p>
                  <small>{skill.proficiency}% • {skill.yearsOfExperience}+ yrs</small>
                </div>
                <div className="message-actions">
                  <button onClick={() => deleteSkill(skill.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (section === 'experience') {
    return (
      <AdminLayout>
        <div>
          <div className="admin-top">
            <div>
              <h1>Experience</h1>
              <p>Add and delete experience items.</p>
            </div>
            <button className="btn btn-primary" onClick={loadExperiences}>Refresh</button>
          </div>

          <form className="admin-form" onSubmit={createExperience}>
            <input name="company" placeholder="Company" required />
            <input name="role" placeholder="Role" required />
            <input name="location" placeholder="Location" required />
            <input name="employmentType" placeholder="Employment type" />
            <input name="startDate" placeholder="Start Date" required />
            <input name="endDate" placeholder="End Date" />
            <input name="technologies" placeholder="React, Node, AI" />
            <input name="achievements" placeholder="Achievement 1, Achievement 2" />
            <input name="order" type="number" placeholder="Order" />
            <textarea name="description" placeholder="Description" required />
            <label><input name="isCurrent" type="checkbox" /> Current</label>
            <label><input name="isFeatured" type="checkbox" /> Featured</label>
            <button className="btn btn-primary">Add Experience</button>
          </form>

          <div className="admin-table">
            {experiences.map((exp) => (
              <div className="message-card" key={exp.id}>
                <div className="message-info">
                  <strong>{exp.role}</strong>
                  <p>{exp.company}</p>
                  <small>{exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}</small>
                </div>
                <div className="message-actions">
                  <button onClick={() => deleteExperience(exp.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (section === 'education') {
    return (
      <AdminLayout>
        <div>
          <div className="admin-top">
            <div>
              <h1>Education</h1>
              <p>Add academic education and certifications.</p>
            </div>
            <button className="btn btn-primary" onClick={loadEducation}>Refresh</button>
          </div>

          <form className="admin-form" onSubmit={createEducation}>
            <h3>Academic Education</h3>
            <input name="degree" placeholder="Degree" required />
            <input name="institution" placeholder="Institution" required />
            <input name="field" placeholder="Field" required />
            <input name="startDate" placeholder="Start date" />
            <input name="endDate" placeholder="End date" />
            <input name="order" type="number" placeholder="Order" />
            <button className="btn btn-primary">Add Education</button>
          </form>

          <form className="admin-form" onSubmit={createCertification}>
            <h3>Certification</h3>
            <input name="name" placeholder="Certification name" required />
            <input name="issuer" placeholder="Issuer" required />
            <input name="issueDate" placeholder="Issue date" required />
            <input name="order" type="number" placeholder="Order" />
            <button className="btn btn-primary">Add Certification</button>
          </form>

          {loading ? <p>Loading education...</p> : (
            <div className="admin-table">
              {education.map((item) => (
                <div className="message-card" key={item.id}>
                  <div className="message-info">
                    <strong>{item.degree}</strong>
                    <p>{item.institution}</p>
                    <small>{item.field}</small>
                  </div>
                  <div className="message-actions">
                    <button onClick={() => deleteEducation(item.id)}>Delete</button>
                  </div>
                </div>
              ))}

              {certifications.map((item) => (
                <div className="message-card" key={item.id}>
                  <div className="message-info">
                    <strong>{item.name}</strong>
                    <p>{item.issuer}</p>
                    <small>{item.issueDate}</small>
                  </div>
                  <div className="message-actions">
                    <button onClick={() => deleteCertification(item.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1>{section}</h1>
        <p>This section is ready for future backend integration.</p>
      </div>
    </AdminLayout>
  );
}