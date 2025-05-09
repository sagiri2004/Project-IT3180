import api from './api';
import {
  FeeType,
  FeeCollection,
  CreateFeeTypeRequest,
  UpdateFeeTypeRequest,
  CreateFeeCollectionRequest,
  UpdateFeeCollectionRequest,
} from '../types/fee';

const mockFeeTypes: FeeType[] = [
  {
    id: 1,
    name: 'Phí quản lý',
    description: 'Phí quản lý chung cư',
    pricePerM2: 8000,
    isPerM2: true,
    isRequired: true,
    createdBy: 'admin',
    createdAt: '2024-05-01T10:00:00',
  },
  {
    id: 2,
    name: 'Phí gửi xe',
    description: 'Phí gửi xe máy/tháng',
    pricePerM2: 120000,
    isPerM2: false,
    isRequired: false,
    createdBy: 'admin',
    createdAt: '2024-05-01T10:00:00',
  },
];

const mockFeeCollections: FeeCollection[] = [
  {
    id: 1,
    householdId: 1,
    householdCode: 'HS001',
    apartmentNumber: 'A101',
    feeTypeId: 1,
    feeTypeName: 'Phí quản lý',
    yearMonth: '2024-05',
    amount: 400000,
    isPaid: true,
    paidDate: '2024-05-05',
    paidBy: 'Nguyen Van A',
    collectedBy: 'admin',
    createdBy: 'admin',
    createdAt: '2024-05-01T10:00:00',
  },
  {
    id: 2,
    householdId: 2,
    householdCode: 'HS002',
    apartmentNumber: 'A102',
    feeTypeId: 2,
    feeTypeName: 'Phí gửi xe',
    yearMonth: '2024-05',
    amount: 120000,
    isPaid: false,
    createdBy: 'admin',
    createdAt: '2024-05-01T10:00:00',
  },
];

export const feeTypeService = {
  getAll: async (page = 0, size = 10): Promise<{ data: FeeType[]; total: number }> => {
    const res = await api.get('/fee-types', { params: { page, size } });
    return {
      data: res.data?.data?.content || [],
      total: res.data?.data?.totalElements || 0,
    };
  },

  getById: async (id: number): Promise<FeeType> => {
    const response = await api.get(`/fee-types/${id}`);
    return response.data?.data;
  },

  create: async (data: Omit<FeeType, 'id' | 'createdBy' | 'createdAt'>): Promise<FeeType> => {
    const response = await api.post('/fee-types', data);
    return response.data?.data;
  },

  update: async (data: Partial<FeeType> & { id: number }): Promise<FeeType> => {
    const { id, ...rest } = data;
    const response = await api.put(`/fee-types/${id}`, rest);
    return response.data?.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/fee-types/${id}`);
  },
};

export const feeCollectionService = {
  getAll: async (page = 0, size = 10): Promise<{ data: FeeCollection[]; total: number }> => {
    const res = await api.get('/fee-collections', { params: { page, size } });
    return {
      data: res.data?.data?.content || [],
      total: res.data?.data?.totalElements || 0,
    };
  },

  getById: async (id: number): Promise<FeeCollection> => {
    const response = await api.get(`/fee-collections/${id}`);
    return response.data?.data;
  },

  getByHouseholdId: async (householdId: number): Promise<FeeCollection[]> => {
    const response = await api.get(`/fee-collections/household/${householdId}`);
    return response.data?.data;
  },

  create: async (data: Omit<FeeCollection, 'id' | 'createdBy' | 'createdAt' | 'householdCode' | 'apartmentNumber' | 'feeTypeName'>): Promise<FeeCollection> => {
    const response = await api.post('/fee-collections', data);
    return response.data?.data;
  },

  update: async (data: Partial<FeeCollection> & { id: number }): Promise<FeeCollection> => {
    const { id, ...rest } = data;
    const response = await api.put(`/fee-collections/${id}`, rest);
    return response.data?.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/fee-collections/${id}`);
  },
}; 