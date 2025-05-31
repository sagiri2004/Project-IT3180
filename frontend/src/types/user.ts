export enum UserRole {
  ADMIN = 'ADMIN',
  LEADER = 'LEADER',
  SUB_LEADER = 'SUB_LEADER',
  ACCOUNTANT = 'ACCOUNTANT',
  USER = 'USER'
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
} 