import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../../types/auth';
import authService from '../../services/auth.service';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: authService.getCurrentUser(),
    token: authService.getToken(),
    isLoading: false,
    error: null,
    isAuthenticated: !!authService.getToken()
};

export const login = createAsyncThunk<AuthResponse, LoginRequest>(
    'auth/login',
    async (data, { rejectWithValue }) => {
        try {
            const response = await authService.login(data);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    }
);

export const register = createAsyncThunk<AuthResponse, RegisterRequest>(
    'auth/register',
    async (data, { rejectWithValue }) => {
        try {
            const response = await authService.register(data);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            authService.logout();
            state.user = null;
            state.token = null;
            state.error = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 