import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, IconButton, Snackbar, Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { vehicleFeeConfigService } from '../services/vehicleFeeConfig.service';
import { VehicleFeeConfig, VehicleType, TicketType } from '../types/vehicleFeeConfig';

const VEHICLE_TYPES: VehicleType[] = ['CAR', 'MOTORBIKE'];
const TICKET_TYPES: TicketType[] = ['MONTHLY', 'DAILY'];

const VehicleFeeConfigPage: React.FC = () => {
  const [configs, setConfigs] = useState<VehicleFeeConfig[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingConfig, setEditingConfig] = useState<VehicleFeeConfig | null>(null);
  const [form, setForm] = useState<Omit<VehicleFeeConfig, 'id'>>({
    vehicleType: 'CAR',
    ticketType: 'MONTHLY',
    price: 0,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const loadConfigs = async () => {
    try {
      const data = await vehicleFeeConfigService.getAll();
      setConfigs(data);
    } catch {
      setSnackbar({ open: true, message: 'Lỗi tải cấu hình', severity: 'error' });
    }
  };

  useEffect(() => { loadConfigs(); }, []);

  const handleOpenDialog = (config?: VehicleFeeConfig) => {
    if (config) {
      setEditingConfig(config);
      setForm({ vehicleType: config.vehicleType, ticketType: config.ticketType, price: config.price });
    } else {
      setEditingConfig(null);
      setForm({ vehicleType: 'CAR', ticketType: 'MONTHLY', price: 0 });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingConfig) {
        await vehicleFeeConfigService.update(editingConfig.id, form);
        setSnackbar({ open: true, message: 'Cập nhật thành công', severity: 'success' });
      } else {
        await vehicleFeeConfigService.create(form);
        setSnackbar({ open: true, message: 'Thêm mới thành công', severity: 'success' });
      }
      setOpenDialog(false);
      loadConfigs();
    } catch {
      setSnackbar({ open: true, message: 'Lỗi lưu cấu hình', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Xác nhận xóa cấu hình này?')) return;
    try {
      await vehicleFeeConfigService.delete(id);
      setSnackbar({ open: true, message: 'Xóa thành công', severity: 'success' });
      loadConfigs();
    } catch {
      setSnackbar({ open: true, message: 'Lỗi xóa cấu hình', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} mb={3}>Cấu hình giá vé gửi xe</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
        Thêm cấu hình
      </Button>
      <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1, p: 2 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Loại xe</th>
              <th>Loại vé</th>
              <th>Giá (VNĐ)</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {configs.map(cfg => (
              <tr key={cfg.id}>
                <td>{cfg.vehicleType === 'CAR' ? 'Ô tô' : 'Xe máy'}</td>
                <td>{cfg.ticketType === 'MONTHLY' ? 'Vé tháng' : 'Vé ngày'}</td>
                <td>{cfg.price.toLocaleString('vi-VN')}</td>
                <td>
                  <IconButton color="primary" onClick={() => handleOpenDialog(cfg)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(cfg.id)}><DeleteIcon /></IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editingConfig ? 'Chỉnh sửa cấu hình' : 'Thêm cấu hình mới'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              select
              label="Loại xe"
              value={form.vehicleType}
              onChange={e => setForm(f => ({ ...f, vehicleType: e.target.value as VehicleType }))}
              fullWidth
            >
              {VEHICLE_TYPES.map(type => (
                <MenuItem key={type} value={type}>{type === 'CAR' ? 'Ô tô' : 'Xe máy'}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Loại vé"
              value={form.ticketType}
              onChange={e => setForm(f => ({ ...f, ticketType: e.target.value as TicketType }))}
              fullWidth
            >
              {TICKET_TYPES.map(type => (
                <MenuItem key={type} value={type}>{type === 'MONTHLY' ? 'Vé tháng' : 'Vé ngày'}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Giá (VNĐ)"
              type="number"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">Lưu</Button>
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

export default VehicleFeeConfigPage; 