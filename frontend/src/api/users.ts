import apiClient from './client';
import type { ApiResponse, User } from '../types';

interface UpdateProfileData {
  profile?: {
    displayName?: string;
    bio?: string;
  };
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const usersApi = {
  getProfile: async () => {
    const res = await apiClient.get<ApiResponse<{ user: User }>>('/users/profile');
    return res.data;
  },

  updateProfile: async (data: UpdateProfileData) => {
    const res = await apiClient.patch<ApiResponse<{ user: User }>>('/users/profile', data);
    return res.data;
  },

  changePassword: async (data: ChangePasswordData) => {
    const res = await apiClient.post<ApiResponse>('/users/change-password', data);
    return res.data;
  },
};
