import { Gender, RelationshipType, ChangeType } from './enums.js';

export interface Household {
  id: number;
  householdCode: string;
  apartmentNumber: string;
  areaM2: number;
  address: string;
  ownerName: string;
  phoneNumber: string;
  registrationDate: string;
  residentCount: number;
  createdAt: string;
}

export interface Resident {
  id: number;
  householdId: number;
  householdCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  relationshipWithOwner: RelationshipType;
  isOwner: boolean;
  createdAt: string;
}

export interface Donation {
  id: number;
  householdId: number;
  householdCode: string;
  apartmentNumber: string;
  donationCampaignId: number;
  campaignName: string;
  amount: number;
  donationDate: string;
  createdBy: string;
  createdAt: string;
}

export interface FeeCollection {
  id: number;
  householdId: number;
  householdCode: string;
  feeTypeId: number;
  feeTypeName: string;
  amount: number;
  yearMonth: string;
  isPaid: boolean;
  paidDate: string | null;
  paidBy: string | null;
  collectedBy: string | null;
  createdAt: string;
}

export interface PopulationChange {
  id: number;
  householdId: number;
  householdCode: string;
  residentName: string;
  changeType: ChangeType;
  startDate: string;
  endDate: string | null;
  reason: string;
  destinationAddress: string | null;
  sourceAddress: string | null;
  isApproved: boolean;
  createdAt: string;
}

export interface HouseholdDetail extends Household {
  members: Resident[];
  donations: Donation[];
  feeCollections: FeeCollection[];
  populationChanges: PopulationChange[];
}

export interface HouseholdPage {
  content: Household[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CreateHouseholdRequest {
  householdCode: string;
  apartmentNumber: string;
  areaM2: number;
  address: string;
  ownerName: string;
  phoneNumber: string;
}

export interface UpdateHouseholdRequest extends CreateHouseholdRequest {
  id: number;
}

export interface HouseholdSearchParams {
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface HouseholdMember {
  id: number;
  name: string;
  gender: string;
  dob: string;
  relation: string;
}

export interface HouseholdContribution {
  id: number;
  name: string;
  amount: number;
  date: string;
}

export interface HouseholdUnpaidFee {
  id: number;
  name: string;
  amount: number;
  due: string;
}

export interface HouseholdPopulationChange {
  id: number;
  resident: string;
  type: string;
  start: string;
  end: string;
  reason: string;
  isApproved: boolean;
} 