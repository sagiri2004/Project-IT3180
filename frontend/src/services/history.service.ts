import api from './api';

export interface HistoryRecord {
  id: number;
  entityType: string;
  entityId: number;
  actionType: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const historyService = {
  getAll: (page: number, size: number) => 
    api.get<ApiResponse<PaginatedResponse<HistoryRecord>>>('/history', {
      params: { page, size }
    }),
  
  getById: (id: number) =>
    api.get<ApiResponse<HistoryRecord>>(`/history/${id}`),
  
  getByEntity: (entityType: string, entityId: number) =>
    api.get<ApiResponse<HistoryRecord[]>>(`/history/entity/${entityType}/${entityId}`),
  
  getByEntityType: (entityType: string) =>
    api.get<ApiResponse<HistoryRecord[]>>(`/history/entity-type/${entityType}`),
  
  getByActionType: (actionType: string) =>
    api.get<ApiResponse<HistoryRecord[]>>(`/history/action-type/${actionType}`),
}; 