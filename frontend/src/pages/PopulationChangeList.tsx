import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Tooltip, Button } from '@mui/material';
import { populationChangeService } from '../services/populationChange.service';
import { PopulationChangeResponse } from '../types/populationChange';
import SmartTable from '../components/SmartTable';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';

interface PopulationChangeListProps {
  onAdd?: () => void;
  onView?: (row: PopulationChangeResponse) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onDelete?: (id: number) => void;
  reload?: number;
  showPendingOnly?: boolean;
  setShowPendingOnly?: (v: boolean) => void;
  onExport?: () => void;
  searchValue?: string;
  onSearch?: (value: string) => void;
}

const PopulationChangeList: React.FC<PopulationChangeListProps> = ({
  onAdd,
  onView,
  onApprove,
  onReject,
  onDelete,
  reload,
  showPendingOnly,
  setShowPendingOnly,
  onExport,
  searchValue = '',
  onSearch,
}) => {
  const [data, setData] = useState<PopulationChangeResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  useEffect(() => {
    fetchData();
  }, [paginationModel, reload, showPendingOnly, searchValue]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await populationChangeService.getAll(
        paginationModel.page,
        paginationModel.pageSize,
        showPendingOnly ? false : undefined
      );
      setData(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error('Error fetching population changes:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'residentName', headerName: 'Tên nhân khẩu', width: 150 },
    { field: 'householdCode', headerName: 'Mã hộ', width: 120 },
    { field: 'changeType', headerName: 'Loại thay đổi', width: 120 },
    { field: 'startDate', headerName: 'Ngày bắt đầu', width: 120 },
    { field: 'endDate', headerName: 'Ngày kết thúc', width: 120 },
    {
      field: 'isApproved',
      headerName: 'Duyệt',
      width: 100,
      valueFormatter: (params: any) => (params.value ? '✔' : '✖'),
    },
    { field: 'createdAt', headerName: 'Ngày tạo', width: 160 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 180,
      sortable: false,
      renderCell: (params: any) => (
        <Box>
          {onView && (
            <Tooltip title="Xem chi tiết">
              <IconButton onClick={() => onView(params.row)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          )}
          {onApprove && !params.row.isApproved && (
            <Tooltip title="Chấp nhận">
              <IconButton color="success" onClick={() => onApprove(params.row.id)}>
                <CheckIcon />
              </IconButton>
            </Tooltip>
          )}
          {onReject && !params.row.isApproved && (
            <Tooltip title="Từ chối">
              <IconButton color="warning" onClick={() => onReject(params.row.id)}>
                <CancelIcon />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Xóa">
              <IconButton color="error" onClick={() => onDelete(params.row.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  // Nút filter "Chỉ hiện chưa duyệt"
  const filterButton = setShowPendingOnly && (
    <Button
      variant={showPendingOnly ? 'contained' : 'outlined'}
      color="warning"
      startIcon={<FilterListIcon />}
      onClick={() => setShowPendingOnly && setShowPendingOnly(!showPendingOnly)}
      sx={{ ml: 1 }}
    >
      {showPendingOnly ? 'Hiện tất cả' : 'Chỉ hiện chưa duyệt'}
    </Button>
  );

  return (
    <SmartTable
      columns={columns}
      rows={data}
      rowCount={total}
      loading={loading}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      onSearch={onSearch || (() => {})}
      searchValue={searchValue}
      onAdd={onAdd}
      onExport={onExport}
    >
      {filterButton}
    </SmartTable>
  );
};

export default PopulationChangeList;