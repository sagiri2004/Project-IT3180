import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';
import { FeeType } from '../types/fee';
import { feeTypeService } from '../services/fee.service';

interface FeeCollectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    householdId: number;
    feeTypeId: number;
    yearMonth: string;
    amount: number;
    isPaid?: boolean;
    paidDate?: string;
    paidBy?: string;
    collectedBy?: string;
  }) => void;
  initialData?: {
    householdId: number;
    feeTypeId: number;
    yearMonth: string;
    amount: number;
    isPaid?: boolean;
    paidDate?: string;
    paidBy?: string;
    collectedBy?: string;
  };
}

const FeeCollectionDialog: React.FC<FeeCollectionDialogProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    householdId: initialData?.householdId || 0,
    feeTypeId: initialData?.feeTypeId || 0,
    yearMonth: initialData?.yearMonth || '',
    amount: initialData?.amount || 0,
    isPaid: initialData?.isPaid || false,
    paidDate: initialData?.paidDate || '',
    paidBy: initialData?.paidBy || '',
    collectedBy: initialData?.collectedBy || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);

  useEffect(() => {
    loadFeeTypes();
  }, []);

  const loadFeeTypes = async () => {
    try {
      const res = await feeTypeService.getAll(0, 100); // Get all fee types
      setFeeTypes(res.data);
    } catch (error) {
      console.error('Error loading fee types:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.householdId) {
      newErrors.householdId = 'Vui lòng nhập ID hộ';
    }
    if (!form.feeTypeId) {
      newErrors.feeTypeId = 'Vui lòng chọn loại phí';
    }
    if (!form.yearMonth) {
      newErrors.yearMonth = 'Vui lòng nhập tháng';
    } else if (!/^\d{4}-\d{2}$/.test(form.yearMonth)) {
      newErrors.yearMonth = 'Định dạng tháng không hợp lệ (YYYY-MM)';
    }
    if (!form.amount || form.amount <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0';
    }
    if (form.isPaid) {
      if (!form.paidDate) {
        newErrors.paidDate = 'Vui lòng nhập ngày thu';
      }
      if (!form.paidBy) {
        newErrors.paidBy = 'Vui lòng nhập người nộp';
      }
      if (!form.collectedBy) {
        newErrors.collectedBy = 'Vui lòng nhập người thu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string | number | boolean>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...form,
        amount: Number(form.amount),
        householdId: Number(form.householdId),
        feeTypeId: Number(form.feeTypeId)
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Chỉnh sửa khoản thu' : 'Thêm khoản thu mới'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="ID hộ"
            name="householdId"
            type="number"
            value={form.householdId}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.householdId}
            helperText={errors.householdId}
          />

          <FormControl fullWidth required error={!!errors.feeTypeId}>
            <InputLabel>Loại phí</InputLabel>
            <Select
              name="feeTypeId"
              value={form.feeTypeId}
              onChange={handleSelectChange}
              label="Loại phí"
            >
              {feeTypes.map(type => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
            {errors.feeTypeId && <FormHelperText>{errors.feeTypeId}</FormHelperText>}
          </FormControl>

          <TextField
            label="Tháng (YYYY-MM)"
            name="yearMonth"
            value={form.yearMonth}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.yearMonth}
            helperText={errors.yearMonth}
            placeholder="2024-05"
          />

          <TextField
            label="Số tiền (VNĐ)"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.amount}
            helperText={errors.amount}
          />

          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="isPaid"
              value={form.isPaid}
              onChange={handleSelectChange}
              label="Trạng thái"
            >
              <MenuItem value="false">Chưa thu</MenuItem>
              <MenuItem value="true">Đã thu</MenuItem>
            </Select>
          </FormControl>

          {form.isPaid && (
            <>
              <TextField
                label="Ngày thu"
                name="paidDate"
                type="date"
                value={form.paidDate}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.paidDate}
                helperText={errors.paidDate}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Người nộp"
                name="paidBy"
                value={form.paidBy}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.paidBy}
                helperText={errors.paidBy}
              />

              <TextField
                label="Người thu"
                name="collectedBy"
                value={form.collectedBy}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.collectedBy}
                helperText={errors.collectedBy}
              />
            </>
          )}
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