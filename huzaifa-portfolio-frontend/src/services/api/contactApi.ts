import { ContactFormData } from '@/types';
import { apiClient } from './client';
export const contactApi={ async send(data:ContactFormData){await apiClient.get('/health').catch(()=>null); const res=await apiClient.post('/contact',data); return res.data}, async list(){const res=await apiClient.get('/contact'); return res.data}, async markRead(id:string){const res=await apiClient.patch(`/contact/${id}/read`); return res.data} };
