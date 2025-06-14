import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, EventAvailable as EventAvailableIcon } from '@mui/icons-material';
import SmartTable from '../components/SmartTable';
import { utilityBillService } from '../services/utilityBill.service';
import { UtilityBill, UtilityBillRequest } from '../types/utilityBill';
import { UtilityType } from '../types/enums';
import { format } from 'date-fns';
import householdService from '../services/household.service';
import { Household } from '../types/household';

const UtilityBillPage: React.FC = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState<UtilityBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState<UtilityBill | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<number | ''>('');
  const [formData, setFormData] = useState<UtilityBillRequest>({
    householdId: 0,
    monthYear: format(new Date(), 'yyyy-MM'),
    type: UtilityType.ELECTRICITY,
    amount: 0,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'householdId', headerName: 'Hộ gia đình', width: 120 },
    { field: 'monthYear', headerName: 'Tháng/Năm', width: 120 },
    { 
      field: 'type', 
      headerName: 'Loại tiện ích', 
      width: 120,
      renderCell: (params: any) => {
        const type = (params?.row?.type || '').toUpperCase();
        let color: 'primary' | 'secondary' | 'info' = 'primary';
        let label = type;
        switch (type) {
          case 'ELECTRICITY':
            color = 'primary';
            label = 'ĐIỆN';
            break;
          case 'WATER':
            color = 'info';
            label = 'NƯỚC';
            break;
          case 'INTERNET':
            color = 'secondary';
            label = 'INTERNET';
            break;
          default:
            label = type;
        }
        return <Chip label={label} color={color} size="small" />;
      }
    },
    { field: 'amount', headerName: 'Số tiền', width: 120 },
    { 
      field: 'isPaid', 
      headerName: 'Trạng thái', 
      width: 120,
      renderCell: (params: any) => (
        <Chip 
          label={params.row.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'} 
          color={params.row.isPaid ? 'success' : 'default'} 
          size="small" 
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 280,
      renderCell: (params: any) => (
        <Box display="flex" gap={1}>
          <IconButton color="primary" onClick={() => handleEdit(params.row)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
          {!params.row.isPaid && (
            <Button
              size="small"
              variant="outlined"
              color="success"
              startIcon={<EventAvailableIcon />}
              onClick={() => handleMarkAsPaid(params.row.id)}
            >
              Thanh toán
            </Button>
          )}
        </Box>
      ),
    },
  ];

  const loadHouseholds = async () => {
    try {
      const response = await householdService.getHouseholds();
      setHouseholds(response.content);
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi tải hộ gia đình', severity: 'error' });
    }
  };

  const loadBills = async () => {
    try {
      setLoading(true);
      let response;
      if (selectedHouseholdId) {
        response = await utilityBillService.getUtilityBillsByHousehold(
          selectedHouseholdId,
          paginationModel.page,
          paginationModel.pageSize
        );
      } else {
        response = await utilityBillService.getUtilityBills(
          paginationModel.page,
          paginationModel.pageSize
        );
      }
      setBills(response.content);
      setTotalRows(response.totalElements);
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi tải hóa đơn', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHouseholds();
  }, []);

  useEffect(() => {
    loadBills();
  }, [selectedHouseholdId, paginationModel]);

  const handleAdd = () => {
    setSelectedBill(null);
    setFormData({
      householdId: selectedHouseholdId || 0,
      monthYear: format(new Date(), 'yyyy-MM'),
      type: UtilityType.ELECTRICITY,
      amount: 0,
    });
    setOpenDialog(true);
  };

  const handleEdit = (bill: UtilityBill) => {
    setSelectedBill(bill);
    setFormData({
      householdId: bill.householdId,
      monthYear: bill.monthYear,
      type: bill.type,
      amount: bill.amount,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      try {
        await utilityBillService.deleteUtilityBill(id);
        setSnackbar({ open: true, message: 'Xóa hóa đơn thành công', severity: 'success' });
        loadBills();
      } catch (error) {
        setSnackbar({ open: true, message: 'Lỗi xóa hóa đơn', severity: 'error' });
      }
    }
  };

  const handleMarkAsPaid = async (id: number) => {
    try {
      await utilityBillService.markAsPaid(id);
      setSnackbar({ open: true, message: 'Đã đánh dấu thanh toán', severity: 'success' });
      loadBills();
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi đánh dấu thanh toán', severity: 'error' });
    }
  };

  // Convert FE enum (lowercase) to BE enum (uppercase)
  function toBackendUtilityType(type: UtilityType | string): string {
    switch ((type || '').toLowerCase()) {
      case 'electricity': return 'ELECTRICITY';
      case 'water': return 'WATER';
      case 'internet': return 'INTERNET';
      default: return (type || '').toUpperCase();
    }
  }

  const handleSubmit = async () => {
    try {
      const submitData = { ...formData, type: toBackendUtilityType(formData.type) as any };
      if (selectedBill) {
        await utilityBillService.updateUtilityBill(selectedBill.id, submitData);
        setSnackbar({ open: true, message: 'Cập nhật hóa đơn thành công', severity: 'success' });
      } else {
        await utilityBillService.createUtilityBill(submitData);
        setSnackbar({ open: true, message: 'Thêm hóa đơn thành công', severity: 'success' });
      }
      setOpenDialog(false);
      loadBills();
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi lưu hóa đơn', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f6fa', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Paper sx={{ p: 2, borderRadius: 2, width: '100%' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h4" fontWeight={700}>
              Quản lý hóa đơn tiện ích
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                sx={{ fontWeight: 600 }}
              >
                Thêm hóa đơn tiện ích
              </Button>
            </Box>
          </Box>


          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
              <CircularProgress />
            </Box>
          ) : (
            <SmartTable
              columns={columns}
              rows={bills}
              rowCount={totalRows}
              loading={loading}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onSearch={setSearchValue}
              searchValue={searchValue}
            />
          )}
        </Paper>

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              {selectedBill ? 'Chỉnh sửa hóa đơn tiện ích' : 'Thêm hóa đơn tiện ích mới'}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box display="flex" flexDirection="column" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Hộ gia đình</InputLabel>
                <Select
                  value={formData.householdId}
                  label="Hộ gia đình"
                  onChange={e => setFormData({ ...formData, householdId: e.target.value as number })}
                >
                  <MenuItem value={0} disabled><em>Chọn hộ gia đình</em></MenuItem>
                  {households.map((household) => (
                    <MenuItem key={household.id} value={household.id}>
                      {household.householdCode} - {household.ownerName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Tháng/Năm"
                type="month"
                value={formData.monthYear}
                onChange={(e) => setFormData({ ...formData, monthYear: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel>Loại tiện ích</InputLabel>
                <Select
                  value={formData.type}
                  label="Loại tiện ích"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as UtilityType })}
                >
                  <MenuItem value={UtilityType.ELECTRICITY}>Điện</MenuItem>
                  <MenuItem value={UtilityType.WATER}>Nước</MenuItem>
                  <MenuItem value={UtilityType.INTERNET}>Internet</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Số tiền (VNĐ)"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="inherit">
              Hủy
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              {selectedBill ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default UtilityBillPage;