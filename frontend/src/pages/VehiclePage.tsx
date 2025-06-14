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
  MenuItem,
  IconButton,
  Typography,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, DirectionsCar, TwoWheeler } from '@mui/icons-material';
import SmartTable from '../components/SmartTable';
import { vehicleService } from '../services/vehicle.service';
import { Vehicle, VehicleRequest } from '../types/vehicle';
import { VehicleType } from '../types/enums';
import { format } from 'date-fns';

const VehiclePage: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<VehicleRequest>({
    householdId: 0,
    licensePlate: '',
    type: VehicleType.MOTORBIKE,
    registeredDate: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'householdId', headerName: 'Hộ gia đình', width: 120 },
    { field: 'licensePlate', headerName: 'Biển số', width: 150 },
    {
      field: 'type',
      headerName: 'Loại xe',
      width: 120,
      renderCell: (params: any) => (
        <Box display="flex" alignItems="center" gap={1}>
          {params.row.type === 'CAR' ? <DirectionsCar color="primary" fontSize="small" /> : <TwoWheeler color="secondary" fontSize="small" />}
          <span>{params.row.type === 'CAR' ? 'Ô tô' : 'Xe máy'}</span>
        </Box>
      ),
    },
    {
      field: 'isActive',
      headerName: 'Trạng thái',
      width: 120,
      renderCell: (params: any) => (
        <Chip
          label={params.row.isActive ? 'Hoạt động' : 'Vô hiệu'}
          color={params.row.isActive ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    { field: 'createdBy', headerName: 'Người tạo', width: 120 },

    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => (
        <Box display="flex" gap={1}>
          <IconButton color="primary" onClick={() => handleEdit(params.row)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
          <Button
            size="small"
            variant={params.row.isActive ? 'outlined' : 'contained'}
            color={params.row.isActive ? 'inherit' : 'success'}
            onClick={() => handleToggleStatus(params.row.id)}
          >
            {params.row.isActive ? 'Vô hiệu' : 'Kích hoạt'}
          </Button>
        </Box>
      ),
    },
  ];

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getVehicles(
        paginationModel.page,
        paginationModel.pageSize,
        searchValue
      );
      // response.content, response.totalElements
      setVehicles(response.content || []);
      setTotalRows(response.totalElements || 0);
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi tải dữ liệu phương tiện', severity: 'error' });
      setVehicles([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
    // eslint-disable-next-line
  }, [paginationModel.page, paginationModel.pageSize, searchValue]);

  const handleAdd = () => {
    setSelectedVehicle(null);
    setFormData({
      householdId: 0,
      licensePlate: '',
      type: VehicleType.MOTORBIKE,
      registeredDate: '',
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      householdId: vehicle.householdId,
      licensePlate: vehicle.licensePlate,
      type: vehicle.type,
      registeredDate: vehicle.registeredDate,
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phương tiện này?')) {
      try {
        await vehicleService.deleteVehicle(Number(id));
        setSnackbar({ open: true, message: 'Xóa phương tiện thành công', severity: 'success' });
        loadVehicles();
      } catch (error) {
        setSnackbar({ open: true, message: 'Lỗi xóa phương tiện', severity: 'error' });
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await vehicleService.toggleVehicleStatus(Number(id));
      setSnackbar({ open: true, message: 'Cập nhật trạng thái thành công', severity: 'success' });
      loadVehicles();
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi cập nhật trạng thái', severity: 'error' });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.householdId || formData.householdId <= 0) errors.householdId = 'Nhập ID hộ gia đình';
    if (!formData.licensePlate) errors.licensePlate = 'Nhập biển số xe';
    if (!formData.type) errors.type = 'Chọn loại xe';
    if (!formData.registeredDate) errors.registeredDate = 'Chọn ngày đăng ký';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      if (selectedVehicle) {
        await vehicleService.updateVehicle(selectedVehicle.id, formData);
        setSnackbar({ open: true, message: 'Cập nhật phương tiện thành công', severity: 'success' });
      } else {
        await vehicleService.createVehicle(formData);
        setSnackbar({ open: true, message: 'Thêm phương tiện thành công', severity: 'success' });
      }
      setOpenDialog(false);
      loadVehicles();
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi lưu phương tiện', severity: 'error' });
    }
  };

  return (
      <>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" fontWeight={700}>
            Quản lý phương tiện
          </Typography>
        </Box>
        <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1, p: 2 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
              <CircularProgress />
            </Box>
          ) : (
            <SmartTable
              columns={columns}
              rows={vehicles}
              rowCount={totalRows}
              loading={loading}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onSearch={setSearchValue}
              searchValue={searchValue}
              addLabel="Thêm phương tiện"
              onAdd={handleAdd}
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
              {selectedVehicle ? 'Chỉnh sửa phương tiện' : 'Thêm phương tiện mới'}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                fullWidth
                label="ID Hộ gia đình"
                type="number"
                value={formData.householdId}
                onChange={e => setFormData({ ...formData, householdId: Number(e.target.value) })}
                error={!!formErrors.householdId}
                helperText={formErrors.householdId}
              />
              <TextField
                fullWidth
                label="Biển số xe"
                value={formData.licensePlate}
                onChange={e => setFormData({ ...formData, licensePlate: e.target.value })}
                error={!!formErrors.licensePlate}
                helperText={formErrors.licensePlate}
              />
              <TextField
                fullWidth
                select
                label="Loại xe"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: (e.target.value as string).toUpperCase() as VehicleType })}
                error={!!formErrors.type}
                helperText={formErrors.type}
              >
                <MenuItem value="MOTORBIKE">Xe máy</MenuItem>
                <MenuItem value="CAR">Ô tô</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Ngày đăng ký"
                type="date"
                value={formData.registeredDate || ''}
                onChange={e => setFormData({ ...formData, registeredDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                error={!!formErrors.registeredDate}
                helperText={formErrors.registeredDate}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="inherit">
              Hủy
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              {selectedVehicle ? 'Cập nhật' : 'Thêm mới'}
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
    </>
  );
};

export default VehiclePage;