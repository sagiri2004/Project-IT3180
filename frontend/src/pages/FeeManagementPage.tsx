import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Tabs, Tab, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Divider, IconButton, Tooltip, LinearProgress } from '@mui/material';
import { feeTypeService, feeCollectionService } from '../services/fee.service';
import { FeeType, FeeCollection } from '../types/fee';
import SmartTable from '../components/SmartTable';
import FeeTypeDialog from '../components/FeeTypeDialog';
import FeeCollectionDialog from '../components/FeeCollectionDialog';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

const FeeManagementPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [feeCollections, setFeeCollections] = useState<FeeCollection[]>([]);
  const [openFeeTypeDialog, setOpenFeeTypeDialog] = useState(false);
  const [openFeeCollectionDialog, setOpenFeeCollectionDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<FeeCollection | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [feeTypePage, setFeeTypePage] = useState(0);
  const [feeTypePageSize, setFeeTypePageSize] = useState(10);
  const [feeTypeRowCount, setFeeTypeRowCount] = useState(0);
  const [feeCollectionPage, setFeeCollectionPage] = useState(0);
  const [feeCollectionPageSize, setFeeCollectionPageSize] = useState(10);
  const [feeCollectionsTotal, setFeeCollectionsTotal] = useState(0);

  useEffect(() => {
    loadFeeTypes();
  }, [feeTypePage, feeTypePageSize]);

  useEffect(() => {
    if (tab === 1) {
      loadFeeCollections();
    }
  }, [feeCollectionPage, feeCollectionPageSize, tab]);

  const loadFeeTypes = async () => {
    setLoading(true);
    try {
      const res = await feeTypeService.getAll(feeTypePage, feeTypePageSize);
      setFeeTypes(res.data);
      setFeeTypeRowCount(res.total);
    } catch (error) {
      setFeeTypes([]);
      setFeeTypeRowCount(0);
    } finally {
      setLoading(false);
    }
  };

  const loadFeeCollections = async () => {
    setLoading(true);
    try {
      const res = await feeCollectionService.getAll(feeCollectionPage, feeCollectionPageSize);
      setFeeCollections(res.data);
      setFeeCollectionsTotal(res.total);
    } catch (error) {
      setFeeCollections([]);
      setFeeCollectionsTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeeType = async (data: any) => {
    try {
      const newType = {
        ...data,
        id: feeTypes.length + 1,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
      };
      await feeTypeService.create(data);
      setFeeTypes(prev => [...prev, newType]);
      setOpenFeeTypeDialog(false);
    } catch (error) {
      console.error('Error creating fee type:', error);
    }
  };

  const handleAddFeeCollection = async (data: any) => {
    try {
      await feeCollectionService.create(data);
      setOpenFeeCollectionDialog(false);
      loadFeeCollections();
    } catch (error) {
      console.error('Error creating fee collection:', error);
    }
  };

  const handleEditFeeType = async (newRow: FeeType, oldRow: FeeType) => {
    try {
      await feeTypeService.update(newRow);
      setFeeTypes(prev => prev.map(row => row.id === newRow.id ? newRow : row));
      return newRow;
    } catch (error) {
      console.error('Error updating fee type:', error);
      return oldRow;
    }
  };

  const handleEditFeeCollection = async (newRow: FeeCollection, oldRow: FeeCollection) => {
    try {
      await feeCollectionService.update(newRow);
      loadFeeCollections();
      return newRow;
    } catch (error) {
      console.error('Error updating fee collection:', error);
      return oldRow;
    }
  };

  const handleRowClick = (params: any) => {
    if (tab === 1) { // Fee Collections tab
      navigate(`/fees/${params.row.id}`);
    }
  };

  const isCellEditable = (params: any) => {
    if (tab === 0) { // Fee types
      return ['name', 'description', 'pricePerM2', 'isPerM2', 'isRequired'].includes(params.field);
    } else { // Fee collections
      return ['amount', 'isPaid', 'paidDate', 'paidBy', 'collectedBy'].includes(params.field);
    }
  };

  // Hàm tính trạng thái dựa vào ngày
  const getStatus = (startDate?: string, endDate?: string) => {
    const now = new Date();
    if (startDate && new Date(startDate) > now) return 'Sắp tới';
    if (endDate && new Date(endDate) < now) return 'Đã kết thúc';
    return 'Đang thu';
  };

  // Hàm tính tiến độ (mock, có thể thay bằng dữ liệu thực tế)
  const getProgress = (feeTypeId: number) => {
    // Giả lập: loại phí 1 đã thu 80%, loại phí 2 đã thu 30%
    if (feeTypeId === 1) return 80;
    if (feeTypeId === 2) return 30;
    return 0;
  };

  const handleDeleteFeeType = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại phí này?')) {
      try {
        await feeTypeService.delete(id);
        setFeeTypes(prev => prev.filter(f => f.id !== id));
      } catch (error) {
        alert('Xóa thất bại!');
      }
    }
  };

  const handleViewDetail = (row: FeeType) => {
    navigate(`/fee-types/${row.id}`);
  };

  // Helper functions for date formatting
  const formatDate = (date: string | number | Date | null | undefined) => {
    if (!date) return '-';
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return '-';
      }
      return parsedDate.toLocaleDateString('vi-VN');
    } catch (error) {
      return '-';
    }
  };

  const formatDateTime = (date: string | number | Date | null | undefined) => {
    if (!date) return '-';
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return '-';
      }
      return parsedDate.toLocaleString('vi-VN');
    } catch (error) {
      return '-';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Quản lý thu phí</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Loại phí" />
        <Tab label="Khoản thu phí" />
      </Tabs>
      {tab === 0 && (
        <Paper sx={{ p: 2 }}>
          <SmartTable
            columns={[
              { field: 'id', headerName: 'ID', width: 70 },
              { field: 'name', headerName: 'Tên loại phí', width: 180, editable: true },
              { field: 'description', headerName: 'Mô tả', width: 200, editable: true },
              { field: 'pricePerM2', headerName: 'Đơn giá (VNĐ/m2)', width: 150, editable: true, type: 'number' },
              { 
                field: 'isPerM2', 
                headerName: 'Tính theo m2', 
                width: 120, 
                editable: true, 
                type: 'boolean', 
                valueFormatter: (params: any) => params?.value ? 'Có' : 'Không' 
              },
              { 
                field: 'isRequired', 
                headerName: 'Bắt buộc', 
                width: 120, 
                editable: true, 
                type: 'boolean', 
                valueFormatter: (params: any) => params?.value ? 'Có' : 'Không' 
              },
              { field: 'createdBy', headerName: 'Người tạo', width: 120 },
              { 
                field: 'createdAt', 
                headerName: 'Ngày tạo', 
                width: 160,
                renderCell: (params: any) => {
                  const value = params.value;
                  if (!value) return '-';
                  const d = new Date(value);
                  if (isNaN(d.getTime())) return '-';
                  return d.toLocaleString('vi-VN');
                }
              },
              {
                field: 'actions',
                headerName: 'Thao tác',
                width: 100,
                sortable: false,
                filterable: false,
                renderCell: (params: any) => (
                  <Box>
                    <Tooltip title="Xem chi tiết"><IconButton onClick={() => handleViewDetail(params.row)}><InfoIcon /></IconButton></Tooltip>
                    <Tooltip title="Xóa"><IconButton color="error" onClick={() => handleDeleteFeeType(params.row.id)}><DeleteIcon /></IconButton></Tooltip>
                  </Box>
                ),
              },
            ]}
            rows={feeTypes}
            rowCount={feeTypeRowCount}
            loading={loading}
            paginationModel={{ page: feeTypePage, pageSize: feeTypePageSize }}
            onPaginationModelChange={({ page, pageSize }) => {
              setFeeTypePage(page);
              setFeeTypePageSize(pageSize);
            }}
            onSearch={() => {}}
            searchValue={''}
            addLabel="Thêm loại phí"
            onAdd={() => setOpenFeeTypeDialog(true)}
            processRowUpdate={handleEditFeeType}
            isCellEditable={isCellEditable}
          />
          <FeeTypeDialog
            open={openFeeTypeDialog}
            onClose={() => setOpenFeeTypeDialog(false)}
            onSubmit={handleAddFeeType}
          />
        </Paper>
      )}
      {tab === 1 && (
        <Paper sx={{ p: 2 }}>
            <SmartTable
              columns={[
                { field: 'id', headerName: 'ID', width: 70 },
                { field: 'householdCode', headerName: 'Mã hộ', width: 120 },
                { field: 'apartmentNumber', headerName: 'Số căn hộ', width: 120 },
                { field: 'feeTypeName', headerName: 'Loại phí', width: 150 },
                { field: 'yearMonth', headerName: 'Tháng', width: 100 },
                { 
                  field: 'amount', 
                  headerName: 'Số tiền (VNĐ)', 
                  width: 150, 
                  editable: true, 
                  type: 'number',
                  renderCell: (params: any) => {
                    const value = params.value;
                    if (value == null) return '0';
                    return value.toLocaleString('vi-VN');
                  }
                },
                { 
                  field: 'isPaid', 
                  headerName: 'Đã thu', 
                  width: 100, 
                  editable: true, 
                  type: 'boolean', 
                  valueFormatter: (params: any) => params?.value ? 'Đã thu' : 'Chưa thu' 
                },
                { 
                  field: 'paidDate', 
                  headerName: 'Ngày thu', 
                  width: 120, 
                  editable: true, 
                  renderCell: (params: any) => {
                    const value = params.value;
                    if (!value) return '';
                    const d = new Date(value);
                    if (isNaN(d.getTime())) return '';
                    return d.toLocaleDateString('vi-VN');
                  }
                },
                { field: 'paidBy', headerName: 'Người nộp', width: 120, editable: true },
                { field: 'collectedBy', headerName: 'Người thu', width: 120, editable: true },
                { field: 'createdBy', headerName: 'Người tạo', width: 120 },
                { 
                  field: 'createdAt', 
                  headerName: 'Ngày tạo', 
                  width: 160,
                  renderCell: (params: any) => {
                    const value = params.value;
                    if (!value) return '-';
                    const d = new Date(value);
                    if (isNaN(d.getTime())) return '-';
                    return d.toLocaleString('vi-VN');
                  }
                },
              ]}
              rows={feeCollections}
              rowCount={feeCollectionsTotal}
              loading={loading}
              paginationModel={{ page: feeCollectionPage, pageSize: feeCollectionPageSize }}
              onPaginationModelChange={({ page, pageSize }) => {
                setFeeCollectionPage(page);
                setFeeCollectionPageSize(pageSize);
              }}
              onSearch={() => {}}
              searchValue={''}
              addLabel="Thêm khoản thu"
              onAdd={() => setOpenFeeCollectionDialog(true)}
              processRowUpdate={handleEditFeeCollection}
              isCellEditable={isCellEditable}
              onRowClick={handleRowClick}
            />
          <FeeCollectionDialog
            open={openFeeCollectionDialog}
            onClose={() => setOpenFeeCollectionDialog(false)}
            onSubmit={handleAddFeeCollection}
          />
        </Paper>
      )}

      {/* Dialog thống kê chi tiết */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết khoản thu</DialogTitle>
        <DialogContent>
          {selectedCollection && (
            <Grid container spacing={2}>
              <Grid {...({ item: true, xs: 12 } as any)}>
                <Typography variant="h6" gutterBottom>Thông tin cơ bản</Typography>
                <Grid container spacing={2}>
                  <Grid {...({ item: true, xs: 6 } as any)}>
                    <Typography variant="subtitle2">Mã hộ:</Typography>
                    <Typography>{selectedCollection.householdCode}</Typography>
                  </Grid>
                  <Grid {...({ item: true, xs: 6 } as any)}>
                    <Typography variant="subtitle2">Số căn hộ:</Typography>
                    <Typography>{selectedCollection.apartmentNumber}</Typography>
                  </Grid>
                  <Grid {...({ item: true, xs: 6 } as any)}>
                    <Typography variant="subtitle2">Loại phí:</Typography>
                    <Typography>{selectedCollection.feeTypeName}</Typography>
                  </Grid>
                  <Grid {...({ item: true, xs: 6 } as any)}>
                    <Typography variant="subtitle2">Tháng:</Typography>
                    <Typography>{selectedCollection.yearMonth}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid {...({ item: true, xs: 12 } as any)}>
                <Divider />
              </Grid>
              <Grid {...({ item: true, xs: 12 } as any)}>
                <Typography variant="h6" gutterBottom>Thông tin thanh toán</Typography>
                <Grid container spacing={2}>
                  <Grid {...({ item: true, xs: 6 } as any)}>
                    <Typography variant="subtitle2">Số tiền:</Typography>
                    <Typography>{selectedCollection.amount.toLocaleString('vi-VN')} VNĐ</Typography>
                  </Grid>
                  <Grid {...({ item: true, xs: 6 } as any)}>
                    <Typography variant="subtitle2">Trạng thái:</Typography>
                    <Typography color={selectedCollection.isPaid ? 'success.main' : 'error.main'}>
                      {selectedCollection.isPaid ? 'Đã thu' : 'Chưa thu'}
                    </Typography>
                  </Grid>
                  {selectedCollection.isPaid && (
                    <>
                      <Grid {...({ item: true, xs: 6 } as any)}>
                        <Typography variant="subtitle2">Ngày thu:</Typography>
                        <Typography>{selectedCollection.paidDate}</Typography>
                      </Grid>
                      <Grid {...({ item: true, xs: 6 } as any)}>
                        <Typography variant="subtitle2">Người nộp:</Typography>
                        <Typography>{selectedCollection.paidBy}</Typography>
                      </Grid>
                      <Grid {...({ item: true, xs: 6 } as any)}>
                        <Typography variant="subtitle2">Người thu:</Typography>
                        <Typography>{selectedCollection.collectedBy}</Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
              <Grid {...({ item: true, xs: 12 } as any)}>
                <Divider />
              </Grid>
              <Grid {...({ item: true, xs: 12 } as any)}>
                <Typography variant="h6" gutterBottom>Thông tin khác</Typography>
                <Grid container spacing={2}>
                  <Grid {...({ item: true, xs: 6 } as any)}>
                    <Typography variant="subtitle2">Người tạo:</Typography>
                    <Typography>{selectedCollection.createdBy}</Typography>
                  </Grid>
                  <Grid {...({ item: true, xs: 6 } as any)}>
                    <Typography variant="subtitle2">Ngày tạo:</Typography>
                    <Typography>{new Date(selectedCollection.createdAt).toLocaleString('vi-VN')}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeeManagementPage; 