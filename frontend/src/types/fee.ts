export interface FeeType {
  id: number;
  name: string;
  description: string;
  pricePerM2: number;
  isPerM2: boolean;
  isRequired: boolean;
  createdBy: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
}

export interface FeeCollection {
  id: number;
  householdId: number;
  householdCode: string;
  apartmentNumber: string;
  feeTypeId: number;
  feeTypeName: string;
  yearMonth: string; // yyyy-MM
  amount: number;
  isPaid: boolean;
  paidDate?: string; // yyyy-MM-dd
  paidBy?: string;
  collectedBy?: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateFeeTypeRequest {
  name: string;
  description: string;
  amount: number;
  period: string;
}

export interface UpdateFeeTypeRequest extends Partial<CreateFeeTypeRequest> {
  id: number;
}

export interface CreateFeeCollectionRequest {
  householdId: number;
  feeTypeId: number;
  amount: number;
  dueDate: string;
}

export interface UpdateFeeCollectionRequest extends Partial<CreateFeeCollectionRequest> {
  id: number;
  status?: string;
  paidDate?: string;
} 