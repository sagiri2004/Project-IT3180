import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Divider, Stack, Grid, CircularProgress
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import householdService from '../services/household.service';
import { HouseholdDetail } from '../types/household';
import { Gender, RelationshipType, ChangeType } from '../types/enums';

const HouseholdDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [household, setHousehold] = useState<HouseholdDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHouseholdDetails = async () => {
      try {
        setLoading(true);
        const data = await householdService.getById(Number(id));
        setHousehold(data);
      } catch (err) {
        setError('Không thể tải thông tin hộ khẩu');
        console.error('Error fetching household details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHouseholdDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !household) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error || 'Không tìm thấy thông tin hộ khẩu'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <HomeIcon color="primary" /> Chi tiết hộ khẩu
      </Typography>

      <Stack spacing={3}>
        {/* Thông tin hộ khẩu */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HomeIcon color="action" /> Thông tin hộ khẩu
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography><b>Mã hộ:</b> {household.householdCode}</Typography>
                <Typography><b>Chủ hộ:</b> {household.ownerName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography><b>Địa chỉ:</b> {household.address}</Typography>
                <Typography><b>Ngày tạo:</b> {format(new Date(household.registrationDate), 'dd/MM/yyyy', { locale: vi })}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography><b>Số thành viên:</b> <Chip label={household.residentCount} color="primary" /></Typography>
                <Typography><b>Số căn hộ:</b> {household.apartmentNumber}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Danh sách thành viên */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GroupIcon color="action" /> Danh sách thành viên
            </Typography>
            <Divider sx={{ my: 1 }} />
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Họ tên</TableCell>
                    <TableCell>Giới tính</TableCell>
                    <TableCell>Ngày sinh</TableCell>
                    <TableCell>Quan hệ</TableCell>
                    <TableCell>Chủ hộ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {household.members.map((m, idx) => (
                    <TableRow key={m.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{m.fullName}</TableCell>
                      <TableCell>{m.gender === Gender.MALE ? 'Nam' : m.gender === Gender.FEMALE ? 'Nữ' : 'Khác'}</TableCell>
                      <TableCell>{format(new Date(m.dateOfBirth), 'dd/MM/yyyy', { locale: vi })}</TableCell>
                      <TableCell>{m.relationshipWithOwner === RelationshipType.OWNER ? 'Chủ hộ' : 
                        m.relationshipWithOwner === RelationshipType.SPOUSE ? 'Vợ/Chồng' :
                        m.relationshipWithOwner === RelationshipType.CHILD ? 'Con' :
                        m.relationshipWithOwner === RelationshipType.PARENT ? 'Bố/Mẹ' :
                        m.relationshipWithOwner === RelationshipType.SIBLING ? 'Anh/Chị/Em' : 'Khác'}</TableCell>
                      <TableCell>{m.isOwner ? <Chip label="Chủ hộ" color="primary" size="small" /> : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Khoản đóng góp + Khoản phí chưa trả */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VolunteerActivismIcon color="action" /> Khoản đóng góp
                </Typography>
                <Divider sx={{ my: 1 }} />
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Tên khoản</TableCell>
                        <TableCell>Số tiền</TableCell>
                        <TableCell>Ngày đóng</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {household.donations.map((d, idx) => (
                        <TableRow key={d.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{d.campaignName}</TableCell>
                          <TableCell>{d.amount.toLocaleString('vi-VN')} đ</TableCell>
                          <TableCell>{format(new Date(d.donationDate), 'dd/MM/yyyy', { locale: vi })}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReceiptLongIcon color="action" /> Khoản phí chưa trả
                </Typography>
                <Divider sx={{ my: 1 }} />
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Tên khoản</TableCell>
                        <TableCell>Số tiền</TableCell>
                        <TableCell>Tháng</TableCell>
                        <TableCell>Trạng thái</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {household.feeCollections.map((f, idx) => (
                        <TableRow key={f.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{f.feeTypeName}</TableCell>
                          <TableCell>{f.amount.toLocaleString('vi-VN')} đ</TableCell>
                          <TableCell>{f.yearMonth}</TableCell>
                          <TableCell>
                            <Chip 
                              label={f.isPaid ? 'Đã trả' : 'Chưa trả'} 
                              color={f.isPaid ? 'success' : 'error'} 
                              size="small" 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Lịch sử thay đổi nhân khẩu */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryEduIcon color="action" /> Lịch sử thay đổi nhân khẩu
            </Typography>
            <Divider sx={{ my: 1 }} />
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Người</TableCell>
                    <TableCell>Loại</TableCell>
                    <TableCell>Ngày bắt đầu</TableCell>
                    <TableCell>Ngày kết thúc</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Lý do</TableCell>
                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {household.populationChanges.map((p, idx) => (
                    <TableRow key={p.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{p.residentName}</TableCell>
                      <TableCell>
                        {p.changeType === ChangeType.TEMPORARY_ABSENCE ? 'Tạm vắng' :
                         p.changeType === ChangeType.PERMANENT_ABSENCE ? 'Tạm trú' :
                         p.changeType === ChangeType.NEW_RESIDENT ? 'Thêm mới' :
                         p.changeType === ChangeType.RETURN ? 'Trở về' : 'Khác'}
                      </TableCell>
                      <TableCell>{format(new Date(p.startDate), 'dd/MM/yyyy', { locale: vi })}</TableCell>
                      <TableCell>{p.endDate ? format(new Date(p.endDate), 'dd/MM/yyyy', { locale: vi }) : '-'}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{p.reason}</TableCell>
                      <TableCell>
                        <Chip 
                          label={p.isApproved ? 'Đã duyệt' : 'Chưa duyệt'} 
                          color={p.isApproved ? 'success' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default HouseholdDetailPage;