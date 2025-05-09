import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import donationService from '../services/donation.service';
import { DonationRequest, DonationResponse, DonationState } from '../types/donation';

const initialState: DonationState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  selectedItem: null,
};

export const fetchDonations = createAsyncThunk(
  'donation/fetchAll',
  async ({ page, size, keyword }: { page: number; size: number; keyword?: string }) => {
    const response = await donationService.getAll(page, size, keyword);
    return response.data;
  }
);

export const createDonation = createAsyncThunk(
  'donation/create',
  async (data: DonationRequest) => {
    const response = await donationService.create(data);
    return response.data;
  }
);

export const updateDonation = createAsyncThunk(
  'donation/update',
  async ({ id, data }: { id: number; data: DonationRequest }) => {
    const response = await donationService.update(id, data);
    return response.data;
  }
);

export const deleteDonation = createAsyncThunk(
  'donation/delete',
  async (id: number) => {
    await donationService.delete(id);
    return id;
  }
);

export const fetchDonationsByHousehold = createAsyncThunk(
  'donation/fetchByHousehold',
  async (householdId: number) => {
    const response = await donationService.getByHousehold(householdId);
    return response.data;
  }
);

export const fetchDonationsByCampaign = createAsyncThunk(
  'donation/fetchByCampaign',
  async (campaignId: number) => {
    const response = await donationService.getByCampaign(campaignId);
    return response.data;
  }
);

const donationSlice = createSlice({
  name: 'donation',
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
      .addCase(fetchDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.total = action.payload.totalElements;
      })
      .addCase(fetchDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch donations';
      })
      // Create
      .addCase(createDonation.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.total += 1;
      })
      // Update
      .addCase(updateDonation.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteDonation.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.total -= 1;
      })
      // Fetch by household
      .addCase(fetchDonationsByHousehold.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.length;
      })
      // Fetch by campaign
      .addCase(fetchDonationsByCampaign.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.length;
      });
  },
});

export const { setSelectedItem, clearError } = donationSlice.actions;
export default donationSlice.reducer; 