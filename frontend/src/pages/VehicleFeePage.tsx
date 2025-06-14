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
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Autorenew as AutorenewIcon, EventAvailable as EventAvailableIcon } from '@mui/icons-material';
import SmartTable from '../components/SmartTable';
import { vehicleFeeService } from '../services/vehicleFee.service';
import { vehicleService } from '../services/vehicle.service';
import { VehicleFee, VehicleFeeRequest } from '../types/vehicleFee';
import { Vehicle } from '../types/vehicle';
import { format } from 'date-fns';
import householdService from '../services/household.service';
import { Household } from '../types/household';
import { vehicleFeeConfigService } from '../services/vehicleFeeConfig.service';
import { VehicleFeeConfig, VehicleType, TicketType } from '../types/vehicleFeeConfig';

const TICKET_TYPES = [
  { value: 'MONTHLY', label: 'Vé tháng' },
  { value: 'DAILY', label: 'Vé ngày' },
];

const VehicleFeePage: React.FC = () => {
  const navigate = useNavigate();
  const [fees, setFees] = useState<VehicleFee[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFee, setSelectedFee] = useState<VehicleFee | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<number | ''>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | ''>('');
  const [formData, setFormData] = useState<any>({
    vehicleId: 0,
    ticketType: 'MONTHLY',
    monthYear: format(new Date(), 'yyyy-MM'),
    day: '',
    amount: 0,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [totalRows, setTotalRows] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [dialogHouseholdId, setDialogHouseholdId] = useState<number | ''>('');
  const [dialogVehicles, setDialogVehicles] = useState<Vehicle[]>([]);
  const [dialogVehicleId, setDialogVehicleId] = useState<number | ''>('');
  const [feeConfigs, setFeeConfigs] = useState<VehicleFeeConfig[]>([]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'vehicleId', headerName: 'Phương tiện', width: 120 },
    { field: 'ticketType', headerName: 'Loại vé', width: 110, renderCell: (params: any) => (
      <Chip label={params.row.ticketType === 'DAILY' ? 'Vé ngày' : 'Vé tháng'} color={params.row.ticketType === 'DAILY' ? 'info' : 'primary'} size="small" />
    ) },
    { field: 'monthYear', headerName: 'Tháng/Năm', width: 110 },
    { field: 'day', headerName: 'Ngày', width: 100 },
    { 
      field: 'amount', 
      headerName: 'Số tiền', 
      width: 120,
      valueGetter: (params: any) => params?.row?.amount 
        ? params.row.amount.toLocaleString('vi-VN') + ' VNĐ' 
        : '0 VNĐ'
    },
    { 
      field: 'isPaid', 
      headerName: 'Trạng thái', 
      width: 120,
      renderCell: (params: any) => (
        <Chip label={params.row.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'} color={params.row.isPaid ? 'success' : 'default'} size="small" />
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
          {!params.row.isPaid && params.row.ticketType === 'MONTHLY' && (
            <Button
              size="small"
              variant="outlined"
              color="info"
              startIcon={<AutorenewIcon />}
              onClick={() => handleRenew(params.row)}
            >
              Gia hạn
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

  const loadVehicles = async () => {
    if (!selectedHouseholdId) {
      setVehicles([]);
      return;
    }
    try {
      const response = await vehicleService.getVehiclesByHousehold(
        selectedHouseholdId,
        paginationModel.page,
        paginationModel.pageSize
      );
      setVehicles(response.content);
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi tải phương tiện', severity: 'error' });
    }
  };

  const loadFees = async () => {
    try {
      setLoading(true);
      const response = await vehicleFeeService.getVehicleFees(
        paginationModel.page,
        paginationModel.pageSize
      );
      setFees(response.content);
      setTotalRows(response.totalElements);
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi tải phí gửi xe', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadFeeConfigs = async () => {
    try {
      const data = await vehicleFeeConfigService.getAll();
      setFeeConfigs(data);
    } catch {}
  };

  useEffect(() => {
    loadHouseholds();
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [selectedHouseholdId]);

  useEffect(() => {
    loadFees();
  }, [paginationModel]);

  useEffect(() => { loadFeeConfigs(); }, []);

  const handleAdd = () => {
    setSelectedFee(null);
    setDialogHouseholdId('');
    setDialogVehicles([]);
    setDialogVehicleId('');
    setFormData({
      vehicleId: 0,
      ticketType: 'MONTHLY',
      monthYear: format(new Date(), 'yyyy-MM'),
      day: '',
      amount: 0,
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleDialogHouseholdChange = async (householdId: number | '') => {
    setDialogHouseholdId(householdId);
    setDialogVehicleId('');
    setFormData((prev: any) => ({ ...prev, vehicleId: 0 }));
    if (householdId) {
      try {
        const response = await vehicleService.getVehiclesByHousehold(householdId, 0, 100);
        setDialogVehicles(response.content);
      } catch {
        setDialogVehicles([]);
      }
    } else {
      setDialogVehicles([]);
    }
  };

  const handleDialogVehicleChange = (vehicleId: number | '') => {
    setDialogVehicleId(vehicleId);
    setFormData((prev: any) => ({ ...prev, vehicleId: vehicleId || 0 }));
  };

  const handleEdit = (fee: any) => {
    setSelectedFee(fee);
    const vehicle = vehicles.find(v => v.id === fee.vehicleId);
    const householdId = vehicle ? vehicle.householdId : '';
    setDialogHouseholdId(householdId);
    setDialogVehicleId(fee.vehicleId);
    setDialogVehicles(vehicle ? [vehicle] : []);
    setFormData({
      vehicleId: fee.vehicleId,
      ticketType: fee.ticketType,
      monthYear: fee.monthYear,
      day: fee.day || '',
      amount: fee.amount,
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phí này?')) {
      try {
        await vehicleFeeService.deleteVehicleFee(id);
        setSnackbar({ open: true, message: 'Xóa phí thành công', severity: 'success' });
        loadFees();
      } catch (error) {
        setSnackbar({ open: true, message: 'Lỗi xóa phí', severity: 'error' });
      }
    }
  };

  const handleMarkAsPaid = async (id: number) => {
    try {
      await vehicleFeeService.markAsPaid(id);
      setSnackbar({ open: true, message: 'Đã đánh dấu thanh toán', severity: 'success' });
      loadFees();
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi đánh dấu thanh toán', severity: 'error' });
    }
  };

  const handleRenew = async (fee: any) => {
    try {
      await vehicleFeeService.renewMonthlyTicket(fee.id);
      setSnackbar({ open: true, message: 'Gia hạn vé tháng thành công', severity: 'success' });
      loadFees();
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi gia hạn vé tháng', severity: 'error' });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.amount || formData.amount <= 0) errors.amount = 'Nhập số tiền';
    if (formData.ticketType === 'MONTHLY' && !formData.monthYear) errors.monthYear = 'Chọn tháng/năm';
    if (formData.ticketType === 'DAILY' && !formData.day) errors.day = 'Chọn ngày';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      if (selectedFee) {
        await vehicleFeeService.updateVehicleFee(selectedFee.id, { ...formData, vehicleId: dialogVehicleId });
        setSnackbar({ open: true, message: 'Cập nhật phí thành công', severity: 'success' });
      } else {
        if (formData.ticketType === 'DAILY') {
          await vehicleFeeService.createDayTicket({ ...formData, vehicleId: dialogVehicleId });
        } else {
          await vehicleFeeService.createVehicleFee({ ...formData, vehicleId: dialogVehicleId });
        }
        setSnackbar({ open: true, message: 'Thêm phí thành công', severity: 'success' });
      }
      setOpenDialog(false);
      loadFees();
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi lưu phí', severity: 'error' });
    }
  };

  const handleVehicleOrTicketTypeChange = (vehicleType: VehicleType, ticketType: TicketType) => {
    setFormData(f => {
      const found = feeConfigs.find(cfg => cfg.vehicleType === vehicleType && cfg.ticketType === ticketType);
      return { ...f, vehicleType, ticketType, amount: found ? found.price : 0 };
    });
  };

  return (
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" fontWeight={700}>
            Quản lý phí gửi xe
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{ fontWeight: 600 }}
            >
              Thêm phí gửi xe
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/vehicle-fee-configs')}
              sx={{ ml: 2 }}
            >
              Cấu hình giá vé
            </Button>
          </Box>
        </Box>
        <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1, p: 2 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
              <CircularProgress />
            </Box>
          ) : (
            <SmartTable
              columns={columns}
              rows={fees}
              rowCount={totalRows}
              loading={loading}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onSearch={setSearchValue}
              searchValue={searchValue}
            />
          )}
        </Box>
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              {selectedFee ? 'Chỉnh sửa phí gửi xe' : 'Thêm phí gửi xe mới'}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box display="flex" flexDirection="column" gap={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Hộ gia đình</InputLabel>
                <Select
                  value={dialogHouseholdId}
                  label="Hộ gia đình"
                  onChange={e => handleDialogHouseholdChange(e.target.value as number)}
                >
                  <MenuItem value="">
                    <em>Chọn hộ gia đình</em>
                  </MenuItem>
                  {households.map((household) => (
                    <MenuItem key={household.id} value={household.id}>
                      {household.householdCode} - {household.ownerName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Phương tiện</InputLabel>
                <Select
                  value={dialogVehicleId}
                  label="Phương tiện"
                  onChange={e => handleDialogVehicleChange(e.target.value as number)}
                  disabled={!dialogHouseholdId}
                >
                  <MenuItem value="">
                    <em>Chọn phương tiện</em>
                  </MenuItem>
                  {dialogVehicles.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.licensePlate} - {vehicle.type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Loại xe</InputLabel>
                <Select
                  value={formData.vehicleType}
                  label="Loại xe"
                  onChange={e => handleVehicleOrTicketTypeChange(e.target.value as VehicleType, formData.ticketType)}
                >
                  <MenuItem value="CAR">Ô tô</MenuItem>
                  <MenuItem value="MOTORBIKE">Xe máy</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Loại vé</InputLabel>
                <Select
                  value={formData.ticketType}
                  label="Loại vé"
                  onChange={e => handleVehicleOrTicketTypeChange(formData.vehicleType, e.target.value as TicketType)}
                >
                  <MenuItem value="MONTHLY">Vé tháng</MenuItem>
                  <MenuItem value="DAILY">Vé ngày</MenuItem>
                </Select>
              </FormControl>
              {formData.ticketType === 'MONTHLY' && (
                <TextField
                  fullWidth
                  label="Tháng/Năm"
                  type="month"
                  value={formData.monthYear}
                  onChange={e => setFormData({ ...formData, monthYear: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  error={!!formErrors.monthYear}
                  helperText={formErrors.monthYear}
                />
              )}
              {formData.ticketType === 'DAILY' && (
                <TextField
                  fullWidth
                  label="Ngày"
                  type="date"
                  value={formData.day}
                  onChange={e => setFormData({ ...formData, day: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  error={!!formErrors.day}
                  helperText={formErrors.day}
                />
              )}
              <TextField
                fullWidth
                label="Số tiền (VNĐ)"
                type="number"
                value={formData.amount}
                error={!!formErrors.amount}
                helperText={formErrors.amount}
                disabled
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="inherit">
              Hủy
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              {selectedFee ? 'Cập nhật' : 'Thêm mới'}
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
  );
};

export default VehicleFeePage;