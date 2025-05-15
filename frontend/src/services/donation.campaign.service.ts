import api from './api';
import { DonationCampaignRequest } from '../types/donationCampaign';

const donationCampaignService = {
  getAll: async (page: number = 0, size: number = 10, keyword?: string) => {
    const params: any = { page, size };
    if (keyword) params.keyword = keyword;
    const response = await api.get(`/donation-campaigns`, { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/donation-campaigns/${id}`);
    return response.data;
  },

  create: async (data: DonationCampaignRequest) => {
    const response = await api.post(`/donation-campaigns`, data);
    return response.data;
  },

  update: async (id: number, data: DonationCampaignRequest) => {
    const response = await api.put(`/donation-campaigns/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/donation-campaigns/${id}`);
    return response.data;
  },

  getActive: async () => {
    const response = await api.get(`/donation-campaigns/active`);
    return response.data;
  }
};

export default donationCampaignService; 