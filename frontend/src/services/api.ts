import axios from 'axios';
import type { ContentJob } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  async submitUrl(
    url: string,
    options?: { niche?: string; tone?: string; targetAudience?: string }
  ): Promise<{ jobId: string }> {
    const { data } = await axios.post(`${API_BASE}/url`, { url, ...options });
    return data;
  },

  async submitFile(
    file: File,
    options?: { niche?: string; tone?: string; targetAudience?: string }
  ): Promise<{ jobId: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (options?.niche) formData.append('niche', options.niche);
    if (options?.tone) formData.append('tone', options.tone);
    if (options?.targetAudience) formData.append('targetAudience', options.targetAudience);
    const { data } = await axios.post(`${API_BASE}/file`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  async getJob(jobId: string): Promise<ContentJob> {
    const { data } = await axios.get(`${API_BASE}/jobs/${jobId}`);
    return data;
  }
};
