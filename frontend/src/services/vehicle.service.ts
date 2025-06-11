import api from './api';
import { Vehicle, VehicleRequest, VehicleResponse } from '../types/vehicle';

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

export const vehicleService = {
  createVehicle: async (data: VehicleRequest): Promise<VehicleResponse> => {
    const response = await api.post<ApiResponse<VehicleResponse>>('/vehicles', data);
    return response.data.data;
  },

  updateVehicle: async (id: number, data: VehicleRequest): Promise<VehicleResponse> => {
    const response = await api.put<ApiResponse<VehicleResponse>>(`/vehicles/${id}`, data);
    return response.data.data;
  },

  deleteVehicle: async (id: number): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },

  getVehicle: async (id: number): Promise<VehicleResponse> => {
    const response = await api.get<ApiResponse<VehicleResponse>>(`/vehicles/${id}`);
    return response.data.data;
  },

  getVehicles: async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    direction: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResponse<Vehicle>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Vehicle>>>(
      `/vehicles?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    );
    return response.data.data;
  },

  getVehiclesByHousehold: async (
    householdId: number,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    direction: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResponse<Vehicle>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Vehicle>>>(
      `/vehicles/household/${householdId}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    );
    return response.data.data;
  },

  toggleVehicleStatus: async (id: number): Promise<VehicleResponse> => {
    const response = await api.patch<ApiResponse<VehicleResponse>>(`/vehicles/${id}/toggle-status`);
    return response.data.data;
  }
}; 