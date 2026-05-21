import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { contactApi } from '@/services/api/contactApi';
import { educationApi } from '@/services/api/educationApi';
import { experienceApi } from '@/services/api/experienceApi';
import { projectApi } from '@/services/api/projectApi';
import { skillApi } from '@/services/api/skillApi';

type EditingState = {
  kind: 'project' | 'skill' | 'experience' | 'education' | 'certification';
  item: any;
} | null;

function csv(value: unknown) {
  if (Array.isArray(value)) return value.join(', ');
  return String(value || '');
}

function splitCsv(value: FormDataEntryValue | null) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function asString(value: FormDataEntryValue | null) {
  return String(value || '').trim();
}

export default function AdminCrudPage() {
  const { section = 'section' } = useParams();

  const [messages, setMessages] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [editing, setEditing] = useState<EditingState>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setEditing(null);
    if (section === 'messages' || section === 'contact') void loadMessages();
    if (section === 'projects') void loadProjects();
    if (section === 'skills') void loadSkills();
    if (section === 'experience') void loadExperiences();
    if (section === 'education') void loadEducation();
  }, [section]);

  function handleError(err: unknown) {
    console.error(err);
    setError('Action failed. Confirm owner-admin login and backend connection.');
  }

  function clearForm(form: HTMLFormElement) {
    form.reset();
    setEditing(null);
  }

  async function loadMessages() {
    setLoading(true);
    try {
      const res = await contactApi.list();
      setMessages(res.data || []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      await contactApi.markRead(id);
      await loadMessages();
    } catch (err) {
      handleError(err);
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm('Delete this message?')) return;
    try {
      await contactApi.delete(id);
      await loadMessages();
    } catch (err) {
      handleError(err);
    }
  }

  async function loadProjects() {
    setLoading(true);
    try {
      const res = await projectApi.list();
      setProjects(res.data || []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  async function saveProject(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      title: asString(fd.get('title')),
      slug: asString(fd.get('slug')),
      category: asString(fd.get('category')),
      description: asString(fd.get('description')),
      technologies: splitCsv(fd.get('technologies')),
      liveUrl: asString(fd.get('liveUrl')),
      githubUrl: asString(fd.get('githubUrl')),
      imageUrl: asString(fd.get('imageUrl')),
      order: Number(fd.get('order') || 0),
      isVisible: fd.get('isVisible') === 'on',
      isFeatured: fd.get('isFeatured') === 'on',
    };

    try {
      if (editing?.kind === 'project') await projectApi.update(editing.item.id, payload);
      else await projectApi.create(payload);
      clearForm(form);
      await loadProjects();
    } catch (err) {
      handleError(err);
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Delete this project?')) return;
    try {
      await projectApi.remove(id);
      await loadProjects();
    } catch (err) {
      handleError(err);
    }
  }

  async function loadSkills() {
    setLoading(true);
    try {
      const res = await skillApi.getAll();
      setSkills(res.data || []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  async function saveSkill(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: asString(fd.get('name')),
      category: asString(fd.get('category')),
      proficiency: Number(fd.get('proficiency') || 70),
      yearsOfExperience: Number(fd.get('yearsOfExperience') || 1),
      order: Number(fd.get('order') || 0),
      isVisible: fd.get('isVisible') === 'on',
    };

    try {
      if (editing?.kind === 'skill') await skillApi.update(editing.item.id, payload);
      else await skillApi.create(payload);
      clearForm(form);
      await loadSkills();
    } catch (err) {
      handleError(err);
    }
  }

  async function deleteSkill(id: string) {
    if (!confirm('Delete this skill?')) return;
    try {
      await skillApi.delete(id);
      await loadSkills();
    } catch (err) {
      handleError(err);
    }
  }

  async function loadExperiences() {
    setLoading(true);
    try {
      const res = await experienceApi.getAll();
      setExperiences(res.data || []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  async function saveExperience(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      company: asString(fd.get('company')),
      role: asString(fd.get('role')),
      location: asString(fd.get('location')),
      employmentType: asString(fd.get('employmentType')) || 'Freelance',
      startDate: asString(fd.get('startDate')),
      endDate: asString(fd.get('endDate')),
      isCurrent: fd.get('isCurrent') === 'on',
      description: asString(fd.get('description')),
      technologies: splitCsv(fd.get('technologies')),
      achievements: splitCsv(fd.get('achievements')),
      order: Number(fd.get('order') || 0),
      isVisible: fd.get('isVisible') === 'on',
      isFeatured: fd.get('isFeatured') === 'on',
    };

    try {
      if (editing?.kind === 'experience') await experienceApi.update(editing.item.id, payload);
      else await experienceApi.create(payload);
      clearForm(form);
      await loadExperiences();
    } catch (err) {
      handleError(err);
    }
  }

  async function deleteExperience(id: string) {
    if (!confirm('Delete this experience?')) return;
    try {
      await experienceApi.delete(id);
      await loadExperiences();
    } catch (err) {
      handleError(err);
    }
  }

  async function loadEducation() {
    setLoading(true);
    try {
      const res = await educationApi.getAll();
      setEducation(res.data?.education || []);
      setCertifications(res.data?.certifications || []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  async function saveEducation(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      degree: asString(fd.get('degree')),
      institution: asString(fd.get('institution')),
      field: asString(fd.get('field')),
      startDate: asString(fd.get('startDate')),
      endDate: asString(fd.get('endDate')),
      order: Number(fd.get('order') || 0),
      isVisible: fd.get('isVisible') === 'on',
    };

    try {
      if (editing?.kind === 'education') await educationApi.updateEducation(editing.item.id, payload);
      else await educationApi.createEducation(payload);
      clearForm(form);
      await loadEducation();
    } catch (err) {
      handleError(err);
    }
  }

  async function saveCertification(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: asString(fd.get('name')),
      issuer: asString(fd.get('issuer')),
      issueDate: asString(fd.get('issueDate')),
      credentialUrl: asString(fd.get('credentialUrl')),
      order: Number(fd.get('order') || 0),
      isVisible: fd.get('isVisible') === 'on',
    };

    try {
      if (editing?.kind === 'certification') {
        await educationApi.updateCertification(editing.item.id, payload);
      } else {
        await educationApi.createCertification(payload);
      }
      clearForm(form);
      await loadEducation();
    } catch (err) {
      handleError(err);
    }
  }

  async function deleteEducation(id: string) {
    if (!confirm('Delete this education item?')) return;
    try {
      await educationApi.deleteEducation(id);
      await loadEducation();
    } catch (err) {
      handleError(err);
    }
  }

  async function deleteCertification(id: string) {
    if (!confirm('Delete this certification?')) return;
    try {
      await educationApi.deleteCertification(id);
      await loadEducation();
    } catch (err) {
      handleError(err);
    }
  }

  const ErrorMessage = () => (error ? <p className="error">{error}</p> : null);
  const isEditing = (kind: NonNullable<EditingState>['kind']) => editing?.kind === kind;

  if (section === 'messages' || section === 'contact') {
    return (
      <AdminLayout>
        <div>
          <AdminTop title="Contact Messages" text="Read and delete submitted messages." onRefresh={loadMessages} />
          <ErrorMessage />
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
                    {!message.isRead && <button onClick={() => markAsRead(message.id)}>Mark read</button>}
                    <button onClick={() => deleteMessage(message.id)}>Delete</button>
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
    const item = isEditing('project') ? editing?.item : null;
    return (
      <AdminLayout>
        <div>
          <AdminTop title="Projects" text="Add, edit, and delete portfolio projects." onRefresh={loadProjects} />
          <ErrorMessage />
          <form className="admin-form" onSubmit={saveProject} key={item?.id || 'new-project'}>
            <input name="title" placeholder="Project title" defaultValue={item?.title || ''} required />
            <input name="slug" placeholder="project-slug" defaultValue={item?.slug || ''} required />
            <input name="category" placeholder="Category" defaultValue={item?.category || ''} required />
            <input name="technologies" placeholder="React, Node, Prisma" defaultValue={csv(item?.technologies)} />
            <input name="liveUrl" placeholder="Live URL" defaultValue={item?.liveUrl || ''} />
            <input name="githubUrl" placeholder="GitHub URL" defaultValue={item?.githubUrl || ''} />
            <input name="imageUrl" placeholder="Image URL" defaultValue={item?.imageUrl || ''} />
            <input name="order" type="number" placeholder="Order" defaultValue={item?.order || 0} />
            <textarea name="description" placeholder="Project description" defaultValue={item?.description || ''} required />
            <label><input name="isVisible" type="checkbox" defaultChecked={item?.isVisible ?? true} /> Visible</label>
            <label><input name="isFeatured" type="checkbox" defaultChecked={Boolean(item?.isFeatured)} /> Featured</label>
            <FormActions editing={Boolean(item)} onCancel={() => setEditing(null)} />
          </form>
          <AdminList items={projects} primary="title" secondary="category" body="description" onEdit={(project) => setEditing({ kind: 'project', item: project })} onDelete={deleteProject} />
        </div>
      </AdminLayout>
    );
  }

  if (section === 'skills') {
    const item = isEditing('skill') ? editing?.item : null;
    return (
      <AdminLayout>
        <div>
          <AdminTop title="Skills" text="Add, edit, and delete skills." onRefresh={loadSkills} />
          <ErrorMessage />
          <form className="admin-form" onSubmit={saveSkill} key={item?.id || 'new-skill'}>
            <input name="name" placeholder="Skill name" defaultValue={item?.name || ''} required />
            <select name="category" required defaultValue={item?.category || 'frontend'}>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="ai">AI & Prompting</option>
              <option value="database">Databases</option>
              <option value="design">Design</option>
              <option value="automation">Automation</option>
            </select>
            <input name="proficiency" type="number" min="1" max="100" placeholder="Proficiency" defaultValue={item?.proficiency || 70} required />
            <input name="yearsOfExperience" type="number" step="0.5" min="0" placeholder="Years" defaultValue={item?.yearsOfExperience || 1} required />
            <input name="order" type="number" placeholder="Order" defaultValue={item?.order || 0} />
            <label><input name="isVisible" type="checkbox" defaultChecked={item?.isVisible ?? true} /> Visible</label>
            <FormActions editing={Boolean(item)} onCancel={() => setEditing(null)} />
          </form>
          <AdminList items={skills} primary="name" secondary="category" body="proficiency" suffix="%" onEdit={(skill) => setEditing({ kind: 'skill', item: skill })} onDelete={deleteSkill} />
        </div>
      </AdminLayout>
    );
  }

  if (section === 'experience') {
    const item = isEditing('experience') ? editing?.item : null;
    return (
      <AdminLayout>
        <div>
          <AdminTop title="Experience" text="Add, edit, and delete experience items." onRefresh={loadExperiences} />
          <ErrorMessage />
          <form className="admin-form" onSubmit={saveExperience} key={item?.id || 'new-experience'}>
            <input name="company" placeholder="Company" defaultValue={item?.company || ''} required />
            <input name="role" placeholder="Role" defaultValue={item?.role || ''} required />
            <input name="location" placeholder="Location" defaultValue={item?.location || ''} required />
            <input name="employmentType" placeholder="Employment type" defaultValue={item?.employmentType || 'Freelance'} />
            <input name="startDate" placeholder="Start Date" defaultValue={item?.startDate || ''} required />
            <input name="endDate" placeholder="End Date" defaultValue={item?.endDate || ''} />
            <input name="technologies" placeholder="React, Node, AI" defaultValue={csv(item?.technologies)} />
            <input name="achievements" placeholder="Achievement 1, Achievement 2" defaultValue={csv(item?.achievements)} />
            <input name="order" type="number" placeholder="Order" defaultValue={item?.order || 0} />
            <textarea name="description" placeholder="Description" defaultValue={item?.description || ''} required />
            <label><input name="isVisible" type="checkbox" defaultChecked={item?.isVisible ?? true} /> Visible</label>
            <label><input name="isCurrent" type="checkbox" defaultChecked={Boolean(item?.isCurrent)} /> Current</label>
            <label><input name="isFeatured" type="checkbox" defaultChecked={Boolean(item?.isFeatured)} /> Featured</label>
            <FormActions editing={Boolean(item)} onCancel={() => setEditing(null)} />
          </form>
          <AdminList items={experiences} primary="role" secondary="company" body="description" onEdit={(experience) => setEditing({ kind: 'experience', item: experience })} onDelete={deleteExperience} />
        </div>
      </AdminLayout>
    );
  }

  if (section === 'education') {
    const eduItem = isEditing('education') ? editing?.item : null;
    const certItem = isEditing('certification') ? editing?.item : null;
    return (
      <AdminLayout>
        <div>
          <AdminTop title="Education" text="Add, edit, and delete education and certifications." onRefresh={loadEducation} />
          <ErrorMessage />
          <form className="admin-form" onSubmit={saveEducation} key={eduItem?.id || 'new-education'}>
            <h3>{eduItem ? 'Edit Education' : 'Academic Education'}</h3>
            <input name="degree" placeholder="Degree" defaultValue={eduItem?.degree || ''} required />
            <input name="institution" placeholder="Institution" defaultValue={eduItem?.institution || ''} required />
            <input name="field" placeholder="Field" defaultValue={eduItem?.field || ''} required />
            <input name="startDate" placeholder="Start date" defaultValue={eduItem?.startDate || ''} />
            <input name="endDate" placeholder="End date" defaultValue={eduItem?.endDate || ''} />
            <input name="order" type="number" placeholder="Order" defaultValue={eduItem?.order || 0} />
            <label><input name="isVisible" type="checkbox" defaultChecked={eduItem?.isVisible ?? true} /> Visible</label>
            <FormActions editing={Boolean(eduItem)} onCancel={() => setEditing(null)} />
          </form>
          <form className="admin-form" onSubmit={saveCertification} key={certItem?.id || 'new-cert'}>
            <h3>{certItem ? 'Edit Certification' : 'Certification'}</h3>
            <input name="name" placeholder="Certification name" defaultValue={certItem?.name || ''} required />
            <input name="issuer" placeholder="Issuer" defaultValue={certItem?.issuer || ''} required />
            <input name="issueDate" placeholder="Issue date" defaultValue={certItem?.issueDate || ''} required />
            <input name="credentialUrl" placeholder="/assets/certificates/certificate.pdf or https://..." defaultValue={certItem?.credentialUrl || ''} />
            <input name="order" type="number" placeholder="Order" defaultValue={certItem?.order || 0} />
            <label><input name="isVisible" type="checkbox" defaultChecked={certItem?.isVisible ?? true} /> Visible</label>
            <FormActions editing={Boolean(certItem)} onCancel={() => setEditing(null)} />
          </form>
          {loading ? <p>Loading education...</p> : (
            <>
              <AdminList items={education} primary="degree" secondary="institution" body="field" onEdit={(item) => setEditing({ kind: 'education', item })} onDelete={deleteEducation} />
              <AdminList items={certifications} primary="name" secondary="issuer" body="issueDate" onEdit={(item) => setEditing({ kind: 'certification', item })} onDelete={deleteCertification} />
            </>
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

function AdminTop({
  title,
  text,
  onRefresh,
}: {
  title: string;
  text: string;
  onRefresh: () => void | Promise<void>;
}) {
  return (
    <div className="admin-top">
      <div>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      <button className="btn btn-primary" onClick={() => void onRefresh()}>Refresh</button>
    </div>
  );
}

function FormActions({ editing, onCancel }: { editing: boolean; onCancel: () => void }) {
  return (
    <div className="admin-form-actions">
      <button className="btn btn-primary">{editing ? 'Save Changes' : 'Add Item'}</button>
      {editing ? <button type="button" onClick={onCancel}>Cancel</button> : null}
    </div>
  );
}

function AdminList({
  items,
  primary,
  secondary,
  body,
  suffix = '',
  onEdit,
  onDelete,
}: {
  items: any[];
  primary: string;
  secondary: string;
  body: string;
  suffix?: string;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="admin-table">
      {items.map((item) => (
        <div className="message-card" key={item.id}>
          <div className="message-info">
            <strong>{item[primary]}</strong>
            <p>{item[secondary]}</p>
            <small>{item[body]}{suffix}</small>
          </div>
          <div className="message-actions">
            <button onClick={() => onEdit(item)}>Edit</button>
            <button onClick={() => onDelete(item.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
