import api from './api';
import { UtilityBill, UtilityBillRequest, UtilityBillResponse, UtilityBillListResponse } from '../types/utilityBill';
import { ApiResponse } from '../types/common';

export const utilityBillService = {
  createUtilityBill: async (data: UtilityBillRequest): Promise<UtilityBillResponse> => {
    const response = await api.post<ApiResponse<UtilityBillResponse>>('/utility-bills', data);
    return response.data.data;
  },

  updateUtilityBill: async (id: number, data: UtilityBillRequest): Promise<UtilityBillResponse> => {
    const response = await api.put<ApiResponse<UtilityBillResponse>>(`/utility-bills/${id}`, data);
    return response.data.data;
  },

  deleteUtilityBill: async (id: number): Promise<void> => {
    await api.delete(`/utility-bills/${id}`);
  },

  getUtilityBill: async (id: number): Promise<UtilityBillResponse> => {
    const response = await api.get<ApiResponse<UtilityBillResponse>>(`/utility-bills/${id}`);
    return response.data.data;
  },

  getUtilityBills: async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    direction: 'asc' | 'desc' = 'desc'
  ): Promise<UtilityBillListResponse> => {
    const response = await api.get<ApiResponse<UtilityBillListResponse>>(
      `/utility-bills?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    );
    return response.data.data;
  },

  getUtilityBillsByHousehold: async (
    householdId: number,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    direction: 'asc' | 'desc' = 'desc'
  ): Promise<UtilityBillListResponse> => {
    const response = await api.get<ApiResponse<UtilityBillListResponse>>(
      `/utility-bills/household/${householdId}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    );
    return response.data.data;
  },

  getUtilityBillsByHouseholdAndMonth: async (
    householdId: number,
    monthYear: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    direction: 'asc' | 'desc' = 'desc'
  ): Promise<UtilityBillListResponse> => {
    const response = await api.get<ApiResponse<UtilityBillListResponse>>(
      `/utility-bills/household/${householdId}/month/${monthYear}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    );
    return response.data.data;
  },

  markAsPaid: async (id: number): Promise<UtilityBillResponse> => {
    const response = await api.patch<ApiResponse<UtilityBillResponse>>(`/utility-bills/${id}/mark-as-paid`);
    return response.data.data;
  }
}; 