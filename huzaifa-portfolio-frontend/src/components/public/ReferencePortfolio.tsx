import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Award,
  Briefcase,
  Code2,
  Download,
  GraduationCap,
  Layers3,
  Mail,
  MapPin,
  Palette,
  PenTool,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react';
import { profile } from '@/data/profile';
import { services } from '@/data/services';
import { socialLinks } from '@/data/socialLinks';
import { stats } from '@/data/stats';
import { projects as fallbackProjects } from '@/data/projects';
import { skills as fallbackSkills } from '@/data/skills';
import { experiences as fallbackExperiences } from '@/data/experience';
import {
  certifications as fallbackCertifications,
  education as fallbackEducation,
} from '@/data/education';
import { contactApi } from '@/services/api/contactApi';
import { educationApi } from '@/services/api/educationApi';
import { experienceApi } from '@/services/api/experienceApi';
import { metricsApi } from '@/services/api/metricsApi';
import { projectApi } from '@/services/api/projectApi';
import { skillApi } from '@/services/api/skillApi';

type ProjectItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
};

type SkillItem = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience: number;
};

type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description: string;
  technologies: string[];
};

type EducationItem = {
  id: string;
  degree: string;
  institution: string;
  field: string;
  startDate?: string;
  endDate?: string;
};

type CertificationItem = {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
};

type Envelope<T> = {
  data?: T;
};

const skillLabels: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  ai: 'AI & Prompting',
  database: 'Databases',
  design: 'Design',
  automation: 'Automation',
};

function text(value: unknown, fallback = '') {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'en' in value) {
    return String((value as { en?: string }).en || fallback);
  }
  return fallback;
}

function envelopeData<T>(payload: unknown, fallback: T): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return ((payload as Envelope<T>).data || fallback) as T;
  }
  return fallback;
}

function arrayData<T>(payload: unknown, fallback: T[]): T[] {
  const data = envelopeData<unknown>(payload, fallback);
  return Array.isArray(data) ? (data as T[]) : fallback;
}

function normalizeProject(item: any): ProjectItem {
  return {
    id: String(item.id),
    title: text(item.title),
    slug: String(item.slug || item.id),
    category: String(item.category || 'Work'),
    description: String(item.description || text(item.shortDescription) || text(item.fullDescription)),
    technologies: Array.isArray(item.technologies) ? item.technologies.map(String) : [],
    imageUrl: item.imageUrl ? String(item.imageUrl) : undefined,
    liveUrl: item.liveUrl ? String(item.liveUrl) : undefined,
  };
}

function normalizeSkill(item: any): SkillItem {
  return {
    id: String(item.id),
    name: text(item.name),
    category: String(item.category || 'design'),
    proficiency: Number(item.proficiency || 70),
    yearsOfExperience: Number(item.yearsOfExperience || 1),
  };
}

function normalizeExperience(item: any): ExperienceItem {
  return {
    id: String(item.id),
    company: text(item.company),
    role: text(item.role),
    location: text(item.location),
    startDate: String(item.startDate || ''),
    endDate: item.endDate ? String(item.endDate) : undefined,
    isCurrent: Boolean(item.isCurrent),
    description: text(item.description),
    technologies: Array.isArray(item.technologies) ? item.technologies.map(String) : [],
  };
}

function normalizeEducation(item: any): EducationItem {
  return {
    id: String(item.id),
    degree: text(item.degree),
    institution: text(item.institution),
    field: text(item.field),
    startDate: item.startDate ? String(item.startDate) : undefined,
    endDate: item.endDate ? String(item.endDate) : undefined,
  };
}

function normalizeCertification(item: any): CertificationItem {
  return {
    id: String(item.id),
    name: text(item.name),
    issuer: text(item.issuer),
    issueDate: String(item.issueDate || ''),
  };
}

function ServiceIcon({ icon }: { icon: string }) {
  if (icon === 'code') return <Code2 size={24} />;
  if (icon === 'pen') return <PenTool size={24} />;
  if (icon === 'spark') return <Sparkles size={24} />;
  return <Layers3 size={24} />;
}

export default function ReferencePortfolio() {
  const [projects, setProjects] = useState<ProjectItem[]>(fallbackProjects.map(normalizeProject));
  const [skills, setSkills] = useState<SkillItem[]>(fallbackSkills.map(normalizeSkill));
  const [experiences, setExperiences] = useState<ExperienceItem[]>(
    fallbackExperiences.map(normalizeExperience)
  );
  const [education, setEducation] = useState<EducationItem[]>(
    fallbackEducation.map(normalizeEducation)
  );
  const [certifications, setCertifications] = useState<CertificationItem[]>(
    fallbackCertifications.map(normalizeCertification)
  );
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function loadCmsContent() {
      const [projectRes, skillRes, experienceRes, educationRes] = await Promise.allSettled([
        projectApi.list(),
        skillApi.getAll(),
        experienceApi.getAll(),
        educationApi.getAll(),
      ]);

      if (projectRes.status === 'fulfilled') {
        const rows = arrayData<any>(projectRes.value, []);
        if (rows.length) setProjects(rows.map(normalizeProject));
      }

      if (skillRes.status === 'fulfilled') {
        const rows = arrayData<any>(skillRes.value, []);
        if (rows.length) setSkills(rows.map(normalizeSkill));
      }

      if (experienceRes.status === 'fulfilled') {
        const rows = arrayData<any>(experienceRes.value, []);
        if (rows.length) setExperiences(rows.map(normalizeExperience));
      }

      if (educationRes.status === 'fulfilled') {
        const data = envelopeData<{ education?: any[]; certifications?: any[] }>(educationRes.value, {});
        if (data.education?.length) setEducation(data.education.map(normalizeEducation));
        if (data.certifications?.length) {
          setCertifications(data.certifications.map(normalizeCertification));
        }
      }
    }

    void loadCmsContent();
  }, []);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem('huzaifa-visit-recorded')) {
        sessionStorage.setItem('huzaifa-visit-recorded', 'true');
        void metricsApi.recordVisit().catch(() => undefined);
      }
    } catch {
      void metricsApi.recordVisit().catch(() => undefined);
    }
  }, []);

  const skillGroups = useMemo(() => {
    return Object.entries(
      skills.reduce<Record<string, SkillItem[]>>((acc, skill) => {
        acc[skill.category] = acc[skill.category] || [];
        acc[skill.category].push(skill);
        return acc;
      }, {})
    );
  }, [skills]);

  function recordCvDownload() {
    void metricsApi.recordCvDownload().catch(() => undefined);
  }

  async function submitContact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setContactStatus('sending');

    try {
      await contactApi.send({
        name: String(data.get('name')),
        email: String(data.get('email')),
        phone: String(data.get('phone') || ''),
        subject: String(data.get('subject')),
        message: String(data.get('message')),
        preferredLanguage: 'en',
      });
      setContactStatus('success');
      form.reset();
    } catch {
      setContactStatus('error');
    }
  }

  return (
    <div className="ref-site">
      <nav className="ref-nav" aria-label="Main navigation">
        <a className="nb" href="#hero" aria-label="Huzaifa Alahmad home">
          <img src="/assets/images/logo.png" alt="" />
          <span>Huzaifa</span>
        </a>
        <div className="nl">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#skills">Skills</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="n-cta" href="#contact">Start a Project</a>
      </nav>

      <section id="hero" className="hero-ref">
        <div className="hero-grid" />
        <div className="hero-in">
          <span className="av-tag">
            <span className="av-dot" />
            Available for freelance and full-time roles
          </span>

          <div className="hero-logo-wrap" aria-hidden="true">
            <div className="hero-logo-ring" />
            <div className="hero-logo-ring2" />
            <img className="hero-logo-img" src="/assets/images/logo.png" alt="" />
          </div>

          <h1 className="hero-name">Huzaifa Alahmad</h1>
          <p className="hero-role">
            Graphic Designer, Brand Identity Specialist, AI Prompt Engineer, and full-stack
            builder creating sharp digital systems from Dubai.
          </p>

          <div className="hero-ctas">
            <a className="btn-g" href="#work">View Work</a>
            <a className="btn-o" href={profile.cvUrl} download onClick={recordCvDownload}>
              <Download size={17} />
              Download CV
            </a>
          </div>

          <div className="hero-stats">
            {stats.slice(0, 3).map((item) => (
              <div className="hstat" key={item.id}>
                <span className="hstat-n">
                  {item.value}
                  {item.suffix}
                </span>
                <span className="hstat-l">{text(item.label)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mq-wrap" aria-hidden="true">
        <div className="mq-track">
          {['Brand Identity', 'Graphic Design', 'AI Workflows', 'React', 'Node.js', 'Visual Systems']
            .concat(['Brand Identity', 'Graphic Design', 'AI Workflows', 'React', 'Node.js', 'Visual Systems'])
            .map((label, index) => (
              <span className="mq-item" key={`${label}-${index}`}>
                {label}
                <i className="mq-dot" />
              </span>
            ))}
        </div>
      </div>

      <section id="about" className="ref-section about-grid">
        <div className="about-img-col">
          <div className="about-svg">
            <img src="/assets/images/logo.png" alt="Huzaifa logo" />
          </div>
          <div className="about-stats-row">
            {stats.slice(0, 2).map((item) => (
              <div className="astat" key={item.id}>
                <span className="astat-n">
                  {item.value}
                  {item.suffix}
                </span>
                <span className="astat-l">{text(item.label)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="letter-body">
          <span className="sl-tag">01 / About</span>
          <h2 className="letter-head">Designer Who Speaks Both Design & Code</h2>
          <p>
            I create brand systems, web interfaces, and automation-ready digital products. My
            work combines visual polish with practical engineering so every section of this site
            can be managed, measured, and improved.
          </p>
          <p>
            The portfolio is now connected to a real admin dashboard, protected by owner-only
            access, and backed by counters for visits and CV downloads.
          </p>
          <div className="letter-sign">
            <span className="ls-name">Huzaifa Alahmad</span>
            <span className="ls-role">Graphic Designer & Full-Stack Builder</span>
          </div>
        </div>
      </section>

      <section id="services" className="ref-section">
        <SectionTitle eyebrow="02 / Services" title="Services & Expertise" />
        <div className="svc-grid">
          {services
            .filter((service) => service.isVisible)
            .sort((a, b) => a.order - b.order)
            .map((service, index) => (
              <article className="svc-card" key={service.id}>
                <span className="svc-n">{String(index + 1).padStart(2, '0')}</span>
                <span className="svc-ico">
                  <ServiceIcon icon={service.icon} />
                </span>
                <h3 className="svc-name">{text(service.title)}</h3>
                <p className="svc-desc">{text(service.description)}</p>
                <span className="svc-arr">
                  <ArrowUpRight size={18} />
                </span>
              </article>
            ))}
        </div>
      </section>

      <section id="skills" className="ref-section">
        <SectionTitle eyebrow="03 / Skills" title="Tools & Proficiency" />
        <div className="sk-grid">
          <div className="sk-bars">
            {skills.slice(0, 8).map((skill) => (
              <div className="sk-item" key={skill.id}>
                <div className="sk-meta">
                  <span className="sk-nm">{skill.name}</span>
                  <span className="sk-pc">{skill.proficiency}%</span>
                </div>
                <div className="sk-track">
                  <span className="sk-fill" style={{ width: `${skill.proficiency}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="chips">
            {skillGroups.map(([category, items]) => (
              <span className="chip" key={category}>
                {skillLabels[category] || category}
                <b>{items.length}</b>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="ref-section">
        <SectionTitle eyebrow="04 / Experience" title="Professional Experience" />
        <div className="tl">
          {experiences.map((item) => (
            <article className="tl-it" key={item.id}>
              <span className="tn">
                <Briefcase size={18} />
              </span>
              <div className="tl-hd">
                <h3 className="tl-title">{item.role}</h3>
                <span className="tl-date">
                  {item.startDate} - {item.isCurrent ? 'Present' : item.endDate || 'Recent'}
                </span>
              </div>
              <p className="tl-co">
                {item.company} / {item.location}
              </p>
              <p className="tl-desc">{item.description}</p>
              <div className="tl-tags">
                {item.technologies.map((tech) => (
                  <span className="tl-tag" key={tech}>{tech}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="work" className="ref-section">
        <div className="work-hdr">
          <SectionTitle eyebrow="05 / Work" title="Selected Work" />
          <span className="upload-note">Managed from the private admin dashboard</span>
        </div>
        <div className="work-grid">
          {projects.slice(0, 6).map((project, index) => (
            <article className={`wc ${index === 0 ? 'big' : ''}`} key={project.id}>
              {project.imageUrl ? <img src={project.imageUrl} alt="" /> : null}
              <div className="wc-in">
                <span className="wc-ico">
                  <Palette size={20} />
                </span>
                <span className="wc-lbl">{project.category}</span>
                <h3>{project.title}</h3>
                <p className="wc-sub">{project.description}</p>
                <div className="tl-tags">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span className="tl-tag" key={tech}>{tech}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="education" className="ref-section">
        <SectionTitle eyebrow="06 / Education" title="Education & Certifications" />
        <div className="edu-grid">
          {education.map((item) => (
            <article className="edu-c" key={item.id}>
              <span className="edu-ico">
                <GraduationCap size={22} />
              </span>
              <h3 className="edu-deg">{item.degree}</h3>
              <p className="edu-inst">{item.institution}</p>
              <span className="edu-yr">
                {item.field}
                {item.startDate ? ` / ${item.startDate}${item.endDate ? ` - ${item.endDate}` : ''}` : ''}
              </span>
            </article>
          ))}
        </div>
        <div className="cert-grid">
          {certifications.map((item) => (
            <article className="cert-it" key={item.id}>
              <span className="cert-ico">
                <Award size={18} />
              </span>
              <div>
                <strong>{item.name}</strong>
                <span>{item.issuer} / {item.issueDate}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="ref-section ct-grid">
        <div className="ct-cards">
          <SectionTitle eyebrow="07 / Contact" title="Let's Work Together" />
          <ContactCard icon={<Mail size={19} />} label="Email" value={profile.email} href={`mailto:${profile.email}`} />
          <ContactCard icon={<Phone size={19} />} label="Phone" value={profile.phone} href={`tel:${profile.phone}`} />
          <ContactCard icon={<MapPin size={19} />} label="Location" value={text(profile.location)} />
          <div className="social-row">
            {socialLinks
              .filter((link) => link.isVisible)
              .sort((a, b) => a.order - b.order)
              .map((link) => (
                <a href={link.url} key={link.id} target="_blank" rel="noreferrer">
                  {link.platform}
                </a>
              ))}
          </div>
        </div>

        <form className="rp-wrap contact-ref-form" onSubmit={submitContact}>
          <span className="rp-ring" aria-hidden="true" />
          <img className="rp-logo" src="/assets/images/logo.png" alt="" />
          <input name="name" placeholder="Name" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="phone" placeholder="Phone" />
          <input name="subject" placeholder="Subject" required />
          <textarea name="message" rows={4} placeholder="Message" required />
          <button className="btn-g" disabled={contactStatus === 'sending'}>
            <Send size={17} />
            {contactStatus === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
          {contactStatus === 'success' ? <p className="success">Message sent successfully.</p> : null}
          {contactStatus === 'error' ? <p className="error">Could not send message.</p> : null}
        </form>
      </section>

      <footer className="ref-footer">
        <span className="f-logo">Huzaifa Alahmad</span>
        <span>Graphic Design / Brand Identity / Full-Stack Systems</span>
      </footer>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="st">
      <span className="ssub">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="ct-ico">{icon}</span>
      <span className="ct-lbl">{label}</span>
      <strong className="ct-val">{value}</strong>
    </>
  );

  if (href) {
    return (
      <a className="ct-card" href={href}>
        {content}
      </a>
    );
  }

  return <div className="ct-card">{content}</div>;
}
