export interface PopulationChangeRequest {
  residentId: number;
  householdId?: number;
  changeType: string;
  startDate: string;
  endDate?: string;
  reason?: string;
  destinationAddress?: string;
  sourceAddress?: string;
}

export interface PopulationChangeResponse {
  id: number;
  residentId: number;
  residentName: string;
  householdId: number;
  householdCode: string;
  changeType: string;
  startDate: string;
  endDate?: string;
  reason?: string;
  destinationAddress?: string;
  sourceAddress?: string;
  isApproved: boolean;
  createdAt: string;
} 