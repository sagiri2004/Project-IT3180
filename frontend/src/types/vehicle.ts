import { VehicleType } from './enums';

export interface Vehicle {
  id: number;
  householdId: number;
  licensePlate: string;
  type: VehicleType;
  registeredDate: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface VehicleRequest {
  householdId: number;
  licensePlate: string;
  type: VehicleType;
  registeredDate?: string;
}

export interface VehicleResponse {
  success: boolean;
  message: string;
  data: Vehicle;
}

export interface VehicleListResponse {
  success: boolean;
  message: string;
  data: Vehicle[];
} 