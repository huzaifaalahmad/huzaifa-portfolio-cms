import { FormEvent, useState } from 'react';
import {
  Mail,
  MessageCircle,
  Palette,
  Send,
  Code2,
} from 'lucide-react';
import { contactApi } from '@/services/api/contactApi';
import { useLanguage } from '@/context/LanguageContext';
import { socialLinks } from '@/data/socialLinks';

function SocialIcon({ platform }: { platform: string }) {
  const name = platform.toLowerCase();

  if (name.includes('github')) return <Code2 size={18} />;
  if (name.includes('linkedin')) return <span className="social-letter">in</span>;
  if (name.includes('behance')) return <Palette size={18} />;
  if (name.includes('whatsapp')) return <MessageCircle size={18} />;
  if (name.includes('email')) return <Mail size={18} />;

  return <MessageCircle size={18} />;
}

export default function Contact() {
  const { language } = useLanguage();
  const [status, setStatus] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    setStatus('sending');

    try {
      await contactApi.send({
        name: String(form.get('name')),
        email: String(form.get('email')),
        phone: String(form.get('phone') || ''),
        subject: String(form.get('subject')),
        message: String(form.get('message')),
        preferredLanguage: language,
      });

      setStatus('success');
      e.currentTarget.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="contact-grid">
        <div className="contact-panel">
          <span className="eyebrow">08 / Contact</span>

          <h2>
            {language === 'ar'
              ? 'لنبنِ شيئاً واضحاً ومفيداً'
              : 'Let’s build something clear and useful'}
          </h2>

          <p>
            {language === 'ar'
              ? 'إذا كنت مدير توظيف أو صاحب مشروع، أرسل لي فكرة مختصرة وسأرد عليك بخطوة عملية واضحة.'
              : 'If you are a hiring manager or client, send me a clear brief and I will reply with a practical next step.'}
          </p>

          <div className="contact-socials">
            {socialLinks
              .filter((link) => link.isVisible)
              .sort((a, b) => a.order - b.order)
              .map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noreferrer">
                  <SocialIcon platform={link.platform} />
                  <span>{link.platform}</span>
                </a>
              ))}
          </div>
        </div>

        <form className="contact-form contact-panel" onSubmit={submit}>
          <div className="form-row">
            <input name="name" placeholder={language === 'ar' ? 'الاسم' : 'Name'} required />
            <input name="email" type="email" placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'} required />
          </div>

          <input name="phone" placeholder={language === 'ar' ? 'الهاتف (اختياري)' : 'Phone (optional)'} />
          <input name="subject" placeholder={language === 'ar' ? 'الموضوع' : 'Subject'} required />
          <textarea name="message" placeholder={language === 'ar' ? 'اكتب رسالتك' : 'Message'} rows={5} required />

          <button className="btn btn-primary">
            <Send size={17} />
            {status === 'sending'
              ? language === 'ar'
                ? 'جارٍ الإرسال...'
                : 'Sending...'
              : language === 'ar'
                ? 'إرسال الرسالة'
                : 'Send Message'}
          </button>

          {status === 'success' && (
            <p className="success">
              {language === 'ar' ? 'تم إرسال الرسالة بنجاح.' : 'Message sent successfully.'}
            </p>
          )}

          {status === 'error' && (
            <p className="error">
              {language === 'ar' ? 'تعذر إرسال الرسالة.' : 'Could not send message.'}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}