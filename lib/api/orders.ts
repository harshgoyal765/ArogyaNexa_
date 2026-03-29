import api from '@/lib/axios';
import type { ApiResponse, PagedResponse } from '@/types/api';
import type { OrderResponse, PlaceOrderRequest } from '@/types/order';

export const ordersApi = {
  place: (data: PlaceOrderRequest) =>
    api.post<ApiResponse<OrderResponse>>('/api/v1/orders', data),

  getById: (uuid: string) =>
    api.get<ApiResponse<OrderResponse>>(`/api/v1/orders/${uuid}`),

  list: (params?: { page?: number; size?: number; status?: string }) =>
    api.get<ApiResponse<PagedResponse<OrderResponse>>>('/api/v1/orders', { params }),

  cancel: (uuid: string, reason: string) =>
    api.post(`/api/v1/orders/${uuid}/cancel`, { reason }),

  updateStatus: (uuid: string, status: string, reason?: string) =>
    api.put(`/api/v1/orders/${uuid}/status`, { status, reason }),
};
