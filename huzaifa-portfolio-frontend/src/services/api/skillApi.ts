import { apiClient } from './client';

export const skillApi = {
  async getAll() {
    const res = await apiClient.get('/skills');
    return res.data;
  },

  async create(data: any) {
    const res = await apiClient.post('/skills', data);
    return res.data;
  },

  async delete(id: string) {
    const res = await apiClient.delete(`/skills/${id}`);
    return res.data;
  },
};