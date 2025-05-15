import React from 'react';
import { DialogContent, TextField, MenuItem, Box, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PopulationChangeRequest } from '../types/populationChange';

const changeTypes = [
  { value: 'TAM_TRU', label: 'Tạm trú' },
  { value: 'TAM_VANG', label: 'Tạm vắng' },
  { value: 'CHUYEN_DEN', label: 'Chuyển đến' },
  { value: 'CHUYEN_DI', label: 'Chuyển đi' },
];

export interface PopulationChangeFormProps {
  initialValues: PopulationChangeRequest;
  onSubmit: (values: PopulationChangeRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

const validationSchema = Yup.object({
  residentId: Yup.number().required('Bắt buộc'),
  changeType: Yup.string().required('Bắt buộc'),
  startDate: Yup.string().required('Bắt buộc'),
});

const PopulationChangeForm: React.FC<PopulationChangeFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading,
}) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="ID nhân khẩu"
            name="residentId"
            type="number"
            value={formik.values.residentId}
            onChange={formik.handleChange}
            error={formik.touched.residentId && Boolean(formik.errors.residentId)}
            helperText={formik.touched.residentId && formik.errors.residentId}
            fullWidth
            required
          />
          <TextField
            label="ID hộ gia đình"
            name="householdId"
            type="number"
            value={formik.values.householdId || ''}
            onChange={formik.handleChange}
            fullWidth
          />
          <TextField
            select
            label="Loại thay đổi"
            name="changeType"
            value={formik.values.changeType}
            onChange={formik.handleChange}
            error={formik.touched.changeType && Boolean(formik.errors.changeType)}
            helperText={formik.touched.changeType && formik.errors.changeType}
            fullWidth
            required
          >
            {changeTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Ngày bắt đầu"
            name="startDate"
            type="date"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={formik.touched.startDate && formik.errors.startDate}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Ngày kết thúc"
            name="endDate"
            type="date"
            value={formik.values.endDate || ''}
            onChange={formik.handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Lý do"
            name="reason"
            value={formik.values.reason || ''}
            onChange={formik.handleChange}
            fullWidth
          />
          <TextField
            label="Địa chỉ đi"
            name="sourceAddress"
            value={formik.values.sourceAddress || ''}
            onChange={formik.handleChange}
            fullWidth
          />
          <TextField
            label="Địa chỉ đến"
            name="destinationAddress"
            value={formik.values.destinationAddress || ''}
            onChange={formik.handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 2 }}>
        <Button type="button" onClick={onCancel} variant="outlined" sx={{ mr: 1 }}>Hủy</Button>
        <Button type="submit" variant="contained" disabled={loading}>Lưu</Button>
      </Box>
    </form>
  );
};

export default PopulationChangeForm; 