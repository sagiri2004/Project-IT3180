import api from './api';
import { VehicleFeeConfig } from '../types/vehicleFeeConfig';

export const vehicleFeeConfigService = {
  getAll: async (): Promise<VehicleFeeConfig[]> => {
    const res = await api.get('/vehicle-fee-configs');
    return res.data;
  },
  create: async (data: Omit<VehicleFeeConfig, 'id'>): Promise<VehicleFeeConfig> => {
    const res = await api.post('/vehicle-fee-configs', data);
    return res.data;
  },
  update: async (id: number, data: Omit<VehicleFeeConfig, 'id'>): Promise<VehicleFeeConfig> => {
    const res = await api.put(`/vehicle-fee-configs/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/vehicle-fee-configs/${id}`);
  },
}; 