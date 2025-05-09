import React, { useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, Snackbar, Alert, Typography, Card, CardContent } from '@mui/material';
import PopulationChangeList from './PopulationChangeList';
import { PopulationChangeRequest, PopulationChangeResponse } from '../types/populationChange';
import { populationChangeService } from '../services/populationChange.service';
import PopulationChangeForm from '../components/PopulationChangeForm';
import * as XLSX from 'xlsx';

const PopulationChangePage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<PopulationChangeResponse | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [reload, setReload] = useState(0);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleAdd = () => {
    setSelected(null);
    setOpenDialog(true);
  };

  const handleView = (row: PopulationChangeResponse) => {
    setSelected(row);
    setOpenDialog(true);
  };

  const handleApprove = async (id: number) => {
    try {
      await populationChangeService.approve(id);
      setSnackbar({ open: true, message: 'Chấp nhận thành công', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Chấp nhận thất bại', severity: 'error' });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await populationChangeService.reject(id);
      setSnackbar({ open: true, message: 'Từ chối thành công', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Từ chối thất bại', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await populationChangeService.delete(id);
      setSnackbar({ open: true, message: 'Xóa thành công', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Xóa thất bại', severity: 'error' });
    }
  };

  const handleCreate = async (values: PopulationChangeRequest) => {
    try {
      await populationChangeService.create(values);
      setSnackbar({ open: true, message: 'Tạo mới thành công', severity: 'success' });
      setOpenDialog(false);
      setReload(r => r + 1);
    } catch {
      setSnackbar({ open: true, message: 'Tạo mới thất bại', severity: 'error' });
    }
  };

  const handleExport = () => {
    const exportData = document.querySelectorAll('table tbody tr');
    const rows = Array.from(exportData).map(tr =>
      Array.from(tr.querySelectorAll('td')).map(td => td.textContent)
    );
    const header = [
      'ID', 'Tên nhân khẩu', 'Mã hộ', 'Loại thay đổi', 'Ngày bắt đầu', 'Ngày kết thúc', 'Duyệt', 'Ngày tạo'
    ];
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Population Changes');
    XLSX.writeFile(wb, 'population_changes.xlsx');
  };

  const handleSearch = (value: string) => setSearchValue(value);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Quản lý nhân khẩu</Typography>
      <PopulationChangeList 
        onAdd={handleAdd}
        onView={handleView}
        onApprove={async (id) => { await handleApprove(id); setReload(r => r + 1); }}
        onReject={async (id) => { await handleReject(id); setReload(r => r + 1); }}
        onDelete={async (id) => { await handleDelete(id); setReload(r => r + 1); }}
        reload={reload}
        showPendingOnly={showPendingOnly}
        setShowPendingOnly={setShowPendingOnly}
        onExport={handleExport}
        searchValue={searchValue}
        onSearch={handleSearch}
      />
              </CardContent>
              </Card>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? 'Chi tiết thay đổi nhân khẩu' : 'Tạo thay đổi nhân khẩu mới'}</DialogTitle>
        <DialogContent>
          {selected ? (
            <pre>{JSON.stringify(selected, null, 2)}</pre>
          ) : (
            <PopulationChangeForm
              initialValues={{
                residentId: 0,
                householdId: undefined,
                changeType: '',
                startDate: '',
                endDate: '',
                reason: '',
                destinationAddress: '',
                sourceAddress: '',
              }}
              onSubmit={handleCreate}
              onCancel={() => setOpenDialog(false)}
            />
          )}
        </DialogContent>
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

export default PopulationChangePage; 