import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  ManagedStat,
  ManagedService,
  ManagedTestimonial,
  resolveManagedAssetUrl,
  siteContentApi,
  SiteContent,
} from '@/services/api/siteContentApi';

type Lang = 'en' | 'ar';

const emptyService = (): ManagedService => ({
  id: `service-${Date.now()}`,
  title: { en: '', ar: '' },
  description: { en: '', ar: '' },
  icon: 'spark',
  isVisible: true,
  order: 0,
});

const emptyStat = (): ManagedStat => ({
  id: `stat-${Date.now()}`,
  label: { en: '', ar: '' },
  value: 0,
  suffix: '+',
  isVisible: true,
  order: 0,
});

const emptyTestimonial = (): ManagedTestimonial => ({
  id: `testimonial-${Date.now()}`,
  clientName: { en: '', ar: '' },
  clientRole: { en: '', ar: '' },
  clientCompany: { en: '', ar: '' },
  text: { en: '', ar: '' },
  rating: 5,
  isVisible: true,
  order: 0,
});

function lines(value: unknown) {
  return Array.isArray(value) ? value.join('\n') : String(value || '');
}

function paragraphs(value: unknown) {
  return Array.isArray(value) ? value.join('\n\n') : String(value || '');
}

function splitLines(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

function splitParagraphs(value: string) {
  return value.split(/\n\s*\n/g).map((item) => item.trim()).filter(Boolean);
}

function readFileData(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function AdminSiteContentPage() {
  const [content, setContent] = useState<SiteContent>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);

  useEffect(() => {
    void loadContent();
  }, []);

  async function loadContent() {
    setLoading(true);
    setError('');
    try {
      const res = await siteContentApi.getPublic();
      setContent(res.data || {});
    } catch (err) {
      console.error(err);
      setError('Could not load site content.');
    } finally {
      setLoading(false);
    }
  }

  function updateCopy(lang: Lang, key: string, value: unknown) {
    setContent((current) => ({
      ...current,
      copy: {
        ...current.copy,
        [lang]: {
          ...(current.copy?.[lang] || {}),
          [key]: value,
        },
      },
    }));
  }

  function updateService(index: number, patch: Partial<ManagedService>) {
    setContent((current) => {
      const services = [...(current.services || [])];
      services[index] = { ...services[index], ...patch };
      return { ...current, services };
    });
  }

  function updateStat(index: number, patch: Partial<ManagedStat>) {
    setContent((current) => {
      const stats = [...(current.stats || [])];
      stats[index] = { ...stats[index], ...patch };
      return { ...current, stats };
    });
  }

  function updateStatLabel(index: number, lang: Lang, value: string) {
    setContent((current) => {
      const stats = [...(current.stats || [])];
      const item = stats[index];
      stats[index] = { ...item, label: { ...item.label, [lang]: value } };
      return { ...current, stats };
    });
  }

  function updateServiceText(index: number, field: 'title' | 'description', lang: Lang, value: string) {
    setContent((current) => {
      const services = [...(current.services || [])];
      const item = services[index];
      services[index] = { ...item, [field]: { ...item[field], [lang]: value } };
      return { ...current, services };
    });
  }

  function updateTestimonial(index: number, patch: Partial<ManagedTestimonial>) {
    setContent((current) => {
      const testimonials = [...(current.testimonials || [])];
      testimonials[index] = { ...testimonials[index], ...patch };
      return { ...current, testimonials };
    });
  }

  function updateTestimonialText(
    index: number,
    field: 'clientName' | 'clientRole' | 'clientCompany' | 'text',
    lang: Lang,
    value: string
  ) {
    setContent((current) => {
      const testimonials = [...(current.testimonials || [])];
      const item = testimonials[index];
      testimonials[index] = { ...item, [field]: { ...item[field], [lang]: value } };
      return { ...current, testimonials };
    });
  }

  async function saveContent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('');
    setError('');
    try {
      const res = await siteContentApi.update(content);
      setContent(res.data || content);
      setStatus('Saved successfully.');
    } catch (err) {
      console.error(err);
      setError('Could not save site content.');
    }
  }

  async function uploadCv() {
    if (!cvFile) return;
    setStatus('');
    setError('');
    try {
      const data = await readFileData(cvFile);
      const res = await siteContentApi.uploadCv({
        fileName: cvFile.name,
        mimeType: cvFile.type || 'application/pdf',
        data,
      });
      setContent(res.data || content);
      setCvFile(null);
      setStatus('CV uploaded and connected to the public download button.');
    } catch (err) {
      console.error(err);
      setError('Could not upload CV. Use a valid PDF under 8MB.');
    }
  }

  const en = content.copy?.en || {};
  const ar = content.copy?.ar || {};
  const services = content.services || [];
  const managedStats = content.stats || [];
  const testimonials = content.testimonials || [];

  return (
    <AdminLayout>
      <div className="admin-content-page">
        <div className="admin-top">
          <div>
            <h1>Site Content</h1>
            <p>Edit hero, about, labels, services, testimonials, footer, and the downloadable CV.</p>
          </div>
          <button className="btn btn-primary" onClick={() => void loadContent()}>Refresh</button>
        </div>

        {loading ? <p>Loading content...</p> : null}
        {status ? <p className="success">{status}</p> : null}
        {error ? <p className="error">{error}</p> : null}

        <form className="admin-content-form" onSubmit={saveContent}>
          <fieldset>
            <legend>Hero</legend>
            <div className="admin-two-col">
              <TextField label="Name EN" value={en.name} onChange={(value) => updateCopy('en', 'name', value)} />
              <TextField label="Name AR" value={ar.name} onChange={(value) => updateCopy('ar', 'name', value)} />
              <TextField label="Status EN" value={en.status} onChange={(value) => updateCopy('en', 'status', value)} />
              <TextField label="Status AR" value={ar.status} onChange={(value) => updateCopy('ar', 'status', value)} />
              <TextArea label="Hero Text EN" value={en.role} onChange={(value) => updateCopy('en', 'role', value)} />
              <TextArea label="Hero Text AR" value={ar.role} onChange={(value) => updateCopy('ar', 'role', value)} />
              <TextField label="Primary Button EN" value={en.viewWork} onChange={(value) => updateCopy('en', 'viewWork', value)} />
              <TextField label="Primary Button AR" value={ar.viewWork} onChange={(value) => updateCopy('ar', 'viewWork', value)} />
              <TextField label="CV Button EN" value={en.downloadCv} onChange={(value) => updateCopy('en', 'downloadCv', value)} />
              <TextField label="CV Button AR" value={ar.downloadCv} onChange={(value) => updateCopy('ar', 'downloadCv', value)} />
              <TextArea label="Marquee EN, one per line" value={lines(en.marquee)} onChange={(value) => updateCopy('en', 'marquee', splitLines(value))} />
              <TextArea label="Marquee AR, one per line" value={lines(ar.marquee)} onChange={(value) => updateCopy('ar', 'marquee', splitLines(value))} />
            </div>
          </fieldset>

          <fieldset>
            <legend>About</legend>
            <div className="admin-two-col">
              <TextField label="About eyebrow EN" value={en.aboutEyebrow} onChange={(value) => updateCopy('en', 'aboutEyebrow', value)} />
              <TextField label="About eyebrow AR" value={ar.aboutEyebrow} onChange={(value) => updateCopy('ar', 'aboutEyebrow', value)} />
              <TextField label="About title EN" value={en.aboutTitle} onChange={(value) => updateCopy('en', 'aboutTitle', value)} />
              <TextField label="About title AR" value={ar.aboutTitle} onChange={(value) => updateCopy('ar', 'aboutTitle', value)} />
              <TextArea label="About paragraphs EN, blank line between paragraphs" value={paragraphs(en.aboutText)} onChange={(value) => updateCopy('en', 'aboutText', splitParagraphs(value))} rows={10} />
              <TextArea label="About paragraphs AR, blank line between paragraphs" value={paragraphs(ar.aboutText)} onChange={(value) => updateCopy('ar', 'aboutText', splitParagraphs(value))} rows={10} />
              <TextField label="Signature role EN" value={en.signatureRole} onChange={(value) => updateCopy('en', 'signatureRole', value)} />
              <TextField label="Signature role AR" value={ar.signatureRole} onChange={(value) => updateCopy('ar', 'signatureRole', value)} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Hero Stats</legend>
            <div className="admin-repeat-list">
              {managedStats.map((item, index) => (
                <article className="admin-repeat-card" key={item.id}>
                  <div className="admin-repeat-head">
                    <strong>Stat {index + 1}</strong>
                    <button type="button" onClick={() => setContent((current) => ({ ...current, stats: managedStats.filter((_, i) => i !== index) }))}>Remove</button>
                  </div>
                  <div className="admin-two-col compact">
                    <TextField label="Label EN" value={item.label.en} onChange={(value) => updateStatLabel(index, 'en', value)} />
                    <TextField label="Label AR" value={item.label.ar} onChange={(value) => updateStatLabel(index, 'ar', value)} />
                    <TextField label="Value" type="number" value={item.value} onChange={(value) => updateStat(index, { value: Number(value || 0) })} />
                    <TextField label="Suffix" value={item.suffix || ''} onChange={(value) => updateStat(index, { suffix: value })} />
                    <TextField label="Order" type="number" value={item.order} onChange={(value) => updateStat(index, { order: Number(value || 0) })} />
                  </div>
                  <label className="admin-check">
                    <input type="checkbox" checked={item.isVisible} onChange={(e) => updateStat(index, { isVisible: e.target.checked })} />
                    Visible
                  </label>
                </article>
              ))}
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => setContent((current) => ({ ...current, stats: [...managedStats, emptyStat()] }))}>Add Stat</button>
          </fieldset>

          <fieldset>
            <legend>Section Titles</legend>
            <div className="admin-two-col compact">
              {[
                ['servicesTitle', 'Services title'],
                ['skillsTitle', 'Skills title'],
                ['experienceTitle', 'Experience title'],
                ['workTitle', 'Work title'],
                ['educationTitle', 'Education title'],
                ['testimonialsTitle', 'Testimonials title'],
                ['contactTitle', 'Contact title'],
                ['footer', 'Footer'],
              ].map(([key, label]) => (
                <div className="admin-pair" key={key}>
                  <TextField label={`${label} EN`} value={en[key]} onChange={(value) => updateCopy('en', key, value)} />
                  <TextField label={`${label} AR`} value={ar[key]} onChange={(value) => updateCopy('ar', key, value)} />
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Services</legend>
            <div className="admin-repeat-list">
              {services.map((service, index) => (
                <article className="admin-repeat-card" key={service.id}>
                  <div className="admin-repeat-head">
                    <strong>Service {index + 1}</strong>
                    <button type="button" onClick={() => setContent((current) => ({ ...current, services: services.filter((_, i) => i !== index) }))}>Remove</button>
                  </div>
                  <div className="admin-two-col compact">
                    <TextField label="Title EN" value={service.title.en} onChange={(value) => updateServiceText(index, 'title', 'en', value)} />
                    <TextField label="Title AR" value={service.title.ar} onChange={(value) => updateServiceText(index, 'title', 'ar', value)} />
                    <TextArea label="Description EN" value={service.description.en} onChange={(value) => updateServiceText(index, 'description', 'en', value)} />
                    <TextArea label="Description AR" value={service.description.ar} onChange={(value) => updateServiceText(index, 'description', 'ar', value)} />
                    <TextField label="Icon key" value={service.icon} onChange={(value) => updateService(index, { icon: value })} />
                    <TextField label="Order" type="number" value={service.order} onChange={(value) => updateService(index, { order: Number(value || 0) })} />
                  </div>
                  <label className="admin-check">
                    <input type="checkbox" checked={service.isVisible} onChange={(e) => updateService(index, { isVisible: e.target.checked })} />
                    Visible
                  </label>
                </article>
              ))}
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => setContent((current) => ({ ...current, services: [...services, emptyService()] }))}>Add Service</button>
          </fieldset>

          <fieldset>
            <legend>Testimonials</legend>
            <div className="admin-repeat-list">
              {testimonials.map((item, index) => (
                <article className="admin-repeat-card" key={item.id}>
                  <div className="admin-repeat-head">
                    <strong>Testimonial {index + 1}</strong>
                    <button type="button" onClick={() => setContent((current) => ({ ...current, testimonials: testimonials.filter((_, i) => i !== index) }))}>Remove</button>
                  </div>
                  <div className="admin-two-col compact">
                    <TextField label="Client EN" value={item.clientName.en} onChange={(value) => updateTestimonialText(index, 'clientName', 'en', value)} />
                    <TextField label="Client AR" value={item.clientName.ar} onChange={(value) => updateTestimonialText(index, 'clientName', 'ar', value)} />
                    <TextField label="Role EN" value={item.clientRole.en} onChange={(value) => updateTestimonialText(index, 'clientRole', 'en', value)} />
                    <TextField label="Role AR" value={item.clientRole.ar} onChange={(value) => updateTestimonialText(index, 'clientRole', 'ar', value)} />
                    <TextField label="Company EN" value={item.clientCompany.en} onChange={(value) => updateTestimonialText(index, 'clientCompany', 'en', value)} />
                    <TextField label="Company AR" value={item.clientCompany.ar} onChange={(value) => updateTestimonialText(index, 'clientCompany', 'ar', value)} />
                    <TextArea label="Quote EN" value={item.text.en} onChange={(value) => updateTestimonialText(index, 'text', 'en', value)} />
                    <TextArea label="Quote AR" value={item.text.ar} onChange={(value) => updateTestimonialText(index, 'text', 'ar', value)} />
                    <TextField label="Rating" type="number" value={item.rating} onChange={(value) => updateTestimonial(index, { rating: Number(value || 5) })} />
                    <TextField label="Order" type="number" value={item.order} onChange={(value) => updateTestimonial(index, { order: Number(value || 0) })} />
                  </div>
                  <label className="admin-check">
                    <input type="checkbox" checked={item.isVisible} onChange={(e) => updateTestimonial(index, { isVisible: e.target.checked })} />
                    Visible
                  </label>
                </article>
              ))}
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => setContent((current) => ({ ...current, testimonials: [...testimonials, emptyTestimonial()] }))}>Add Testimonial</button>
          </fieldset>

          <div className="admin-sticky-actions">
            <button className="btn btn-primary">Save Site Content</button>
          </div>
        </form>

        <section className="admin-content-form cv-panel">
          <fieldset>
            <legend>CV File</legend>
            <p>Current CV: {content.cv?.fileName || 'cv.pdf'}</p>
            {content.cv?.url ? (
              <a className="btn btn-secondary" href={resolveManagedAssetUrl(content.cv.url)} target="_blank" rel="noreferrer">
                Preview Current CV
              </a>
            ) : null}
            <input type="file" accept="application/pdf" onChange={(event: ChangeEvent<HTMLInputElement>) => setCvFile(event.target.files?.[0] || null)} />
            <button className="btn btn-primary" type="button" disabled={!cvFile} onClick={() => void uploadCv()}>
              Upload New CV
            </button>
          </fieldset>
        </section>
      </div>
    </AdminLayout>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: unknown;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label>
      <span>{label}</span>
      <input type={type} value={String(value || '')} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: unknown;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label>
      <span>{label}</span>
      <textarea rows={rows} value={String(value || '')} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
