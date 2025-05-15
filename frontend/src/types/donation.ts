export interface DonationRequest {
  householdId: number;
  donationCampaignId: number;
  amount: number;
  donationDate?: string;
}

export interface DonationResponse {
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

export interface DonationState {
  items: DonationResponse[];
  total: number;
  loading: boolean;
  error: string | null;
  selectedItem: DonationResponse | null;
} 