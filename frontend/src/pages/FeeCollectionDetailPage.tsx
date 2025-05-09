import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  Typography,
  Paper,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { feeCollectionService } from '../services/fee.service';
import { FeeCollection } from '../types/fee';
import SmartTable from '../components/SmartTable';
import { formatCurrency, formatDate } from '../utils/formatters';

const FeeCollectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feeCollection, setFeeCollection] = useState<FeeCollection | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await feeCollectionService.getById(parseInt(id));
      setFeeCollection(data);
      setError(null);
    } catch (err) {
      setError('Failed to load fee collection details');
      console.error('Error loading fee collection:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !feeCollection) {
    return (
      <Box p={3}>
        <Alert severity="error">{error || 'Fee collection not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto', bgcolor: 'background.paper' }}>
      {/* Outer Container with Dark Background */}
      <Paper
        sx={{
          bgcolor: '#1F2A44', // Dark background color similar to the image
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* Header Section */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700} color="white">
            Chi tiết khoản thu
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/fees')}
            startIcon={<ArrowBackIcon />}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Quay lại
          </Button>
        </Stack>

        {/* Main Content */}
        <Grid {...({ container: true, spacing: 3 } as any)} sx={{ mb: 4 }}>
          {/* Thông tin cơ bản */}
          <Grid {...({ item: true, xs: 12, md: 6 } as any)}>
            <Card sx={{ p: 3, height: '100%', bgcolor: '#2A3656' }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }} color="white">
                Thông tin cơ bản
              </Typography>
              <Grid {...({ container: true, spacing: 2 } as any)}>
                <Grid {...({ item: true, xs: 12 } as any)}>
                  <Box display="flex" alignItems="center" mb={1.5}>
                    <HomeIcon sx={{ mr: 1, color: 'white' }} />
                    <Box>
                      <Typography variant="subtitle2" color="grey.400">
                        Mã hộ
                      </Typography>
                      <Typography variant="body1" color="white">
                        {feeCollection.householdCode}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid {...({ item: true, xs: 12 } as any)}>
                  <Box display="flex" alignItems="center" mb={1.5}>
                    <HomeIcon sx={{ mr: 1, color: 'white' }} />
                    <Box>
                      <Typography variant="subtitle2" color="grey.400">
                        Số căn hộ
                      </Typography>
                      <Typography variant="body1" color="white">
                        {feeCollection.apartmentNumber}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid {...({ item: true, xs: 12 } as any)}>
                  <Box display="flex" alignItems="center" mb={1.5}>
                    <PaymentIcon sx={{ mr: 1, color: 'white' }} />
                    <Box>
                      <Typography variant="subtitle2" color="grey.400">
                        Loại phí
                      </Typography>
                      <Typography variant="body1" color="white">
                        {feeCollection.feeTypeName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid {...({ item: true, xs: 12 } as any)}>
                  <Box display="flex" alignItems="center" mb={1.5}>
                    <CalendarIcon sx={{ mr: 1, color: 'white' }} />
                    <Box>
                      <Typography variant="subtitle2" color="grey.400">
                        Tháng
                      </Typography>
                      <Typography variant="body1" color="white">
                        {feeCollection.yearMonth}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Thông tin thanh toán */}
          <Grid {...({ item: true, xs: 12, md: 6 } as any)}>
            <Card sx={{ p: 3, height: '100%', bgcolor: '#2A3656' }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }} color="white">
                Thông tin thanh toán
              </Typography>
              <Grid {...({ container: true, spacing: 2 } as any)}>
                <Grid {...({ item: true, xs: 12 } as any)}>
                  <Box display="flex" alignItems="center" mb={1.5}>
                    <MoneyIcon sx={{ mr: 1, color: 'white' }} />
                    <Box>
                      <Typography variant="subtitle2" color="grey.400">
                        Số tiền
                      </Typography>
                      <Typography variant="body1" color="primary.main" fontWeight="bold">
                        {formatCurrency(feeCollection.amount)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid {...({ item: true, xs: 12 } as any)}>
                  <Box display="flex" alignItems="center" mb={1.5}>
                    <PaymentIcon sx={{ mr: 1, color: 'white' }} />
                    <Box>
                      <Typography variant="subtitle2" color="grey.400">
                        Trạng thái
                      </Typography>
                      <Typography
                        variant="body1"
                        color={feeCollection.isPaid ? 'success.main' : 'error.main'}
                        fontWeight="bold"
                      >
                        {feeCollection.isPaid ? 'Đã thu' : 'Chưa thu'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {feeCollection.isPaid && (
                  <>
                    <Grid {...({ item: true, xs: 12 } as any)}>
                      <Box display="flex" alignItems="center" mb={1.5}>
                        <CalendarIcon sx={{ mr: 1, color: 'white' }} />
                        <Box>
                          <Typography variant="subtitle2" color="grey.400">
                            Ngày thu
                          </Typography>
                          <Typography variant="body1" color="white">
                            {feeCollection.paidDate ? formatDate(feeCollection.paidDate) : ''}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid {...({ item: true, xs: 12 } as any)}>
                      <Box display="flex" alignItems="center" mb={1.5}>
                        <PersonIcon sx={{ mr: 1, color: 'white' }} />
                        <Box>
                          <Typography variant="subtitle2" color="grey.400">
                            Người nộp
                          </Typography>
                          <Typography variant="body1" color="white">
                            {feeCollection.paidBy}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid {...({ item: true, xs: 12 } as any)}>
                      <Box display="flex" alignItems="center" mb={1.5}>
                        <PersonIcon sx={{ mr: 1, color: 'white' }} />
                        <Box>
                          <Typography variant="subtitle2" color="grey.400">
                            Người thu
                          </Typography>
                          <Typography variant="body1" color="white">
                            {feeCollection.collectedBy}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </Card>
          </Grid>

          {/* Thông tin khác */}
          <Grid {...({ item: true, xs: 12 } as any)}>
            <Card sx={{ p: 3, bgcolor: '#2A3656' }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }} color="white">
                Thông tin khác
              </Typography>
              <Grid {...({ container: true, spacing: 2 } as any)}>
                <Grid {...({ item: true, xs: 12, md: 6 } as any)}>
                  <Box display="flex" alignItems="center" mb={1.5}>
                    <PersonIcon sx={{ mr: 1, color: 'white' }} />
                    <Box>
                      <Typography variant="subtitle2" color="grey.400">
                        Người tạo
                      </Typography>
                      <Typography variant="body1" color="white">
                        {feeCollection.createdBy}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid {...({ item: true, xs: 12, md: 6 } as any)}>
                  <Box display="flex" alignItems="center" mb={1.5}>
                    <CalendarIcon sx={{ mr: 1, color: 'white' }} />
                    <Box>
                      <Typography variant="subtitle2" color="grey.400">
                        Ngày tạo
                      </Typography>
                      <Typography variant="body1" color="white">
                        {formatDate(feeCollection.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default FeeCollectionDetailPage;