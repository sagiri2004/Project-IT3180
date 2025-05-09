import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Checkbox, Box } from '@mui/material';

interface FeeTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    pricePerM2: number;
    isPerM2: boolean;
    isRequired: boolean;
    startDate: string;
    endDate: string;
  }) => void;
  initialData?: {
    name: string;
    description: string;
    pricePerM2: number;
    isPerM2: boolean;
    isRequired: boolean;
    startDate: string;
    endDate: string;
  };
}

const FeeTypeDialog: React.FC<FeeTypeDialogProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    pricePerM2: initialData?.pricePerM2 || 0,
    isPerM2: initialData?.isPerM2 || false,
    isRequired: initialData?.isRequired || false,
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...form,
      pricePerM2: Number(form.pricePerM2),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialData ? 'Chỉnh sửa loại phí' : 'Thêm loại phí mới'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField label="Tên loại phí" name="name" value={form.name} onChange={handleChange} fullWidth required />
          <TextField label="Mô tả" name="description" value={form.description} onChange={handleChange} fullWidth />
          <TextField label="Đơn giá (VNĐ/m2)" name="pricePerM2" type="number" value={form.pricePerM2} onChange={handleChange} fullWidth required />
          <FormControlLabel control={<Checkbox checked={form.isPerM2} onChange={handleChange} name="isPerM2" />} label="Tính theo m2" />
          <FormControlLabel control={<Checkbox checked={form.isRequired} onChange={handleChange} name="isRequired" />} label="Bắt buộc" />
          <TextField label="Ngày bắt đầu" name="startDate" type="date" value={form.startDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="Ngày kết thúc" name="endDate" type="date" value={form.endDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">Lưu</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeeTypeDialog; 