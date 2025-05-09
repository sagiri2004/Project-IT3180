import api from './api';
import { PopulationChangeRequest, PopulationChangeResponse } from '../types/populationChange';

export const populationChangeService = {
  getAll: async (page = 0, size = 10, isApproved?: boolean) => {
    const params: any = { page, size };
    if (typeof isApproved === 'boolean') params.isApproved = isApproved;
    const res = await api.get('/population-changes', { params });
    return {
      data: res.data?.data?.content || [],
      total: res.data?.data?.totalElements || 0,
    };
  },
  getById: async (id: number) => {
    const res = await api.get(`/population-changes/${id}`);
    return res.data?.data;
  },
  create: async (data: PopulationChangeRequest) => {
    const res = await api.post('/population-changes', data);
    return res.data?.data;
  },
  approve: async (id: number) => {
    const res = await api.post(`/population-changes/${id}/approve`);
    return res.data?.data;
  },
  reject: async (id: number) => {
    const res = await api.post(`/population-changes/${id}/reject`);
    return res.data?.data;
  },
  delete: async (id: number) => {
    const res = await api.delete(`/population-changes/${id}`);
    return res.data?.data;
  },
}; 