import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import PrivateRoute from './components/PrivateRoute';
import { store } from './store';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HouseholdPage from './pages/HouseholdPage';
import ResidentPage from './pages/ResidentPage';
import DonationPage from './pages/DonationPage';
import DonationCampaignPage from './pages/DonationCampaignPage';
import DonationCampaignDetailPage from './pages/DonationCampaignDetailPage';
import FeeManagementPage from './pages/FeeManagementPage';
import FeeCollectionDetailPage from './pages/FeeCollectionDetailPage';
import FeeTypeDetailPage from './pages/FeeTypeDetailPage';
import PopulationChangePage from './pages/PopulationChangePage';
import HouseholdDetailPage from './pages/HouseholdDetailPage';
import theme, { getDesignTokens } from './theme';

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(
    localStorage.getItem('themeMode') === 'dark' ? 'dark' : 'light'
  );
  const muiTheme = useMemo(() => createTheme({
    ...getDesignTokens(mode),
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            textTransform: 'none' as const,
          }
        }
      }
    }
  }), [mode]);
  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={<PrivateRoute><Layout toggleTheme={toggleTheme} mode={mode} /></PrivateRoute>}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="households" element={<HouseholdPage />} />
              <Route path="residents" element={<ResidentPage />} />
              <Route path="donations" element={<DonationPage />} />
              <Route path="donation-campaigns" element={<DonationCampaignPage />} />
              <Route path="donation-campaigns/:id" element={<DonationCampaignDetailPage />} />
              <Route path="fees" element={<FeeManagementPage />} />
              <Route path="fees/:id" element={<FeeCollectionDetailPage />} />
              <Route path="fee-types/:id" element={<FeeTypeDetailPage />} />
              <Route path="population-changes" element={<PopulationChangePage />} />
              <Route path="households/:id" element={<HouseholdDetailPage />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 