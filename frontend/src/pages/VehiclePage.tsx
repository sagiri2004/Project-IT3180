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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
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
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'householdId', headerName: 'Hộ gia đình', width: 120 },
    { field: 'licensePlate', headerName: 'Biển số', width: 150 },
    { 
      field: 'type', 
      headerName: 'Loại xe', 
      width: 120,
      valueGetter: (params: any) => params?.row?.type === VehicleType.MOTORBIKE ? 'Xe máy' : 'Ô tô'
    },
    { 
      field: 'registeredDate', 
      headerName: 'Ngày đăng ký', 
      width: 150,
      valueGetter: (params: any) => params?.row?.registeredDate 
        ? format(new Date(params.row.registeredDate), 'dd/MM/yyyy') 
        : ''
    },
    { 
      field: 'isActive', 
      headerName: 'Trạng thái', 
      width: 120,
      valueGetter: (params: any) => params?.row?.isActive ? 'Hoạt động' : 'Vô hiệu'
    },
    { field: 'createdBy', headerName: 'Người tạo', width: 150 },
    { 
      field: 'createdAt', 
      headerName: 'Ngày tạo', 
      width: 180,
      valueGetter: (params: any) => params?.row?.createdAt 
        ? format(new Date(params.row.createdAt), 'dd/MM/yyyy HH:mm:ss') 
        : ''
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 220,
      renderCell: (params: any) => (
        <div className="flex gap-2">
          <IconButton 
            className="text-blue-600 hover:bg-blue-100" 
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            className="text-red-600 hover:bg-red-100" 
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
          <Button
            size="small"
            className={`${
              params.row.isActive 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
            onClick={() => handleToggleStatus(params.row.id)}
          >
            {params.row.isActive ? 'Vô hiệu' : 'Kích hoạt'}
          </Button>
        </div>
      ),
    },
  ];

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getVehicles(
        paginationModel.page,
        paginationModel.pageSize
      );
      setVehicles(response.content);
      setTotalRows(response.totalElements);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, [paginationModel]);

  const handleAdd = () => {
    setSelectedVehicle(null);
    setFormData({
      householdId: 0,
      licensePlate: '',
      type: VehicleType.MOTORBIKE,
    });
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
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phương tiện này?')) {
      try {
        await vehicleService.deleteVehicle(Number(id));
        loadVehicles();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await vehicleService.toggleVehicleStatus(Number(id));
      loadVehicles();
    } catch (error) {
      console.error('Error toggling vehicle status:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedVehicle) {
        await vehicleService.updateVehicle(selectedVehicle.id, formData);
      } else {
        await vehicleService.createVehicle(formData);
      }
      setOpenDialog(false);
      loadVehicles();
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-bold text-gray-800">
            Quản lý phương tiện
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Thêm phương tiện
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <SmartTable
            columns={columns}
            rows={vehicles}
            rowCount={totalRows}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onSearch={setSearchValue}
            searchValue={searchValue}
            onAdd={handleAdd}
            addLabel="Thêm phương tiện"
          />
        </div>

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="bg-gray-50 border-b">
            <Typography variant="h6" className="font-semibold">
              {selectedVehicle ? 'Chỉnh sửa phương tiện' : 'Thêm phương tiện mới'}
            </Typography>
          </DialogTitle>
          <DialogContent className="pt-6">
            <div className="space-y-4">
              <TextField
                fullWidth
                label="ID Hộ gia đình"
                type="number"
                value={formData.householdId}
                onChange={(e) => setFormData({ ...formData, householdId: Number(e.target.value) })}
                variant="outlined"
                className="rounded-md"
              />
              <TextField
                fullWidth
                label="Biển số xe"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                variant="outlined"
                className="rounded-md"
              />
              <TextField
                fullWidth
                select
                label="Loại xe"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as VehicleType })}
                variant="outlined"
                className="rounded-md"
              >
                <MenuItem value={VehicleType.MOTORBIKE}>Xe máy</MenuItem>
                <MenuItem value={VehicleType.CAR}>Ô tô</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Ngày đăng ký"
                type="date"
                value={formData.registeredDate || ''}
                onChange={(e) => setFormData({ ...formData, registeredDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                className="rounded-md"
              />
            </div>
          </DialogContent>
          <DialogActions className="bg-gray-50 border-t p-4">
            <Button 
              onClick={() => setOpenDialog(false)}
              className="text-gray-600 hover:bg-gray-100"
            >
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit}
              variant="contained"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {selectedVehicle ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default VehiclePage;