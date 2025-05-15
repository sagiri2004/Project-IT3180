import api from './api';
import { Resident, CreateResidentRequest, UpdateResidentRequest } from '../types/resident';

export interface ResidentPage {
  content: Resident[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const residentService = {
  getAll: async (params: { page: number; size: number; keyword?: string }): Promise<ResidentPage> => {
    const response = await api.get('/residents', { params });
    return response.data.data;
  },

  getById: async (id: number): Promise<Resident> => {
    const response = await api.get<Resident>(`/residents/${id}`);
    return response.data;
  },

  getByHouseholdId: async (householdId: number): Promise<Resident[]> => {
    const response = await api.get<Resident[]>(`/residents/household/${householdId}`);
    return response.data;
  },

  create: async (data: CreateResidentRequest): Promise<Resident> => {
    const response = await api.post<Resident>('/residents', data);
    return response.data;
  },

  update: async (data: UpdateResidentRequest): Promise<Resident> => {
    const response = await api.put<Resident>(`/residents/${data.id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/residents/${id}`);
  },
}; 