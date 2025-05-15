export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    ACCOUNTANT = 'ACCOUNTANT',
    LEADER = 'LEADER',
    SUB_LEADER = 'SUB_LEADER'
}

export interface User {
    id: number;
    username: string;
    email: string;
    name: string;
    role: string;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        username: string;
        email: string;
        role: string;
    };
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    name: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface Authority {
  authority: string;
}

export interface ApiError {
    message: string;
    timestamp: string;
    status: number;
    error: string;
    path: string;
} 