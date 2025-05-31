import api from './api';
import { User } from '../types/user';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const userService = {
  getAllUsers: async (page: number, size: number) => {
    const response = await api.get<ApiResponse<Page<User>>>(`/users?page=${page}&size=${size}`);
    return response.data.data;
  },

  getUserByUsername: async (username: string) => {
    const response = await api.get<ApiResponse<User>>(`/users/${username}`);
    return response.data.data;
  },

  updateUser: async (username: string, userData: Partial<User>) => {
    const response = await api.put<ApiResponse<User>>(`/users/${username}`, userData);
    return response.data.data;
  },

  updateUserRoles: async (username: string, roles: string[]) => {
    const response = await api.put<ApiResponse<User>>(`/users/${username}/roles`, { roles });
    return response.data.data;
  },

  deleteUser: async (username: string) => {
    const response = await api.delete<ApiResponse<void>>(`/users/${username}`);
    return response.data.data;
  },

  searchUsers: async (keyword: string) => {
    const response = await api.get<ApiResponse<User[]>>(`/users/search?keyword=${keyword}`);
    return response.data.data;
  },

  sendEmail: async (email: string, subject: string, text: string) => {
    const response = await api.post<ApiResponse<void>>(`/users/send-email`, {
      email,
      subject,
      text,
    });
    return response.data.data;
  },

  createUser: async (userData: { username: string; password: string; email: string; name: string; roles: string[] }) => {
    const response = await api.post<ApiResponse<User>>('/users', userData);
    return response.data.data;
  },
}; 