import React, { useEffect, useRef, useState } from 'react';
import {
  Box, Button, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Snackbar, Alert, IconButton, Chip, LinearProgress
} from '@mui/material';
import { Delete as DeleteIcon, FileDownload as FileDownloadIcon, Add as AddIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchDonationCampaigns, createDonationCampaign, updateDonationCampaign, deleteDonationCampaign } from '../store/donationCampaignSlice';
import { DonationCampaignRequest } from '../types/donationCampaign';
import SmartTable from '../components/SmartTable';
import { GridColDef } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const DonationCampaignPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: campaigns, total, loading, error } = useSelector((state: RootState) => state.donationCampaign);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<DonationCampaignRequest>({
    name: '',
    description: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    targetAmount: 0,
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
    dispatch(fetchDonationCampaigns({ page: paginationModel.page, size: paginationModel.pageSize, keyword: debouncedSearch }));
  }, [dispatch, paginationModel, debouncedSearch]);

  const handleExport = () => {
    const exportData = campaigns.map(campaign => ({
      'ID': campaign.id,
      'Tên chiến dịch': campaign.name,
      'Mô tả': campaign.description,
      'Ngày bắt đầu': format(new Date(campaign.startDate), 'dd/MM/yyyy'),
      'Ngày kết thúc': campaign.endDate ? format(new Date(campaign.endDate), 'dd/MM/yyyy') : '',
      'Mục tiêu (VNĐ)': campaign.targetAmount?.toLocaleString('vi-VN'),
      'Đã quyên góp (VNĐ)': campaign.totalDonated?.toLocaleString('vi-VN'),
      'Còn thiếu (VNĐ)': campaign.remainingAmount?.toLocaleString('vi-VN'),
      'Số hộ đã đóng': campaign.totalDonors,
      'Trạng thái': campaign.isActive ? 'Đang diễn ra' : 'Kết thúc',
      'Người tạo': campaign.createdBy,
      'Ngày tạo': format(new Date(campaign.createdAt), 'dd/MM/yyyy HH:mm'),
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách chiến dịch');
    XLSX.writeFile(wb, 'danh_sach_chien_dich.xlsx');
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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Tên chiến dịch', flex: 1, editable: true },
    { field: 'description', headerName: 'Mô tả', flex: 2, editable: true },
    {
      field: 'progress',
      headerName: 'Tiến độ',
      width: 180,
      renderCell: (params: any) => {
        const percent = params.row.targetAmount
          ? Math.round((params.row.totalDonated / params.row.targetAmount) * 100)
          : 0;
        return (
          <Box sx={{ width: '100%', position: 'relative' }}>
            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{
                height: 16,
                borderRadius: 8,
                backgroundColor: percent >= 100 ? 'success.light' : 'primary.light',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: percent >= 100 ? 'success.main' : 'primary.main',
                },
              }}
            />
            <Box sx={{ position: 'absolute', left: 8, top: 0, color: '#fff', fontWeight: 600 }}>
              {percent} %
            </Box>
          </Box>
        );
      }
    },
    {
      field: 'isActive',
      headerName: 'Trạng thái',
      width: 140,
      renderCell: (params: any) => (
        <Chip
          label={params.value ? 'Đang diễn ra' : 'Kết thúc'}
          color={params.value ? 'success' : 'default'}
          variant="outlined"
        />
      )
    },
    {
      field: 'startDate',
      headerName: 'Ngày bắt đầu',
      width: 120,
      type: 'date',
      valueGetter: (params: any) => params && params.value ? new Date(params.value) : null,
      valueFormatter: (params: any) => (params && params.value ? formatDate(params.value) : 'N/A'),
    },
    {
      field: 'endDate', 
      headerName: 'Ngày kết thúc',
      width: 120,
      type: 'date',
      valueGetter: (params: any) => params && params.value ? new Date(params.value) : null,
      valueFormatter: (params: any) => (params && params.value ? formatDate(params.value) : '-'),
    },
    {
      field: 'targetAmount',
      headerName: 'Mục tiêu (VNĐ)',
      width: 140,
      type: 'number' as const,
      valueFormatter: (params: any) => (params && params.value != null ? params.value.toLocaleString('vi-VN') : '-'),
    },
    {
      field: 'totalDonated',
      headerName: 'Đã quyên góp (VNĐ)',
      width: 140,
      type: 'number' as const,
      valueFormatter: (params: any) => (params && params.value != null ? params.value.toLocaleString('vi-VN') : '0'),
    },
    {
      field: 'remainingAmount',
      headerName: 'Còn thiếu (VNĐ)',
      width: 140,
      type: 'number' as const,
      valueFormatter: (params: any) => (params && params.value != null ? params.value.toLocaleString('vi-VN') : '-'),
    },
    {
      field: 'totalDonors',
      headerName: 'Số hộ đã đóng',
      width: 120,
      type: 'number' as const,
    },
    { field: 'createdBy', headerName: 'Người tạo', width: 120 },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      width: 160,
      type: 'dateTime',
      valueGetter: (params: any) => params && params.value ? new Date(params.value) : null,
      valueFormatter: (params: any) => (params && params.value ? formatDateTime(params.value) : 'N/A'),
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 140,
      sortable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="primary" onClick={() => navigate(`/donation-campaigns/${params.row.id}`)} title="Xem chi tiết">
            <VisibilityIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)} title="Xóa">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleAdd = () => {
    setFormData({
      name: '',
      description: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: '',
      targetAmount: 0,
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      await dispatch(createDonationCampaign(formData)).unwrap();
      setSnackbar({ open: true, message: 'Tạo chiến dịch thành công', severity: 'success' });
      setOpenDialog(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Tạo chiến dịch thất bại', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chiến dịch này?')) {
      try {
        await dispatch(deleteDonationCampaign(id)).unwrap();
        setSnackbar({ open: true, message: 'Xóa thành công', severity: 'success' });
      } catch {
        setSnackbar({ open: true, message: 'Xóa thất bại', severity: 'error' });
      }
    }
  };

  const handleRowUpdate = async (newRow: any, oldRow: any) => {
    try {
      await dispatch(updateDonationCampaign({
        id: newRow.id,
        data: {
          name: newRow.name,
          description: newRow.description,
          startDate: newRow.startDate,
          endDate: newRow.endDate,
          targetAmount: newRow.targetAmount,
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
            Quản lý chiến dịch
          </Typography>
          <SmartTable
            columns={columns}
            rows={campaigns}
            rowCount={total}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onSearch={setSearchKeyword}
            searchValue={searchKeyword}
            onExport={handleExport}
            onAdd={handleAdd}
            processRowUpdate={handleRowUpdate}
          />
        </CardContent>
      </Card>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo chiến dịch quyên góp mới</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Tên chiến dịch"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
              required
            />
            <TextField
              label="Ngày bắt đầu"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Ngày kết thúc"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Mục tiêu (VNĐ)"
              type="number"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
              fullWidth
              InputProps={{ inputProps: { min: 0 } }}
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

export default DonationCampaignPage;