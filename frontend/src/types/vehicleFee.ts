export interface VehicleFee {
  id: number;
  vehicleId: number;
  monthYear: string;
  amount: number;
  isPaid: boolean;
  paidDate?: string;
  paidBy?: string;
  collectedBy?: string;
  createdBy: string;
  createdAt: string;
}

export interface VehicleFeeRequest {
  vehicleId: number;
  monthYear: string;
  amount: number;
}

export interface VehicleFeeResponse {
  success: boolean;
  message: string;
  data: VehicleFee;
}

export interface VehicleFeeListResponse {
  success: boolean;
  message: string;
  data: VehicleFee[];
} 