export interface DonationCampaignRequest {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  targetAmount?: number;
}

export interface DonationCampaignResponse {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  targetAmount?: number;
  totalDonated: number;
  remainingAmount?: number;
  totalDonors: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface DonationCampaignState {
  items: DonationCampaignResponse[];
  total: number;
  loading: boolean;
  error: string | null;
  selectedItem: DonationCampaignResponse | null;
} 