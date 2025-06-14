import React, { useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, Snackbar, Alert, Typography, Card, CardContent, DialogActions, Button } from '@mui/material';
import PopulationChangeList from './PopulationChangeList';
import { PopulationChangeRequest, PopulationChangeResponse } from '../types/populationChange';
import { populationChangeService } from '../services/populationChange.service';
import PopulationChangeForm from '../components/PopulationChangeForm';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

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
        <DialogTitle className="bg-gray-50 border-b">
          <Typography variant="h6" className="font-semibold">
            {selected ? 'Chi tiết thay đổi nhân khẩu' : 'Tạo thay đổi nhân khẩu mới'}
          </Typography>
        </DialogTitle>
        <DialogContent className="pt-6">
          {selected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Loại thay đổi</Typography>
                  <Typography variant="body1" className="font-medium">
                    {selected.changeType === 'IN' ? 'Nhập khẩu' : 'Xuất khẩu'}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Ngày bắt đầu</Typography>
                  <Typography variant="body1" className="font-medium">
                    {format(new Date(selected.startDate), 'dd/MM/yyyy')}
                  </Typography>
                </div>
                {selected.endDate && (
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">Ngày kết thúc</Typography>
                    <Typography variant="body1" className="font-medium">
                      {format(new Date(selected.endDate), 'dd/MM/yyyy')}
                    </Typography>
                  </div>
                )}
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Trạng thái</Typography>
                  <Typography variant="body1" className="font-medium">
                    {selected.endDate ? 'Đã hoàn thành' : 'Đang thực hiện'}
                  </Typography>
                </div>
              </div>
              
              <div>
                <Typography variant="subtitle2" color="textSecondary">Lý do</Typography>
                <Typography variant="body1" className="font-medium">
                  {selected.reason}
                </Typography>
              </div>

              {selected.changeType === 'OUT' && (
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Địa chỉ nơi đến</Typography>
                  <Typography variant="body1" className="font-medium">
                    {selected.destinationAddress}
                  </Typography>
                </div>
              )}

              {selected.changeType === 'IN' && (
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Địa chỉ nơi đi</Typography>
                  <Typography variant="body1" className="font-medium">
                    {selected.sourceAddress}
                  </Typography>
                </div>
              )}

              <div>
                <Typography variant="subtitle2" color="textSecondary">Người dân</Typography>
                <Typography variant="body1" className="font-medium">
                  {selected.residentName}
                </Typography>
              </div>

              <div>
                <Typography variant="subtitle2" color="textSecondary">Hộ gia đình</Typography>
                <Typography variant="body1" className="font-medium">
                  {selected.householdCode}
                </Typography>
              </div>

              <div>
                <Typography variant="subtitle2" color="textSecondary">Trạng thái phê duyệt</Typography>
                <Typography variant="body1" className="font-medium">
                  {selected.isApproved ? 'Đã phê duyệt' : 'Chưa phê duyệt'}
                </Typography>
              </div>

              <div>
                <Typography variant="subtitle2" color="textSecondary">Ngày tạo</Typography>
                <Typography variant="body1" className="font-medium">
                  {format(new Date(selected.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                </Typography>
              </div>
            </div>
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
        <DialogActions className="bg-gray-50 border-t p-4">
          <Button 
            onClick={() => setOpenDialog(false)}
            className="text-gray-600 hover:bg-gray-100"
          >
            Đóng
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

export default PopulationChangePage; 