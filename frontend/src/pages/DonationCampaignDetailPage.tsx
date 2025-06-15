import React, { useMemo, useEffect, useState } from 'react';
import { Box, Card, Typography, Stack, Chip, Divider, Button, Paper, Avatar, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { BarChart, PieChart } from '@mui/x-charts';
import SmartTable from '../components/SmartTable';
import { MonetizationOn, People, TrendingUp, Info } from '@mui/icons-material';
import api from '../services/api';

const DonationCampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State cho dữ liệu thực tế
  const [campaign, setCampaign] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy chi tiết campaign
        const campaignRes = await api.get(`/donation-campaigns/${id}`);
        setCampaign(campaignRes.data.data);
        // Lấy danh sách donations
        const donationsRes = await api.get(`/donations/campaign/${id}`);
        // Dữ liệu trả về là data.data (mảng donations)
        setDonations(donationsRes.data.data || []);
      } catch (error) {
        setCampaign(null);
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  // Tạo mảng màu cho các cột bar chart
  const barColors = ['#6366F1', '#F59E42', '#10B981', '#F43F5E', '#A21CAF', '#0284C7', '#FACC15', '#0EA5E9'];

  // Tính toán dữ liệu cho BarChart theo ngày
  const barData = useMemo(() => {
    const grouped: Record<string, number> = {};
    donations.forEach((d) => {
      const date = d.donationDate?.slice(0, 10); // Lấy YYYY-MM-DD
      if (!date) return;
      grouped[date] = (grouped[date] || 0) + d.amount;
    });
    const sortedDates = Object.keys(grouped).sort();
    const values = sortedDates.map((date) => grouped[date]);
    return { dates: sortedDates, values };
  }, [donations]);

  // Dữ liệu cho PieChart
  const pieData = campaign ? [
    { id: 0, value: campaign.totalDonated, label: 'Đã quyên góp', color: '#6366F1' },
    { id: 1, value: campaign.remainingAmount, label: 'Còn thiếu', color: '#F59E42' },
  ] : [];

  // Tạo mảng màu cho từng cột bar chart
  const barSeriesColors = barData.values.map((_, idx) => barColors[idx % barColors.length]);

  // Cấu hình cột cho SmartTable
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'householdCode', headerName: 'Mã hộ', width: 120 },
    { field: 'apartmentNumber', headerName: 'Số căn hộ', width: 120 },
    { field: 'amount', headerName: 'Số tiền (VNĐ)', width: 150, valueFormatter: (params: any) => params.value?.toLocaleString('vi-VN') },
    { field: 'donationDate', headerName: 'Ngày đóng góp', width: 140 },
    { field: 'createdBy', headerName: 'Người tạo', width: 120 },
    { field: 'createdAt', headerName: 'Ngày tạo', width: 160 },
  ];

  if (loading) return <Typography>Đang tải...</Typography>;
  if (!campaign) return <Typography>Không tìm thấy chiến dịch.</Typography>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto', bgcolor: 'background.default' }}>
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Chi tiết chiến dịch: {campaign.name}
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)} startIcon="←">
          Quay lại
        </Button>
      </Stack>

      {/* Stat Cards */}
      <Grid {...({ container: true, spacing: 3 } as any)} sx={{ mb: 4 }}>
        {[
          { 
            icon: <MonetizationOn />, 
            label: 'Đã quyên góp', 
            value: `${campaign.totalDonated?.toLocaleString('vi-VN') || 0} VNĐ`, 
            bgcolor: 'success.main',
            subText: '+20.1% so với tháng trước',
            subColor: 'success.main'
          },
          { 
            icon: <TrendingUp />, 
            label: 'Số hộ đã đóng', 
            value: `${campaign.totalDonors}`, 
            bgcolor: 'success.main',
            subColor: 'success.main'
          },
          { 
            icon: <Info />, 
            label: 'Trạng thái', 
            value: <Chip label={campaign.isActive ? 'Đang diễn ra' : 'Kết thúc'} color={campaign.isActive ? 'success' : 'default'} />, 
            bgcolor: 'success.main'
          }
        ].map((stat, idx) => (
          <Grid {...({ item: true, xs: 12, sm: 6, md: 3 } as any)} key={idx}>
            <Card sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                <Avatar sx={{ bgcolor: stat.bgcolor }}>{stat.icon}</Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{stat.label}</Typography>
                  <Typography variant="h5" fontWeight={700}>{stat.value}</Typography>
                  {stat.subText && (
                    <Typography variant="caption" color={stat.subColor}>{stat.subText}</Typography>
                  )}
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid {...({ container: true, spacing: 3 } as any)} sx={{ mb: 4 }}>
        <Grid {...({ item: true, xs: 12, md: 8 } as any)}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Tổng quan đóng góp theo ngày
            </Typography>
            {barData.dates.length > 0 ? (
              <BarChart
                xAxis={[{ data: barData.dates, scaleType: 'band', label: 'Ngày' }]}
                series={[{ data: barData.values, label: 'Số tiền (VNĐ)', color: barSeriesColors[0] }]}
                width={600}
                height={300}
                margin={{ top: 20, bottom: 40, left: 60, right: 20 }}
              />
            ) : (
              <Typography align="center" color="text.secondary">Không có dữ liệu</Typography>
            )}
          </Card>
        </Grid>
        <Grid {...({ item: true, xs: 12, md: 4 } as any)}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Tỉ lệ hoàn thành mục tiêu
            </Typography>
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
          </Card>
        </Grid>
      </Grid>

      {/* Overview Section */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Thông tin tổng quan
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1.5}>
          <Typography><strong>Mô tả:</strong> {campaign.description}</Typography>
          <Typography><strong>Trạng thái:</strong> {campaign.isActive ? 'Đang diễn ra' : 'Kết thúc'}</Typography>
          <Typography><strong>Ngày bắt đầu:</strong> {campaign.startDate}</Typography>
          <Typography><strong>Ngày kết thúc:</strong> {campaign.endDate}</Typography>
          <Typography><strong>Mục tiêu:</strong> {campaign.targetAmount?.toLocaleString('vi-VN') || 0} VNĐ</Typography>
          <Typography><strong>Đã quyên góp:</strong> {campaign.totalDonated?.toLocaleString('vi-VN') || 0} VNĐ</Typography>
          <Typography><strong>Còn thiếu:</strong> {campaign.remainingAmount?.toLocaleString('vi-VN') || 0} VNĐ</Typography>
          <Typography><strong>Người tạo:</strong> {campaign.createdBy}</Typography>
          <Typography><strong>Ngày tạo:</strong> {campaign.createdAt}</Typography>
        </Stack>
      </Card>

      {/* Table Section */}
      <Box>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
          Bảng thống kê các khoản đóng góp
        </Typography>
        <Paper sx={{ p: 2 }}>
          <SmartTable
            columns={columns}
            rows={donations}
            rowCount={donations.length}
            loading={loading}
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

export default DonationCampaignDetailPage;