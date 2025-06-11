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

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'householdId', headerName: 'Hộ gia đình', width: 120 },
    { field: 'monthYear', headerName: 'Tháng/Năm', width: 120 },
    { 
      field: 'type', 
      headerName: 'Loại tiện ích', 
      width: 120,
      valueGetter: (params: any) => {
        switch (params?.row?.type) {
          case UtilityType.ELECTRICITY:
            return 'Điện';
          case UtilityType.WATER:
            return 'Nước';
          case UtilityType.INTERNET:
            return 'Internet';
          default:
            return params?.row?.type || '';
        }
      }
    },
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
      console.error('Error loading bills:', error);
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
    if (!selectedHouseholdId) {
      alert('Vui lòng chọn hộ gia đình trước khi thêm hóa đơn');
      return;
    }
    setSelectedBill(null);
    setFormData({
      householdId: selectedHouseholdId,
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
        loadBills();
      } catch (error) {
        console.error('Error deleting bill:', error);
      }
    }
  };

  const handleMarkAsPaid = async (id: number) => {
    try {
      await utilityBillService.markAsPaid(id);
      loadBills();
    } catch (error) {
      console.error('Error marking bill as paid:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedBill) {
        await utilityBillService.updateUtilityBill(selectedBill.id, formData);
      } else {
        await utilityBillService.createUtilityBill(formData);
      }
      setOpenDialog(false);
      loadBills();
    } catch (error) {
      console.error('Error saving bill:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-bold text-gray-800">
            Quản lý hóa đơn tiện ích
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!selectedHouseholdId}
          >
            Thêm hóa đơn tiện ích
          </Button>
        </div>

        <div className="bg-white rounded-lg

 shadow-md p-6 mb-6">
          <div className="mb-6">
            <FormControl fullWidth className="max-w-xs">
              <InputLabel>Chọn hộ gia đình</InputLabel>
              <Select
                value={selectedHouseholdId}
                label="Chọn hộ gia đình"
                onChange={(e) => setSelectedHouseholdId(e.target.value as number)}
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
          </div>

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
        </div>

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="bg-gray-50 border-b">
            <Typography variant="h6" className="font-semibold">
              {selectedBill ? 'Chỉnh sửa hóa đơn tiện ích' : 'Thêm hóa đơn tiện ích mới'}
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
                select
                label="Loại tiện ích"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as UtilityType })}
                variant="outlined"
                className="rounded-md"
              >
                <MenuItem value={UtilityType.ELECTRICITY}>Điện</MenuItem>
                <MenuItem value={UtilityType.WATER}>Nước</MenuItem>
                <MenuItem value={UtilityType.INTERNET}>Internet</MenuItem>
              </TextField>
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
              {selectedBill ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default UtilityBillPage;