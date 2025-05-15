import React, { useMemo } from 'react';
import { Box, Card, Typography, Stack, Chip, Divider, Button, Paper, Avatar, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { BarChart, PieChart } from '@mui/x-charts';
import SmartTable from '../components/SmartTable';
import { MonetizationOn, People, TrendingUp, Info, Payment } from '@mui/icons-material';
import { FeeType, FeeCollection } from '../types/fee';

// Mock data
const mockFeeTypes: FeeType[] = [
  {
    id: 1,
    name: 'Phí quản lý',
    description: 'Phí quản lý chung cư',
    pricePerM2: 8000,
    isPerM2: true,
    isRequired: true,
    createdBy: 'admin',
    createdAt: '2024-05-01T10:00:00',
    startDate: '2024-05-01',
    endDate: '2024-12-31',
  },
  {
    id: 2,
    name: 'Phí gửi xe',
    description: 'Phí gửi xe máy/tháng',
    pricePerM2: 120000,
    isPerM2: false,
    isRequired: false,
    createdBy: 'admin',
    createdAt: '2024-05-01T10:00:00',
    startDate: '2024-06-01',
    endDate: '2024-12-31',
  },
];

const mockFeeCollections: FeeCollection[] = [
  {
    id: 1,
    householdId: 1,
    householdCode: 'HS001',
    apartmentNumber: 'A101',
    feeTypeId: 1,
    feeTypeName: 'Phí quản lý',
    yearMonth: '2024-05',
    amount: 400000,
    isPaid: true,
    paidDate: '2024-05-05',
    paidBy: 'Nguyen Van A',
    collectedBy: 'admin',
    createdBy: 'admin',
    createdAt: '2024-05-01T10:00:00',
  },
  {
    id: 2,
    householdId: 2,
    householdCode: 'HS002',
    apartmentNumber: 'A102',
    feeTypeId: 1,
    feeTypeName: 'Phí quản lý',
    yearMonth: '2024-05',
    amount: 400000,
    isPaid: false,
    createdBy: 'admin',
    createdAt: '2024-05-01T10:00:00',
  },
  {
    id: 3,
    householdId: 3,
    householdCode: 'HS003',
    apartmentNumber: 'A103',
    feeTypeId: 1,
    feeTypeName: 'Phí quản lý',
    yearMonth: '2024-05',
    amount: 400000,
    isPaid: true,
    paidDate: '2024-05-10',
    paidBy: 'Nguyen Van B',
    collectedBy: 'admin',
    createdBy: 'admin',
    createdAt: '2024-05-01T10:00:00',
  },
  {
    id: 4,
    householdId: 4,
    householdCode: 'HS004',
    apartmentNumber: 'A104',
    feeTypeId: 1,
    feeTypeName: 'Phí quản lý',
    yearMonth: '2024-05',
    amount: 400000,
    isPaid: false,
    createdBy: 'admin',
    createdAt: '2024-05-01T10:00:00',
  },
  {
    id: 5,
    householdId: 5,
    householdCode: 'HS005',
    apartmentNumber: 'A105',
    feeTypeId: 1,
    feeTypeName: 'Phí quản lý',
    yearMonth: '2024-05',
    amount: 400000,
    isPaid: true,
    paidDate: '2024-05-12',
    paidBy: 'Nguyen Van C',
    collectedBy: 'admin',
    createdBy: 'admin',
    createdAt: '2024-05-01T10:00:00',
  },
];

const FeeTypeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const feeType = mockFeeTypes.find(f => f.id === Number(id));
  const collections = mockFeeCollections.filter(c => c.feeTypeId === Number(id));

  // Thống kê
  const totalHouseholds = collections.length;
  const paidCount = collections.filter(c => c.isPaid).length;
  const totalCollected = collections.filter(c => c.isPaid).reduce((sum, c) => sum + c.amount, 0);
  const totalExpected = collections.reduce((sum, c) => sum + c.amount, 0);
  const progress = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;
  const status = (() => {
    const now = new Date();
    if (feeType?.startDate && new Date(feeType.startDate) > now) return 'Sắp tới';
    if (feeType?.endDate && new Date(feeType.endDate) < now) return 'Đã kết thúc';
    return 'Đang thu';
  })();

  // Bar chart: số hộ đã đóng theo ngày
  const barData = useMemo(() => {
    const grouped: Record<string, number> = {};
    collections.filter(c => c.isPaid && c.paidDate).forEach((c) => {
      const date = c.paidDate!.slice(0, 10);
      grouped[date] = (grouped[date] || 0) + 1;
    });
    const sortedDates = Object.keys(grouped).sort();
    const values = sortedDates.map(date => grouped[date]);
    return { dates: sortedDates, values };
  }, [collections]);

  // Pie chart: tỉ lệ đã thu/chưa thu
  const pieData = [
    { id: 0, value: paidCount, label: 'Đã thu', color: '#10B981' },
    { id: 1, value: totalHouseholds - paidCount, label: 'Chưa thu', color: '#F43F5E' },
  ];

  // Cột bảng
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'householdCode', headerName: 'Mã hộ', width: 120 },
    { field: 'apartmentNumber', headerName: 'Số căn hộ', width: 120 },
    { field: 'yearMonth', headerName: 'Tháng', width: 100 },
    { field: 'amount', headerName: 'Số tiền (VNĐ)', width: 150, valueFormatter: (params: any) => params.value?.toLocaleString('vi-VN') },
    { field: 'isPaid', headerName: 'Đã thu', width: 100, valueFormatter: (params: any) => params.value ? 'Đã thu' : 'Chưa thu' },
    { field: 'paidDate', headerName: 'Ngày thu', width: 120 },
    { field: 'paidBy', headerName: 'Người nộp', width: 120 },
    { field: 'collectedBy', headerName: 'Người thu', width: 120 },
    { field: 'createdBy', headerName: 'Người tạo', width: 120 },
    { field: 'createdAt', headerName: 'Ngày tạo', width: 160 },
  ];

  if (!feeType) return <Typography>Không tìm thấy loại phí</Typography>;

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>← Quay lại</Button>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Chi tiết loại phí: {feeType.name}
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid {...({ item: true, xs: 12, sm: 6, md: 3 } as any)}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'success.main' }}><People /></Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Tổng số hộ phải thu</Typography>
                <Typography variant="h5" fontWeight={700}>{totalHouseholds}</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid {...({ item: true, xs: 12, sm: 6, md: 3 } as any)}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main' }}><MonetizationOn /></Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Tổng đã thu</Typography>
                <Typography variant="h5" fontWeight={700}>{totalCollected.toLocaleString('vi-VN')} VNĐ</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid {...({ item: true, xs: 12, sm: 6, md: 3 } as any)}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'info.main' }}><TrendingUp /></Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Số hộ đã đóng</Typography>
                <Typography variant="h5" fontWeight={700}>{paidCount} / {totalHouseholds}</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid {...({ item: true, xs: 12, sm: 6, md: 3 } as any)}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'warning.main' }}><Info /></Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Trạng thái</Typography>
                <Chip label={status} color={status === 'Đang thu' ? 'success' : status === 'Sắp tới' ? 'warning' : 'default'} />
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid {...({ item: true, xs: 12, md: 8 } as any)}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Số hộ đã đóng theo ngày</Typography>
            {barData.dates.length > 0 ? (
              <BarChart
                xAxis={[{ data: barData.dates, scaleType: 'band', label: 'Ngày' }]}
                series={[
                  {
                    data: barData.values,
                    label: 'Số hộ đã đóng',
                    color: '#10B981',
                  },
                ]}
                width={600}
                height={300}
              />
            ) : (
              <Typography align="center" color="text.secondary">Không có dữ liệu</Typography>
            )}
          </Card>
        </Grid>
        <Grid {...({ item: true, xs: 12, md: 4 } as any)}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Tỉ lệ hoàn thành</Typography>
            <PieChart
              series={[{
                data: pieData.map(d => ({ ...d, color: d.color })),
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
              }]}
              width={300}
              height={200}
            />
            <Typography align="center" fontWeight={600} sx={{ mt: 2 }}>{progress}% đã thu</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Thông tin tổng quan */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Thông tin loại phí</Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1}>
          <Typography><b>Mô tả:</b> {feeType.description}</Typography>
          <Typography><b>Đơn giá:</b> {feeType.pricePerM2.toLocaleString('vi-VN')} VNĐ{feeType.isPerM2 ? ' / m2' : ''}</Typography>
          <Typography><b>Bắt buộc:</b> {feeType.isRequired ? 'Có' : 'Không'}</Typography>
          <Typography><b>Ngày bắt đầu:</b> {feeType.startDate}</Typography>
          <Typography><b>Ngày kết thúc:</b> {feeType.endDate}</Typography>
          <Typography><b>Người tạo:</b> {feeType.createdBy}</Typography>
          <Typography><b>Ngày tạo:</b> {feeType.createdAt}</Typography>
        </Stack>
      </Card>

      {/* Bảng thống kê */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Bảng thống kê các khoản thu</Typography>
        <Paper sx={{ p: 2 }}>
          <SmartTable
            columns={columns}
            rows={collections}
            rowCount={collections.length}
            loading={false}
            paginationModel={{ page: 0, pageSize: 10 }}
            onPaginationModelChange={() => {}}
            onSearch={() => {}}
            searchValue={''}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default FeeTypeDetailPage; 