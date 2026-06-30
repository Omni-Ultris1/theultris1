import apiClient from './client';
import type { ApiResponse, Tool } from '../types';

export const toolsApi = {
  getAll: async (category?: string) => {
    const params = category ? { category } : {};
    const res = await apiClient.get<ApiResponse<{ tools: Tool[] }>>('/tools', { params });
    return res.data;
  },

  getBySlug: async (slug: string) => {
    const res = await apiClient.get<ApiResponse<{ tool: Tool }>>(`/tools/${slug}`);
    return res.data;
  },
};
