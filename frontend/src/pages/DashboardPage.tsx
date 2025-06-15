import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import api from '../services/api';

const DashboardPage: React.FC = () => {
  const [householdCount, setHouseholdCount] = useState<number>(0);
  const [residentCount, setResidentCount] = useState<number>(0);
  const [vehicleCount, setVehicleCount] = useState<number>(0);
  const [feeTypeCount, setFeeTypeCount] = useState<number>(0);
  const [utilityBillCount, setUtilityBillCount] = useState<number>(0);
  const [vehicleFeeCount, setVehicleFeeCount] = useState<number>(0);
  const [donationCount, setDonationCount] = useState<number>(0);
  const [campaignCount, setCampaignCount] = useState<number>(0);
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [populationChangeCount, setPopulationChangeCount] = useState<number>(0);

  useEffect(() => {
    // Lấy tổng số hộ khẩu
    api.get('/households?page=0&size=1')
      .then(res => setHouseholdCount(res.data.data.totalElements || 0))
      .catch(() => setHouseholdCount(0));
    // Lấy tổng số nhân khẩu
    api.get('/residents?page=0&size=1')
      .then(res => setResidentCount(res.data.data.totalElements || 0))
      .catch(() => setResidentCount(0));
    api.get('/vehicles?page=0&size=1').then(res => setVehicleCount(res.data.data.totalElements || 0));
    api.get('/fee-types?page=0&size=1').then(res => setFeeTypeCount(res.data.data.totalElements || 0));
    api.get('/utility-bills?page=0&size=1').then(res => setUtilityBillCount(res.data.data.totalElements || 0));
    api.get('/vehicle-fees?page=0&size=1').then(res => setVehicleFeeCount(res.data.data.totalElements || 0));
    api.get('/donations?page=0&size=1').then(res => setDonationCount(res.data.data.totalElements || 0));
    api.get('/donation-campaigns?page=0&size=1').then(res => setCampaignCount(res.data.data.totalElements || 0));
    api.get('/history?page=0&size=1').then(res => setHistoryCount(res.data.data.totalElements || 0));
    api.get('/population-changes?page=0&size=1').then(res => setPopulationChangeCount(res.data.data.totalElements || 0));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tổng quan
      </Typography>
      <Box display="flex" gap={3} flexWrap="wrap">
        <Box flex={1} minWidth={220}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng số hộ khẩu
              </Typography>
              <Typography variant="h4">
                {householdCount}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex={1} minWidth={220}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng số nhân khẩu
              </Typography>
              <Typography variant="h4">
                {residentCount}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex={1} minWidth={220}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng số phương tiện
              </Typography>
              <Typography variant="h4">
                {vehicleCount}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex={1} minWidth={220}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng số loại phí
              </Typography>
              <Typography variant="h4">
                {feeTypeCount}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex={1} minWidth={220}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng số hóa đơn tiện ích
              </Typography>
              <Typography variant="h4">
                {utilityBillCount}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex={1} minWidth={220}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng số phí gửi xe
              </Typography>
              <Typography variant="h4">
                {vehicleFeeCount}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex={1} minWidth={220}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng số đóng góp
              </Typography>
              <Typography variant="h4">
                {donationCount}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex={1} minWidth={220}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng số chiến dịch
              </Typography>
              <Typography variant="h4">
                {campaignCount}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex={1} minWidth={220}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Lịch sử thay đổi
              </Typography>
              <Typography variant="h4">
                {historyCount}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex={1} minWidth={220}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Thay đổi nhân khẩu
              </Typography>
              <Typography variant="h4">
                {populationChangeCount}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;