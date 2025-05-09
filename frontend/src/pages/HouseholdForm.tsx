import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';
import { AppDispatch, RootState } from '../store';
import { createHousehold, updateHousehold, fetchHouseholdById } from '../store/slices/householdSlice';
import { CreateHouseholdRequest, UpdateHouseholdRequest } from '../types/household';

const validationSchema = Yup.object({
    householdCode: Yup.string()
        .required('Vui lòng nhập mã hộ khẩu')
        .matches(/^[A-Z0-9]+$/, 'Mã hộ khẩu chỉ được chứa chữ in hoa và số'),
    apartmentNumber: Yup.string()
        .required('Vui lòng nhập số căn hộ'),
    areaM2: Yup.number()
        .required('Vui lòng nhập diện tích')
        .positive('Diện tích phải lớn hơn 0'),
    address: Yup.string()
        .required('Vui lòng nhập địa chỉ'),
    ownerName: Yup.string()
        .required('Vui lòng nhập tên chủ hộ'),
    phoneNumber: Yup.string()
        .required('Vui lòng nhập số điện thoại')
        .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ')
});

const HouseholdForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error, currentHousehold } = useSelector((state: RootState) => state.household);
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            dispatch(fetchHouseholdById(parseInt(id)));
        }
    }, [dispatch, id, isEditMode]);

    const initialValues: CreateHouseholdRequest = {
        householdCode: currentHousehold?.householdCode || '',
        apartmentNumber: currentHousehold?.apartmentNumber || '',
        areaM2: currentHousehold?.areaM2 || 0,
        address: currentHousehold?.address || '',
        ownerName: currentHousehold?.ownerName || '',
        phoneNumber: currentHousehold?.phoneNumber || ''
    };

    const handleSubmit = async (values: CreateHouseholdRequest) => {
        try {
            if (isEditMode) {
                await dispatch(updateHousehold({ id: parseInt(id), data: values as UpdateHouseholdRequest })).unwrap();
            } else {
                await dispatch(createHousehold(values)).unwrap();
            }
            navigate('/households');
        } catch (err) {
            // Error is handled by the slice
        }
    };

    if (isEditMode && isLoading && !currentHousehold) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                        {isEditMode ? 'Chỉnh sửa hộ khẩu' : 'Thêm hộ khẩu mới'}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                            <Form>
                                <Grid container spacing={3}>
                                    <Grid {...({ item: true, xs: 12, sm: 6 } as any)}>
                                        <TextField
                                            fullWidth
                                            id="householdCode"
                                            name="householdCode"
                                            label="Mã hộ khẩu"
                                            value={values.householdCode}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.householdCode && Boolean(errors.householdCode)}
                                            helperText={touched.householdCode && errors.householdCode}
                                            disabled={isEditMode}
                                        />
                                    </Grid>
                                    <Grid {...({ item: true, xs: 12, sm: 6 } as any)}>
                                        <TextField
                                            fullWidth
                                            id="apartmentNumber"
                                            name="apartmentNumber"
                                            label="Số căn hộ"
                                            value={values.apartmentNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.apartmentNumber && Boolean(errors.apartmentNumber)}
                                            helperText={touched.apartmentNumber && errors.apartmentNumber}
                                        />
                                    </Grid>
                                    <Grid {...({ item: true, xs: 12, sm: 6 } as any)}>
                                        <TextField
                                            fullWidth
                                            id="areaM2"
                                            name="areaM2"
                                            label="Diện tích (m²)"
                                            type="number"
                                            value={values.areaM2}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.areaM2 && Boolean(errors.areaM2)}
                                            helperText={touched.areaM2 && errors.areaM2}
                                        />
                                    </Grid>
                                    <Grid {...({ item: true, xs: 12, sm: 6 } as any)}>
                                        <TextField
                                            fullWidth
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            label="Số điện thoại"
                                            value={values.phoneNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                            helperText={touched.phoneNumber && errors.phoneNumber}
                                        />
                                    </Grid>
                                    <Grid {...({ item: true, xs: 12 } as any)}>
                                        <TextField
                                            fullWidth
                                            id="address"
                                            name="address"
                                            label="Địa chỉ"
                                            value={values.address}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.address && Boolean(errors.address)}
                                            helperText={touched.address && errors.address}
                                        />
                                    </Grid>
                                    <Grid {...({ item: true, xs: 12 } as any)}>
                                        <TextField
                                            fullWidth
                                            id="ownerName"
                                            name="ownerName"
                                            label="Tên chủ hộ"
                                            value={values.ownerName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.ownerName && Boolean(errors.ownerName)}
                                            helperText={touched.ownerName && errors.ownerName}
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/households')}
                                        disabled={isLoading}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting || isLoading}
                                    >
                                        {isLoading ? <CircularProgress size={24} /> : (isEditMode ? 'Cập nhật' : 'Thêm mới')}
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </Box>
    );
};

export default HouseholdForm; 