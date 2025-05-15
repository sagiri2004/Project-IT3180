import React from 'react';
import { DataGrid, GridColDef, GridToolbar, GridFilterModel, GridLogicOperator } from '@mui/x-data-grid';
import { Box, Button, TextField, InputAdornment, Skeleton } from '@mui/material';
import { Search as SearchIcon, FileDownload as FileDownloadIcon, Add as AddIcon } from '@mui/icons-material';

interface SmartTableProps {
  columns: GridColDef[];
  rows: any[];
  rowCount: number;
  loading: boolean;
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
  onSearch: (value: string) => void;
  searchValue: string;
  onAdd?: () => void;
  onExport?: () => void;
  addLabel?: string;
  processRowUpdate?: (row: any, oldRow: any) => Promise<any> | any;
  isCellEditable?: (params: any) => boolean;
  onRowClick?: (params: any) => void;
  children?: React.ReactNode;
}

const SmartTable: React.FC<SmartTableProps> = ({
  columns, rows, rowCount, loading, paginationModel, onPaginationModelChange,
  onSearch, searchValue, onAdd, onExport, addLabel = 'Thêm mới', processRowUpdate, isCellEditable, onRowClick, children
}) => {
  // Add resizable property to all columns
  const resizableColumns = columns.map(col => ({
    ...col,
    resizable: true,
    flex: col.flex || 1,
    minWidth: col.minWidth || 100,
    maxWidth: col.maxWidth || 500,
    filterable: true, // Đảm bảo tất cả cột đều có thể lọc
  }));

  // Tạo filterModel để tìm kiếm trên tất cả các cột
  const filterModel: GridFilterModel = {
    items: searchValue
      ? columns.map((col) => ({
          field: col.field,
          operator: 'contains',
          value: searchValue,
        }))
      : [],
    logicOperator: GridLogicOperator.Or,
  };

  // Xử lý khi người dùng nhập từ khóa tìm kiếm
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onSearch(value);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onExport && (
            <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={onExport}>
              Xuất Excel
            </Button>
          )}
          {onAdd && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
              {addLabel}
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            label="Tìm kiếm"
            value={searchValue}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
            sx={{ minWidth: 300 }}
          />
          {children}
        </Box>
      </Box>
      {loading && (!rows || rows.length === 0) ? (
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 2 }} />
      ) : (
        <DataGrid
          showToolbar
          rows={rows}
          columns={resizableColumns}
          rowCount={rowCount}
          loading={loading}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          pageSizeOptions={[10, 25, 50]}
          paginationMode="server"
          disableRowSelectionOnClick
          autoHeight
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: false, // Tắt quick filter mặc định
            }
          }}
          filterModel={filterModel}
          onFilterModelChange={(model) => {
            // Nếu cần xử lý thêm khi filter thay đổi
          }}
          processRowUpdate={processRowUpdate}
          isCellEditable={isCellEditable}
          onRowClick={onRowClick}
          disableColumnMenu={false}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'background.paper',
            },
            '& .MuiDataGrid-cell': {
              borderColor: 'divider',
            },
            '& .MuiDataGrid-columnSeparator': {
              visibility: 'visible',
            },
            '& .MuiDataGrid-columnHeader': {
              cursor: 'col-resize',
            },
            '& .MuiDataGrid-columnHeader:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeader:focus-within': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeader--resizing': {
              backgroundColor: 'action.hover',
            },
          }}
        />
      )}
    </Box>
  );
};

export default SmartTable;