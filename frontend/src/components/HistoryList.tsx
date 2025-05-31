import React, { useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Paper } from '@mui/material';
import SmartTable from './SmartTable';
import { historyService, HistoryRecord } from '../services/history.service';

const HistoryList: React.FC = () => {
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);

  const fetchHistoryRecords = async (page: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await historyService.getAll(page, pageSize);
      setHistoryRecords(response.data.data.content);
      setTotalRows(response.data.data.totalElements);
    } catch (error) {
      console.error('Error fetching history records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryRecords(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel.page, paginationModel.pageSize]);

  const handlePaginationModelChange = (newModel: { page: number; pageSize: number }) => {
    setPaginationModel(newModel);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'entityType', headerName: 'Loại đối tượng', width: 150 },
    { field: 'entityId', headerName: 'ID đối tượng', width: 100 },
    { field: 'actionType', headerName: 'Hành động', width: 120 },
    {
      field: 'timestamp',
      headerName: 'Thời gian',
      width: 250,
      renderCell: (params: any) => {
        if (!params.value) return '';
        const date = new Date(params.value as string);
        return date.toLocaleString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Ho_Chi_Minh'
        });
      },
    },
  ];

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Lịch sử thay đổi
        </Typography>
      </Paper>
      <SmartTable
        columns={columns}
        rows={historyRecords}
        rowCount={totalRows}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        onSearch={setSearchValue}
        searchValue={searchValue}
      />
    </Box>
  );
};

export default HistoryList; 