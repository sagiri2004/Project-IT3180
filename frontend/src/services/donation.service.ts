import api from './api';
import { DonationRequest, DonationResponse } from '../types/donation';

const donationService = {
  getAll: async (page: number = 0, size: number = 10, keyword?: string) => {
    const params: any = { page, size };
    if (keyword) params.keyword = keyword;
    const response = await api.get(`/donations`, { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  },

  create: async (data: DonationRequest) => {
    const response = await api.post(`/donations`, data);
    return response.data;
  },

  update: async (id: number, data: DonationRequest) => {
    const response = await api.put(`/donations/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/donations/${id}`);
    return response.data;
  },

  getByHousehold: async (householdId: number) => {
    const response = await api.get(`/donations/household/${householdId}`);
    return response.data;
  },

  getByCampaign: async (campaignId: number) => {
    const response = await api.get(`/donations/campaign/${campaignId}`);
    return response.data;
  }
};

export default donationService; 