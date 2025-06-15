import React, { useEffect, useRef, useState } from 'react';
import {
  Box, Button, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, MenuItem, Snackbar, Alert, IconButton
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchDonations, createDonation, updateDonation, deleteDonation } from '../store/donationSlice';
import { DonationRequest } from '../types/donation';
import SmartTable from '../components/SmartTable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { Delete as DeleteIcon } from '@mui/icons-material';

const DonationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: donations, total, loading, error } = useSelector((state: RootState) => state.donation);
  // TODO: Replace with real data from store
  const households = [
    { id: 1, code: 'HH001', apartmentNumber: '101' },
    { id: 2, code: 'HH002', apartmentNumber: '102' },
  ];
  const campaigns = [
    { id: 1, name: 'Chiến dịch 1' },
    { id: 2, name: 'Chiến dịch 2' },
  ];
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<DonationRequest>({
    householdId: 0,
    donationCampaignId: 0,
    amount: 0,
    donationDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const debounceRef = useRef<any>();

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [searchKeyword]);

  useEffect(() => {
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  }, [debouncedSearch]);

  useEffect(() => {
    dispatch(fetchDonations({ page: paginationModel.page, size: paginationModel.pageSize, keyword: debouncedSearch }));
  }, [dispatch, paginationModel, debouncedSearch]);

  const handleExport = () => {
    const exportData = donations.map(donation => ({
      'Mã hộ': donation.householdCode,
      'Số căn hộ': donation.apartmentNumber,
      'Chiến dịch': donation.campaignName,
      'Số tiền (VNĐ)': donation.amount,
      'Ngày đóng góp': formatDate(donation.donationDate),
      'Người tạo': donation.createdBy,
      'Ngày tạo': formatDateTime(donation.createdAt),
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách đóng góp');
    XLSX.writeFile(wb, 'danh_sach_dong_gop.xlsx');
  };

  // Helper functions for date formatting
  const formatDate = (date: string | number | Date) => {
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return 'N/A';
      }
      return format(parsedDate, 'dd/MM/yyyy');
    } catch (error) {
      return 'N/A';
    }
  };

  const formatDateTime = (date: string | number | Date) => {
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return 'N/A';
      }
      return format(parsedDate, 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'N/A';
    }
  };

  const columns = [
    { field: 'householdCode', headerName: 'Mã hộ', width: 120 },
    { field: 'apartmentNumber', headerName: 'Số căn hộ', width: 120 },
    { field: 'campaignName', headerName: 'Chiến dịch', flex: 1 },
    {
      field: 'amount',
      headerName: 'Số tiền (VNĐ)',
      width: 140,
      type: 'number' as const,
      editable: true,
      valueFormatter: (params: any) => params.value?.toLocaleString('vi-VN') || '0',
    },
    { field: 'createdBy', headerName: 'Người tạo', width: 120 },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      width: 160,
      renderCell: (params: any) => {
        const date = params.value;
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return date;
        return format(d, 'dd/MM/yyyy HH:mm');
      }
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 100,
      sortable: false,
      renderCell: (params: any) => (
        <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const handleAdd = () => {
    setFormData({
      householdId: 0,
      donationCampaignId: 0,
      amount: 0,
      donationDate: format(new Date(), 'yyyy-MM-dd'),
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      await dispatch(createDonation(formData)).unwrap();
      setSnackbar({ open: true, message: 'Tạo đóng góp thành công', severity: 'success' });
      setOpenDialog(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Tạo đóng góp thất bại', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đóng góp này?')) {
      try {
        await dispatch(deleteDonation(id)).unwrap();
        setSnackbar({ open: true, message: 'Xóa thành công', severity: 'success' });
      } catch {
        setSnackbar({ open: true, message: 'Xóa thất bại', severity: 'error' });
      }
    }
  };

  const handleRowUpdate = async (newRow: any, oldRow: any) => {
    try {
      await dispatch(updateDonation({
        id: newRow.id,
        data: {
          householdId: newRow.householdId,
          donationCampaignId: newRow.donationCampaignId,
          amount: newRow.amount,
          donationDate: newRow.donationDate,
        },
      })).unwrap();
      setSnackbar({ open: true, message: 'Cập nhật thành công', severity: 'success' });
      return newRow;
    } catch (error) {
      setSnackbar({ open: true, message: 'Cập nhật thất bại', severity: 'error' });
      return oldRow;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Quản lý đóng góp
          </Typography>
          <SmartTable
            columns={columns}
            rows={donations}
            rowCount={total}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onSearch={setSearchKeyword}
            searchValue={searchKeyword}
            onAdd={handleAdd}
            onExport={handleExport}
            addLabel="Thêm mới"
            processRowUpdate={handleRowUpdate}
            isCellEditable={(params) => params.field !== 'id' && params.field !== 'householdCode' && params.field !== 'apartmentNumber' && params.field !== 'campaignName'}
          />
        </CardContent>
      </Card>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo đóng góp mới</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              select
              label="Hộ gia đình"
              value={formData.householdId}
              onChange={(e) => setFormData({ ...formData, householdId: Number(e.target.value) })}
              fullWidth
              required
            >
              {households.map((household) => (
                <MenuItem key={household.id} value={household.id}>
                  {household.code} - {household.apartmentNumber}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Chiến dịch"
              value={formData.donationCampaignId}
              onChange={(e) => setFormData({ ...formData, donationCampaignId: Number(e.target.value) })}
              fullWidth
              required
            >
              {campaigns.map((campaign) => (
                <MenuItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Số tiền (VNĐ)"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              fullWidth
              required
              InputProps={{ inputProps: { min: 0 } }}
            />
            <TextField
              label="Ngày đóng góp"
              type="date"
              value={formData.donationDate}
              onChange={(e) => setFormData({ ...formData, donationDate: e.target.value })}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Tạo
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DonationPage;