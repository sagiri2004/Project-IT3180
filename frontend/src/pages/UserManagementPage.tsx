import React from 'react';
import { Box, Typography } from '@mui/material';
import UserList from '../components/UserList';

const UserManagementPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý tài khoản
      </Typography>
      <UserList />
    </Box>
  );
};

export default UserManagementPage; 