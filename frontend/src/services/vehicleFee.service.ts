import api from './api';
import { VehicleFee, VehicleFeeRequest, VehicleFeeResponse } from '../types/vehicleFee';

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const vehicleFeeService = {
  createVehicleFee: async (data: VehicleFeeRequest): Promise<VehicleFeeResponse> => {
    const response = await api.post<ApiResponse<VehicleFeeResponse>>('/vehicle-fees', data);
    return response.data.data;
  },

  updateVehicleFee: async (id: number, data: VehicleFeeRequest): Promise<VehicleFeeResponse> => {
    const response = await api.put<ApiResponse<VehicleFeeResponse>>(`/vehicle-fees/${id}`, data);
    return response.data.data;
  },

  deleteVehicleFee: async (id: number): Promise<void> => {
    await api.delete(`/vehicle-fees/${id}`);
  },

  getVehicleFee: async (id: number): Promise<VehicleFeeResponse> => {
    const response = await api.get<ApiResponse<VehicleFeeResponse>>(`/vehicle-fees/${id}`);
    return response.data.data;
  },

  getVehicleFees: async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    direction: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResponse<VehicleFee>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<VehicleFee>>>(
      `/vehicle-fees?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    );
    return response.data.data;
  },

  getVehicleFeesByVehicle: async (
    vehicleId: number,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    direction: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResponse<VehicleFee>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<VehicleFee>>>(
      `/vehicle-fees/vehicle/${vehicleId}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    );
    return response.data.data;
  },

  getVehicleFeesByVehicleAndMonth: async (
    vehicleId: number,
    monthYear: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    direction: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResponse<VehicleFee>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<VehicleFee>>>(
      `/vehicle-fees/vehicle/${vehicleId}/month/${monthYear}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    );
    return response.data.data;
  },

  markAsPaid: async (id: number): Promise<VehicleFeeResponse> => {
    const response = await api.patch<ApiResponse<VehicleFeeResponse>>(`/vehicle-fees/${id}/mark-as-paid`);
    return response.data.data;
  }
}; 