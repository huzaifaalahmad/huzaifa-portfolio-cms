import { apiClient } from './client';

export type SiteContentCopy = Record<string, any>;

export type ManagedService = {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  isVisible: boolean;
  order: number;
};

export type ManagedTestimonial = {
  id: string;
  clientName: { en: string; ar: string };
  clientRole: { en: string; ar: string };
  clientCompany: { en: string; ar: string };
  text: { en: string; ar: string };
  rating: number;
  isVisible: boolean;
  order: number;
};

export type ManagedStat = {
  id: string;
  label: { en: string; ar: string };
  value: number;
  suffix?: string;
  isVisible: boolean;
  order: number;
};

export type SiteContent = {
  copy?: {
    en?: SiteContentCopy;
    ar?: SiteContentCopy;
  };
  cv?: {
    url?: string;
    fileName?: string;
    uploadedAt?: string | null;
  };
  stats?: ManagedStat[];
  services?: ManagedService[];
  testimonials?: ManagedTestimonial[];
};

export function resolveManagedAssetUrl(url?: string) {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/i.test(url)) return url;

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
  const origin = baseUrl.replace(/\/api\/v\d+\/?$/, '').replace(/\/$/, '');

  return url.startsWith('/uploads/') ? `${origin}${url}` : url;
}

export const siteContentApi = {
  async getPublic() {
    const res = await apiClient.get('/site-content');
    return res.data;
  },

  async update(data: SiteContent) {
    const res = await apiClient.patch('/site-content', data);
    return res.data;
  },

  async uploadCv(data: { fileName: string; mimeType: string; data: string }) {
    const res = await apiClient.post('/site-content/cv', data);
    return res.data;
  },
};
