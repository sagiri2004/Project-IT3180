import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  People as PeopleIcon,
  Home as HomeIcon,
  Payment as PaymentIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';
import householdService from '../services/household.service';
import { residentService } from '../services/resident.service';
import { feeCollectionService } from '../services/fee.service';

interface DashboardStats {
  totalHouseholds: number;
  totalResidents: number;
  totalFees: number;
  totalDonations: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalHouseholds: 0,
    totalResidents: 0,
    totalFees: 0,
    totalDonations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [households, residents, fees] = await Promise.all([
          householdService.getAll({ page: 0, size: 1000 }),
          residentService.getAll({ page: 0, size: 1000 }),
          feeCollectionService.getAll(),
        ]);

        setStats({
          totalHouseholds: households.content.length,
          totalResidents: residents.content.length,
          totalFees: fees.data.length,
          totalDonations: 0, // TODO: Implement donations
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Households',
      value: stats.totalHouseholds,
      icon: <HomeIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Total Residents',
      value: stats.totalResidents,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Total Fees',
      value: stats.totalFees,
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: 'Total Donations',
      value: stats.totalDonations,
      icon: <CampaignIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid {...({ item: true, xs: 12, sm: 6, md: 3 } as any)} key={card.title}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: card.color,
                color: 'white',
              }}
            >
              {card.icon}
              <Typography variant="h4" component="div" sx={{ mt: 2 }}>
                {card.value}
              </Typography>
              <Typography variant="subtitle1" component="div">
                {card.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 