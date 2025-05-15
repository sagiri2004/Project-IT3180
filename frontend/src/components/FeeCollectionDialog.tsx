import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

interface FeeCollectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    householdId: number;
    feeTypeId: number;
    amount: number;
    dueDate: string;
  }) => void;
  initialData?: {
    householdId: number;
    feeTypeId: number;
    amount: number;
    dueDate: string;
  };
}

const FeeCollectionDialog: React.FC<FeeCollectionDialogProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    householdId: initialData?.householdId || 0,
    feeTypeId: initialData?.feeTypeId || 0,
    amount: initialData?.amount || 0,
    dueDate: initialData?.dueDate || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'householdId' || name === 'feeTypeId' || name === 'amount' ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialData ? 'Chỉnh sửa khoản thu' : 'Thêm khoản thu mới'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField label="ID hộ" name="householdId" type="number" value={form.householdId} onChange={handleChange} fullWidth required />
          <TextField label="ID loại phí" name="feeTypeId" type="number" value={form.feeTypeId} onChange={handleChange} fullWidth required />
          <TextField label="Số tiền (VNĐ)" name="amount" type="number" value={form.amount} onChange={handleChange} fullWidth required />
          <TextField label="Hạn nộp" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">Lưu</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeeCollectionDialog; 