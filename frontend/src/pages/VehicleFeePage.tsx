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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import SmartTable from '../components/SmartTable';
import { vehicleFeeService } from '../services/vehicleFee.service';
import { vehicleService } from '../services/vehicle.service';
import { VehicleFee, VehicleFeeRequest } from '../types/vehicleFee';
import { Vehicle } from '../types/vehicle';
import { format } from 'date-fns';
import householdService from '../services/household.service';
import { Household } from '../types/household';

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
  const [formData, setFormData] = useState<VehicleFeeRequest>({
    vehicleId: 0,
    monthYear: format(new Date(), 'yyyy-MM'),
    amount: 0,
  });
  const [totalRows, setTotalRows] = useState(0);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'vehicleId', headerName: 'Phương tiện', width: 120 },
    { field: 'monthYear', headerName: 'Tháng/Năm', width: 120 },
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
      valueGetter: (params: any) => params?.row?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'
    },
    { 
      field: 'paidDate', 
      headerName: 'Ngày thanh toán', 
      width: 150,
      valueGetter: (params: any) => params?.row?.paidDate 
        ? format(new Date(params.row.paidDate), 'dd/MM/yyyy') 
        : ''
    },
    { field: 'paidBy', headerName: 'Người thanh toán', width: 150 },
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
      width: 250,
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
          {!params.row.isPaid && (
            <Button
              size="small"
              className="bg-green-100 text-green-700 hover:bg-green-200"
              onClick={() => handleMarkAsPaid(params.row.id)}
            >
              Đã thanh toán
            </Button>
          )}
        </div>
      ),
    },
  ];

  const loadHouseholds = async () => {
    try {
      const response = await householdService.getHouseholds();
      setHouseholds(response.content);
    } catch (error) {
      console.error('Error loading households:', error);
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
      console.error('Error loading vehicles:', error);
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
      console.error('Error loading fees:', error);
    } finally {
      setLoading(false);
    }
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

  const handleAdd = () => {
    if (!selectedVehicleId) {
      alert('Vui lòng chọn phương tiện trước khi thêm phí');
      return;
    }
    setSelectedFee(null);
    setFormData({
      vehicleId: selectedVehicleId,
      monthYear: format(new Date(), 'yyyy-MM'),
      amount: 0,
    });
    setOpenDialog(true);
  };

  const handleEdit = (fee: VehicleFee) => {
    setSelectedFee(fee);
    setFormData({
      vehicleId: fee.vehicleId,
      monthYear: fee.monthYear,
      amount: fee.amount,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phí này?')) {
      try {
        await vehicleFeeService.deleteVehicleFee(id);
        loadFees();
      } catch (error) {
        console.error('Error deleting fee:', error);
      }
    }
  };

  const handleMarkAsPaid = async (id: number) => {
    try {
      await vehicleFeeService.markAsPaid(id);
      loadFees();
    } catch (error) {
      console.error('Error marking fee as paid:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedFee) {
        await vehicleFeeService.updateVehicleFee(selectedFee.id, formData);
      } else {
        await vehicleFeeService.createVehicleFee(formData);
      }
      setOpenDialog(false);
      loadFees();
    } catch (error) {
      console.error('Error saving fee:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-bold text-gray-800">
            Quản lý phí gửi xe
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!selectedVehicleId}
          >
            Thêm phí gửi xe
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <FormControl fullWidth className="max-w-xs">
              <InputLabel>Chọn hộ gia đình</InputLabel>
              <Select
                value={selectedHouseholdId}
                label="Chọn hộ gia đình"
                onChange={(e) => {
                  setSelectedHouseholdId(e.target.value as number);
                  setSelectedVehicleId('');
                }}
                className="rounded-md"
              >
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>
                {households.map((household) => (
                  <MenuItem key={household.id} value={household.id}>
                    {household.householdCode} - {household.ownerName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth className="max-w-xs">
              <InputLabel>Chọn phương tiện</InputLabel>
              <Select
                value={selectedVehicleId}
                label="Chọn phương tiện"
                onChange={(e) => setSelectedVehicleId(e.target.value as number)}
                disabled={!selectedHouseholdId}
                className="rounded-md"
              >
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.licensePlate} - {vehicle.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

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
        </div>

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="bg-gray-50 border-b">
            <Typography variant="h6" className="font-semibold">
              {selectedFee ? 'Chỉnh sửa phí gửi xe' : 'Thêm phí gửi xe mới'}
            </Typography>
          </DialogTitle>
          <DialogContent className="pt-6">
            <div className="space-y-4">
              <TextField
                fullWidth
                label="Tháng/Năm"
                type="month"
                value={formData.monthYear}
                onChange={(e) => setFormData({ ...formData, monthYear: e.target.value })}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                className="rounded-md"
              />
              <TextField
                fullWidth
                label="Số tiền (VNĐ)"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
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
              {selectedFee ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default VehicleFeePage;