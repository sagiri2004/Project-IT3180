import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Household, CreateHouseholdRequest, UpdateHouseholdRequest, HouseholdSearchParams, HouseholdPage } from '../../types/household';
import householdService from '../../services/household.service';

interface HouseholdState {
    households: Household[];
    totalElements: number;
    isLoading: boolean;
    error: string | null;
    currentHousehold: Household | null;
}

const initialState: HouseholdState = {
    households: [],
    totalElements: 0,
    isLoading: false,
    error: null,
    currentHousehold: null
};

export const fetchHouseholds = createAsyncThunk<HouseholdPage, HouseholdSearchParams>(
    'household/fetchAll',
    async (params) => {
        return await householdService.getAll(params);
    }
);

export const fetchHouseholdById = createAsyncThunk<Household, number>(
    'household/fetchById',
    async (id) => {
        return await householdService.getById(id);
    }
);

export const createHousehold = createAsyncThunk<Household, CreateHouseholdRequest>(
    'household/create',
    async (data) => {
        return await householdService.create(data);
    }
);

export const updateHousehold = createAsyncThunk<Household, { id: number; data: UpdateHouseholdRequest }>(
    'household/update',
    async ({ id, data }) => {
        return await householdService.update(id, data);
    }
);

export const deleteHousehold = createAsyncThunk<void, number>(
    'household/delete',
    async (id) => {
        await householdService.delete(id);
    }
);

export const searchHouseholds = createAsyncThunk<Household[], string>(
    'household/search',
    async (keyword) => {
        return await householdService.search(keyword);
    }
);

const householdSlice = createSlice({
    name: 'household',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchHouseholds.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchHouseholds.fulfilled, (state, action) => {
                state.isLoading = false;
                state.households = action.payload.content;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(fetchHouseholds.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch households';
            })
            // Fetch by ID
            .addCase(fetchHouseholdById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchHouseholdById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentHousehold = action.payload;
            })
            .addCase(fetchHouseholdById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch household';
            })
            // Create
            .addCase(createHousehold.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createHousehold.fulfilled, (state, action) => {
                state.isLoading = false;
                state.households.push(action.payload);
            })
            .addCase(createHousehold.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to create household';
            })
            // Update
            .addCase(updateHousehold.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateHousehold.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.households.findIndex(h => h.id === action.payload.id);
                if (index !== -1) {
                    state.households[index] = action.payload;
                }
                state.currentHousehold = action.payload;
            })
            .addCase(updateHousehold.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to update household';
            })
            // Delete
            .addCase(deleteHousehold.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteHousehold.fulfilled, (state, action) => {
                state.isLoading = false;
                state.households = state.households.filter(h => h.id !== action.meta.arg);
            })
            .addCase(deleteHousehold.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to delete household';
            })
            // Search
            .addCase(searchHouseholds.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchHouseholds.fulfilled, (state, action) => {
                state.isLoading = false;
                state.households = action.payload;
            })
            .addCase(searchHouseholds.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to search households';
            });
    }
});

export const { clearError } = householdSlice.actions;
export default householdSlice.reducer; 