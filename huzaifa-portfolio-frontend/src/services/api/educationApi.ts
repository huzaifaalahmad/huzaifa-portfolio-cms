import { apiClient } from './client';

export const educationApi = {
  async getAll() {
    const res = await apiClient.get('/education');
    return res.data;
  },

  async createEducation(data: any) {
    const res = await apiClient.post('/education', data);
    return res.data;
  },

  async createCertification(data: any) {
    const res = await apiClient.post('/education/certifications', data);
    return res.data;
  },

  async updateEducation(id: string, data: any) {
    const res = await apiClient.patch(`/education/${id}`, data);
    return res.data;
  },

  async updateCertification(id: string, data: any) {
    const res = await apiClient.patch(`/education/certifications/${id}`, data);
    return res.data;
  },

  async deleteEducation(id: string) {
    const res = await apiClient.delete(`/education/${id}`);
    return res.data;
  },

  async deleteCertification(id: string) {
    const res = await apiClient.delete(`/education/certifications/${id}`);
    return res.data;
  },
};
