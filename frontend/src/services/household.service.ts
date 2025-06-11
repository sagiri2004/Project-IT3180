import api from './api';
import { Household, CreateHouseholdRequest, UpdateHouseholdRequest, HouseholdPage, HouseholdSearchParams } from '../types/household';
import { ApiResponse } from '../types/common';

const householdService = {
    async getAll(params: HouseholdSearchParams): Promise<HouseholdPage> {
        const response = await api.get<ApiResponse<HouseholdPage>>('/households', { params });
        return response.data.data;
    },

    async getById(id: number): Promise<Household> {
        const response = await api.get<ApiResponse<Household>>(`/households/${id}`);
        return response.data.data;
    },

    async getByCode(code: string): Promise<Household> {
        const response = await api.get<ApiResponse<Household>>(`/households/code/${code}`);
        return response.data.data;
    },

    async create(data: CreateHouseholdRequest): Promise<Household> {
        const response = await api.post<ApiResponse<Household>>('/households', data);
        return response.data.data;
    },

    async update(id: number, data: UpdateHouseholdRequest): Promise<Household> {
        const response = await api.put<ApiResponse<Household>>(`/households/${id}`, data);
        return response.data.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete<ApiResponse<void>>(`/households/${id}`);
    },

    async search(keyword: string): Promise<Household[]> {
        const response = await api.get<ApiResponse<Household[]>>('/households/search', {
            params: { keyword }
        });
        return response.data.data;
    },

    createHousehold: async (data: CreateHouseholdRequest): Promise<Household> => {
        const response = await api.post<ApiResponse<Household>>('/households', data);
        return response.data.data;
    },

    updateHousehold: async (id: number, data: UpdateHouseholdRequest): Promise<Household> => {
        const response = await api.put<ApiResponse<Household>>(`/households/${id}`, data);
        return response.data.data;
    },

    deleteHousehold: async (id: number): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/households/${id}`);
    },

    getHousehold: async (id: number): Promise<Household> => {
        const response = await api.get<ApiResponse<Household>>(`/households/${id}`);
        return response.data.data;
    },

    getHouseholds: async (
        page: number = 0,
        size: number = 10,
        sortBy: string = 'createdAt',
        direction: 'asc' | 'desc' = 'desc'
    ): Promise<HouseholdPage> => {
        const response = await api.get<ApiResponse<HouseholdPage>>(
            `/households?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
        );
        return response.data.data;
    }
};

export default householdService; 