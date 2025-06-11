import { UtilityType } from './enums';

export interface UtilityBill {
  id: number;
  householdId: number;
  monthYear: string;
  type: UtilityType;
  amount: number;
  isPaid: boolean;
  paidDate?: string;
  paidBy?: string;
  collectedBy?: string;
  createdBy: string;
  createdAt: string;
}

export interface UtilityBillRequest {
  householdId: number;
  monthYear: string;
  type: UtilityType;
  amount: number;
}

export interface UtilityBillResponse {
  id: number;
  householdId: number;
  monthYear: string;
  type: UtilityType;
  amount: number;
  isPaid: boolean;
  paidDate?: string;
  paidBy?: string;
  collectedBy?: string;
  createdBy: string;
  createdAt: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface UtilityBillListResponse {
  content: UtilityBillResponse[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
} 