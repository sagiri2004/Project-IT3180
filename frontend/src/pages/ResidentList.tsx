import React, { useEffect, useRef, useState } from 'react';
import {
  Box, Button, Card, CardContent, IconButton, InputAdornment, TextField, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Snackbar, Alert
} from '@mui/material';
import {
  Add as AddIcon, Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchResidents, deleteResident, updateResident, createResident } from '../store/slices/residentSlice';
import { Resident, CreateResidentRequest, Gender, RelationshipType, UpdateResidentRequest } from '../types/resident';
import SmartTable from '../components/SmartTable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const ResidentList: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { residents, isLoading, totalElements } = useSelector((state: RootState) => state.resident);

  // State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const debounceRef = useRef<any>();
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState<CreateResidentRequest>({
    fullName: '',
    dateOfBirth: '',
    gender: Gender.MALE,
    idCardNumber: '',
    relationshipWithOwner: RelationshipType.OWNER,
    isOwner: false,
    householdId: 0
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

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
    dispatch(fetchResidents({
      page: paginationModel.page,
      size: paginationModel.pageSize,
      keyword: debouncedSearch
    }));
  }, [dispatch, paginationModel, debouncedSearch]);

  // Excel Export
  const handleExport = () => {
    const exportData = residents.map(r => ({
      'Họ tên': r.fullName,
      'Ngày sinh': new Date(r.dateOfBirth).toLocaleDateString('vi-VN'),
      'Giới tính': r.gender === 'MALE' ? 'Nam' : r.gender === 'FEMALE' ? 'Nữ' : 'Khác',
      'CMND/CCCD': r.idCardNumber,
      'Mã hộ khẩu': r.householdCode,
      'Quan hệ với chủ hộ': r.relationshipWithOwner,
      'Chủ hộ': r.isOwner ? 'Có' : 'Không'
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách nhân khẩu');
    XLSX.writeFile(wb, 'danh_sach_nhan_khau.xlsx');
  };

  // Inline edit
  const handleProcessRowUpdate = async (newRow: Resident, oldRow: Resident) => {
    try {
      const updateData: UpdateResidentRequest = {
        id: newRow.id,
        fullName: newRow.fullName,
        dateOfBirth: newRow.dateOfBirth,
        gender: newRow.gender,
        idCardNumber: newRow.idCardNumber,
        relationshipWithOwner: newRow.relationshipWithOwner,
        isOwner: newRow.isOwner,
        householdId: newRow.householdId
      };
      await dispatch(updateResident(updateData)).unwrap();
      setSnackbar({ open: true, message: 'Cập nhật thành công', severity: 'success' });
      // Reload lại dữ liệu trang hiện tại
      dispatch(fetchResidents({
        page: paginationModel.page,
        size: paginationModel.pageSize,
        keyword: debouncedSearch
      }));
      return { ...newRow };
    } catch (error: any) {
      setSnackbar({ open: true, message: error?.message || 'Cập nhật thất bại', severity: 'error' });
      return oldRow;
    }
  };

  // Add new
  const handleAdd = () => {
    setFormValues({
      fullName: '',
      dateOfBirth: '',
      gender: Gender.MALE,
      idCardNumber: '',
      relationshipWithOwner: RelationshipType.OWNER,
      isOwner: false,
      householdId: 0
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    await dispatch(createResident(formValues)).unwrap();
    setOpenDialog(false);
    setSnackbar({ open: true, message: 'Thêm mới thành công', severity: 'success' });
    dispatch(fetchResidents({
      page: paginationModel.page,
      size: paginationModel.pageSize,
      keyword: debouncedSearch
    }));
  };

  // Columns
  const genderMap: Record<string, string> = {
    MALE: 'Nam',
    FEMALE: 'Nữ',
    OTHER: 'Khác',
  };
  const relationshipMap: Record<string, string> = {
    OWNER: 'Chủ hộ',
    SPOUSE: 'Vợ/Chồng',
    CHILD: 'Con',
    PARENT: 'Bố/Mẹ',
    SIBLING: 'Anh/Chị/Em',
    GRANDPARENT: 'Ông/Bà',
    OTHER: 'Khác',
  };
  const columns = [
    { field: 'fullName', headerName: 'Họ tên', width: 180, editable: true },
    {
      field: 'dateOfBirth',
      headerName: 'Ngày sinh',
      width: 120,
      editable: true,
      renderCell: (params: any) => {
        const date = params.value;
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return date;
        return format(d, 'dd/MM/yyyy');
      }
    },
    {
      field: 'gender',
      headerName: 'Giới tính',
      width: 100,
      editable: true,
      type: 'singleSelect' as const,
      valueOptions: [
        { value: Gender.MALE, label: 'Nam' },
        { value: Gender.FEMALE, label: 'Nữ' },
        { value: Gender.OTHER, label: 'Khác' }
      ],
      valueFormatter: (params: any) => genderMap[params.value] || params.value,
    },
    { field: 'idCardNumber', headerName: 'CMND/CCCD', width: 140, editable: true },
    { field: 'householdCode', headerName: 'Mã hộ khẩu', width: 120 },
    {
      field: 'relationshipWithOwner',
      headerName: 'Quan hệ với chủ hộ',
      width: 150,
      editable: true,
      type: 'singleSelect' as const,
      valueOptions: Object.values(RelationshipType).map(v => ({ value: v, label: relationshipMap[v] || v })),
      valueFormatter: (params: any) => relationshipMap[params.value] || params.value,
    },
    {
      field: 'isOwner',
      headerName: 'Chủ hộ',
      width: 90,
      type: 'boolean' as const,
      editable: true,
      valueFormatter: (params: any) => params.value ? '✓' : '',
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      width: 160,
      renderCell: (params: any) => {
        const date = params.value;
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return date;
        return format(d, 'dd/MM/yyyy HH:mm:ss');
      }
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 100,
      sortable: false,
      renderCell: (params: any) => (
        <Box>
          <IconButton color="error" onClick={() => dispatch(deleteResident(params.row.id))}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Quản lý nhân khẩu
          </Typography>
          <SmartTable
            columns={columns}
            rows={residents}
            rowCount={totalElements}
            loading={isLoading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onSearch={setSearchKeyword}
            searchValue={searchKeyword}
            onAdd={handleAdd}
            onExport={handleExport}
            processRowUpdate={handleProcessRowUpdate}
          />
        </CardContent>
      </Card>
      {/* Dialog thêm mới */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm nhân khẩu mới</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Họ tên"
            fullWidth
            value={formValues.fullName}
            onChange={e => setFormValues({ ...formValues, fullName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Ngày sinh"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formValues.dateOfBirth}
            onChange={e => setFormValues({ ...formValues, dateOfBirth: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Giới tính"
            select
            fullWidth
            value={formValues.gender}
            onChange={e => setFormValues({ ...formValues, gender: e.target.value as Gender })}
          >
            <MenuItem value={Gender.MALE}>Nam</MenuItem>
            <MenuItem value={Gender.FEMALE}>Nữ</MenuItem>
            <MenuItem value={Gender.OTHER}>Khác</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="CMND/CCCD"
            fullWidth
            value={formValues.idCardNumber}
            onChange={e => setFormValues({ ...formValues, idCardNumber: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Mã hộ khẩu (ID)"
            type="number"
            fullWidth
            value={formValues.householdId}
            onChange={e => setFormValues({ ...formValues, householdId: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Quan hệ với chủ hộ"
            select
            fullWidth
            value={formValues.relationshipWithOwner}
            onChange={e => setFormValues({ ...formValues, relationshipWithOwner: e.target.value as RelationshipType })}
          >
            {Object.values(RelationshipType).map(v => (
              <MenuItem key={v} value={v}>{relationshipMap[v] || v}</MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Chủ hộ"
            select
            fullWidth
            value={formValues.isOwner ? 'true' : 'false'}
            onChange={e => setFormValues({ ...formValues, isOwner: e.target.value === 'true' })}
          >
            <MenuItem value="true">Có</MenuItem>
            <MenuItem value="false">Không</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">Thêm mới</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResidentList; 