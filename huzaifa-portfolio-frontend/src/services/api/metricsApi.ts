import { apiClient } from './client';

export const metricsApi = {
  async recordVisit() {
    const res = await apiClient.post('/metrics/visit');
    return res.data;
  },

  async recordCvDownload() {
    const res = await apiClient.post('/metrics/cv-download');
    return res.data;
  },

  async summary() {
    const res = await apiClient.get('/metrics/summary');
    return res.data;
  },
};
