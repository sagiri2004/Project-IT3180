import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    FileDownload as FileDownloadIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Undo as UndoIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { createHousehold, deleteHousehold, fetchHouseholds, updateHousehold } from '../store/slices/householdSlice';
import { Household, CreateHouseholdRequest } from '../types/household';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { GridColDef } from '@mui/x-data-grid';

import SmartTable from '../components/SmartTable';

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

const HouseholdList: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { households, totalElements, isLoading } = useSelector((state: RootState) => state.household);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedRows, setEditedRows] = useState<{ [id: number]: Partial<Household> }>({});
    const [originalRows, setOriginalRows] = useState<Household[]>([]);
    const isFirstLoad = useRef(true);
    const navigate = useNavigate();

    // Debounce search
    const debounceRef = useRef<any>();
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(searchKeyword);
        }, 500);
        return () => clearTimeout(debounceRef.current);
    }, [searchKeyword]);

    // Reset page về 0 khi search
    useEffect(() => {
        setPaginationModel(prev => ({ ...prev, page: 0 }));
    }, [debouncedSearch]);

    useEffect(() => {
        dispatch(fetchHouseholds({
            page: paginationModel.page,
            size: paginationModel.pageSize,
            keyword: debouncedSearch
        }));
    }, [dispatch, paginationModel, debouncedSearch]);

    // Lưu lại dữ liệu gốc khi bật chế độ chỉnh sửa
    useEffect(() => {
        if (editMode && isFirstLoad.current) {
            setOriginalRows(households);
            isFirstLoad.current = false;
        }
        if (!editMode) {
            setEditedRows({});
            setOriginalRows([]);
            isFirstLoad.current = true;
        }
    }, [editMode, households]);

    const handleExport = () => {
        const exportData = households.map(household => ({
            'Mã hộ khẩu': household.householdCode,
            'Số căn hộ': household.apartmentNumber,
            'Diện tích (m²)': household.areaM2,
            'Địa chỉ': household.address,
            'Chủ hộ': household.ownerName,
            'Số điện thoại': household.phoneNumber,
            'Ngày đăng ký': format(new Date(household.registrationDate), 'dd/MM/yyyy', { locale: vi }),
            'Số thành viên': household.residentCount
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Danh sách hộ khẩu');
        XLSX.writeFile(wb, 'danh_sach_ho_khau.xlsx');
    };

    // Khi chỉnh sửa cell, lưu vào editedRows
    const processRowUpdate = async (newRow: Household, oldRow: Household) => {
        setEditedRows(prev => ({ ...prev, [newRow.id]: newRow }));
        // Gửi lên backend luôn nếu muốn lưu ngay
        await dispatch(updateHousehold({
            id: newRow.id!,
            data: {
                id: newRow.id!,
                householdCode: newRow.householdCode ?? '',
                apartmentNumber: newRow.apartmentNumber ?? '',
                areaM2: newRow.areaM2 ?? 0,
                address: newRow.address ?? '',
                ownerName: newRow.ownerName ?? '',
                phoneNumber: newRow.phoneNumber ?? ''
            }
        })).unwrap();
        return newRow;
    };

    // Hoàn tác về dữ liệu ban đầu
    const handleRevertAll = () => {
        setEditedRows({});
        setEditMode(false);
        dispatch(fetchHouseholds({
            page: paginationModel.page,
            size: paginationModel.pageSize,
            keyword: debouncedSearch
        }));
    };

    const columns: GridColDef[] = [
        { field: 'householdCode', headerName: 'Mã hộ khẩu', width: 150, editable: true },
        { field: 'apartmentNumber', headerName: 'Số căn hộ', width: 120, editable: true },
        { field: 'areaM2', headerName: 'Diện tích (m²)', width: 120, type: 'number', editable: true },
        { field: 'address', headerName: 'Địa chỉ', width: 250, editable: true },
        { field: 'ownerName', headerName: 'Chủ hộ', width: 200, editable: true },
        { field: 'phoneNumber', headerName: 'Số điện thoại', width: 150, editable: true },
        {
            field: 'registrationDate',
            headerName: 'Ngày đăng ký',
            width: 150,
            valueFormatter: (params: any) => {
                try {
                    const date = new Date(params.value);
                    if (isNaN(date.getTime())) {
                        return 'N/A';
                    }
                    return format(date, 'dd/MM/yyyy', { locale: vi });
                } catch (error) {
                    return 'N/A';
                }
            }
        },
        {
            field: 'residentCount',
            headerName: 'Số thành viên',
            width: 120,
            type: 'number'
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 180,
            sortable: false,
            renderCell: (params: any) => (
                <Box>
                    <IconButton
                        color="primary"
                        onClick={() => navigate(`/households/${params.row.id}`)}
                        title="Xem chi tiết"
                        sx={{ mr: 1 }}
                    >
                        <VisibilityIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn xóa hộ khẩu này?')) {
                                dispatch(deleteHousehold(params.row.id));
                            }
                        }}
                        title="Xóa"
                    >
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
                        Quản lý hộ khẩu
                    </Typography>
                    <SmartTable
                        columns={columns}
                        rows={households.map(row => editedRows[row.id] ? { ...row, ...editedRows[row.id] } : row)}
                        rowCount={totalElements}
                        loading={isLoading}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        onSearch={setSearchKeyword}
                        searchValue={searchKeyword}
                        onAdd={() => setOpenDialog(true)}
                        onExport={handleExport}
                        addLabel="Thêm mới"
                        processRowUpdate={processRowUpdate}
                    >
                        {editMode && (
                            <>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<SaveIcon />}
                                    onClick={() => setEditMode(false)}
                                    sx={{ mr: 1 }}
                                >
                                    Lưu tất cả
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    startIcon={<UndoIcon />}
                                    onClick={handleRevertAll}
                                >
                                    Hoàn tác
                                </Button>
                            </>
                        )}
                    </SmartTable>
                </CardContent>
            </Card>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Thêm hộ khẩu mới</DialogTitle>
                <Formik
                    initialValues={{
                        householdCode: '',
                        apartmentNumber: '',
                        areaM2: 0,
                        address: '',
                        ownerName: '',
                        phoneNumber: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            await dispatch(createHousehold(values)).unwrap();
                            setOpenDialog(false);
                        } catch (error) {
                            // handle error
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                        <Form>
                            <DialogContent>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        name="householdCode"
                                        label="Mã hộ khẩu"
                                        value={values.householdCode}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.householdCode && Boolean(errors.householdCode)}
                                        helperText={touched.householdCode && errors.householdCode}
                                    />
                                    <TextField
                                        fullWidth
                                        name="apartmentNumber"
                                        label="Số căn hộ"
                                        value={values.apartmentNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.apartmentNumber && Boolean(errors.apartmentNumber)}
                                        helperText={touched.apartmentNumber && errors.apartmentNumber}
                                    />
                                    <TextField
                                        fullWidth
                                        name="areaM2"
                                        label="Diện tích (m²)"
                                        type="number"
                                        value={values.areaM2}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.areaM2 && Boolean(errors.areaM2)}
                                        helperText={touched.areaM2 && errors.areaM2}
                                    />
                                    <TextField
                                        fullWidth
                                        name="address"
                                        label="Địa chỉ"
                                        value={values.address}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.address && Boolean(errors.address)}
                                        helperText={touched.address && errors.address}
                                    />
                                    <TextField
                                        fullWidth
                                        name="ownerName"
                                        label="Tên chủ hộ"
                                        value={values.ownerName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.ownerName && Boolean(errors.ownerName)}
                                        helperText={touched.ownerName && errors.ownerName}
                                    />
                                    <TextField
                                        fullWidth
                                        name="phoneNumber"
                                        label="Số điện thoại"
                                        value={values.phoneNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                        helperText={touched.phoneNumber && errors.phoneNumber}
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                                <Button type="submit" variant="contained" disabled={isSubmitting}>
                                    Thêm mới
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </Box>
    );
};

export default HouseholdList; 