import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import householdReducer from './slices/householdSlice';
import residentReducer from './slices/residentSlice';
import donationReducer from './donationSlice';
import donationCampaignReducer from './donationCampaignSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    household: householdReducer,
    resident: residentReducer,
    donation: donationReducer,
    donationCampaign: donationCampaignReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 