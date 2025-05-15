import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import donationCampaignService from '../services/donation.campaign.service';
import { DonationCampaignRequest, DonationCampaignResponse, DonationCampaignState } from '../types/donationCampaign';

const initialState: DonationCampaignState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  selectedItem: null,
};

export const fetchDonationCampaigns = createAsyncThunk(
  'donationCampaign/fetchAll',
  async ({ page, size, keyword }: { page: number; size: number; keyword?: string }) => {
    const response = await donationCampaignService.getAll(page, size, keyword);
    return response.data;
  }
);

export const createDonationCampaign = createAsyncThunk(
  'donationCampaign/create',
  async (data: DonationCampaignRequest) => {
    const response = await donationCampaignService.create(data);
    return response.data;
  }
);

export const updateDonationCampaign = createAsyncThunk(
  'donationCampaign/update',
  async ({ id, data }: { id: number; data: DonationCampaignRequest }) => {
    const response = await donationCampaignService.update(id, data);
    return response.data;
  }
);

export const deleteDonationCampaign = createAsyncThunk(
  'donationCampaign/delete',
  async (id: number) => {
    await donationCampaignService.delete(id);
    return id;
  }
);

const donationCampaignSlice = createSlice({
  name: 'donationCampaign',
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchDonationCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonationCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.total = action.payload.totalElements;
      })
      .addCase(fetchDonationCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch donation campaigns';
      })
      // Create
      .addCase(createDonationCampaign.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.total += 1;
      })
      // Update
      .addCase(updateDonationCampaign.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteDonationCampaign.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setSelectedItem, clearError } = donationCampaignSlice.actions;
export default donationCampaignSlice.reducer; 