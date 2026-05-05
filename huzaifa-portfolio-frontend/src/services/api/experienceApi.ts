import { apiClient } from './client';

export const experienceApi = {
  async getAll() {
    const res = await apiClient.get('/experience');
    return res.data;
  },

  async create(data: any) {
    const res = await apiClient.post('/experience', data);
    return res.data;
  },

  async delete(id: string) {
    const res = await apiClient.delete(`/experience/${id}`);
    return res.data;
  },
};