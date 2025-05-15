import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Resident, CreateResidentRequest, UpdateResidentRequest } from '../../types/resident';
import { residentService } from '../../services/resident.service';

interface ResidentState {
  residents: Resident[];
  totalElements: number;
  isLoading: boolean;
  error: string | null;
  page: number;
  size: number;
}

const initialState: ResidentState = {
  residents: [],
  totalElements: 0,
  isLoading: false,
  error: null,
  page: 0,
  size: 10
};

export const fetchResidents = createAsyncThunk(
  'resident/fetchAll',
  async (params: { page: number; size: number; keyword?: string }) => {
    return await residentService.getAll(params);
  }
);

export const fetchResidentById = createAsyncThunk(
  'resident/fetchById',
  async (id: number) => {
    return await residentService.getById(id);
  }
);

export const createResident = createAsyncThunk(
  'resident/create',
  async (data: CreateResidentRequest) => {
    return await residentService.create(data);
  }
);

export const updateResident = createAsyncThunk(
  'resident/update',
  async (data: UpdateResidentRequest) => {
    return await residentService.update(data);
  }
);

export const deleteResident = createAsyncThunk(
  'resident/delete',
  async (id: number) => {
    await residentService.delete(id);
    return id;
  }
);

const residentSlice = createSlice({
  name: 'resident',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResidents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResidents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.residents = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchResidents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch residents';
      })
      .addCase(createResident.fulfilled, (state, action) => {
        state.residents.push(action.payload);
      })
      .addCase(updateResident.fulfilled, (state, action) => {
        const idx = state.residents.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.residents[idx] = action.payload;
      })
      .addCase(deleteResident.fulfilled, (state, action) => {
        state.residents = state.residents.filter(r => r.id !== action.payload);
      });
  }
});

export const { clearError } = residentSlice.actions;
export default residentSlice.reducer; 