import React, { useEffect, useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormHelperText,
} from '@mui/material';
import { useAppSelector } from '../hooks/useAppSelector';
import { UserRole } from '../types/user';
import { userService } from '../services/userService';
import { toast } from 'react-toastify';
import SmartTable from './SmartTable';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

interface UserFormData {
  username: string;
  password: string;
  email: string;
  name: string;
  roles: UserRole[];
}

interface FormErrors {
  username?: string;
  password?: string;
  email?: string;
  name?: string;
  roles?: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [searchValue, setSearchValue] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    password: '',
    email: '',
    name: '',
    roles: [],
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const currentUser = useAppSelector((state) => state.auth.user);
  const isLeader = currentUser?.roles?.includes(UserRole.LEADER) ?? false;
  const isSubLeader = currentUser?.roles?.includes(UserRole.SUB_LEADER) ?? false;

  const columns = [
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'roles',
      headerName: 'Roles',
      width: 200,
      renderCell: (params: any) => (
        <Box>
          {params.value.map((role: UserRole) => (
            <Chip
              key={role}
              label={role}
              color={getRoleColor(role)}
              size="small"
              sx={{ mr: 0.5 }}
            />
          ))}
        </Box>
      ),
    },
    {
      field: 'lastLoginAt',
      headerName: 'Last Login',
      width: 200,
      valueGetter: (params: any) => {
        if (!params) return 'Chưa đăng nhập';
        console.log('lastLoginAt value:', params);
        if (!params) return 'Chưa đăng nhập';
        try {
          const date = new Date(params);
          console.log('Parsed date:', date);
          if (isNaN(date.getTime())) {
            console.log('Invalid date');
            return 'Chưa đăng nhập';
          }
          const formattedDate = date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });
          console.log('Formatted date:', formattedDate);
          return formattedDate;
        } catch (error) {
          console.error('Error parsing date:', error);
          return 'Chưa đăng nhập';
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: any) => (
        <Box>
          <Button
            size="small"
            onClick={() => handleEditUser(params.row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          {isLeader && (
            <Button
              size="small"
              color="error"
              onClick={() => handleDeleteUser(params.row.username)}
            >
              Delete
            </Button>
          )}
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, [paginationModel.page, paginationModel.pageSize]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers(
        paginationModel.page,
        paginationModel.pageSize
      );
      setUsers(response.content);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '',
      email: user.email,
      name: user.name,
      roles: user.roles,
    });
    setOpenDialog(true);
  };

  const handleDeleteUser = async (username: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(username);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.username) errors.username = 'Username is required';
    if (!selectedUser && !formData.password) errors.password = 'Password is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.name) errors.name = 'Name is required';
    if (formData.roles.length === 0) errors.roles = 'At least one role is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (selectedUser) {
        await userService.updateUser(selectedUser.username, {
          email: formData.email,
          name: formData.name,
        });
        if (isLeader) {
          await userService.updateUserRoles(selectedUser.username, formData.roles);
        }
        toast.success('User updated successfully');
      } else {
        await userService.createUser({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          name: formData.name,
          roles: formData.roles,
        });
        toast.success('User created successfully');
      }
      setOpenDialog(false);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to save user');
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'error';
      case UserRole.LEADER:
        return 'warning';
      case UserRole.SUB_LEADER:
        return 'info';
      case UserRole.ACCOUNTANT:
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <SmartTable
        columns={columns}
        rows={users}
        rowCount={users.length}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onSearch={setSearchValue}
        searchValue={searchValue}
        onAdd={() => {
          setSelectedUser(null);
          setFormData({
            username: '',
            password: '',
            email: '',
            name: '',
            roles: [],
          });
          setOpenDialog(true);
        }}
        addLabel="Thêm người dùng"
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              error={!!formErrors.username}
              helperText={formErrors.username}
              disabled={!!selectedUser}
            />
            {!selectedUser && (
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
            )}
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            {(isLeader || !selectedUser) && (
              <FormControl fullWidth error={!!formErrors.roles}>
                <InputLabel>Roles</InputLabel>
                <Select<UserRole[]>
                  multiple
                  value={formData.roles}
                  onChange={(e) => setFormData({ ...formData, roles: e.target.value as UserRole[] })}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((role) => (
                        <Chip key={role} label={role} color={getRoleColor(role)} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {Object.values(UserRole)
                    .filter(role => role !== UserRole.ADMIN && role !== UserRole.USER)
                    .map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                </Select>
                {formErrors.roles && <FormHelperText>{formErrors.roles}</FormHelperText>}
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList; 