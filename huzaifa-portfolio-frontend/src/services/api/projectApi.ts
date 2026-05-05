import { apiClient } from './client';

export const projectApi = {
  async list() {
    const res = await apiClient.get('/projects');
    return res.data;
  },

  async create(data: {
    title: string;
    slug: string;
    category: string;
    description: string;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
    imageUrl?: string;
    isFeatured?: boolean;
    isVisible?: boolean;
    order?: number;
  }) {
    const res = await apiClient.post('/projects', data);
    return res.data;
  },

  async remove(id: string) {
    const res = await apiClient.delete(`/projects/${id}`);
    return res.data;
  },
};