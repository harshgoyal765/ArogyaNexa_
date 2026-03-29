import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { AddToCartRequest, CartResponse, CartValidationResult } from '@/types/cart';

export const cartApi = {
  get: () =>
    api.get<ApiResponse<CartResponse>>('/api/v1/cart'),

  addItem: (data: AddToCartRequest) =>
    api.post<ApiResponse<CartResponse>>('/api/v1/cart/items', data),

  updateItem: (itemUuid: string, quantity: number) =>
    api.put<ApiResponse<CartResponse>>(`/api/v1/cart/items/${itemUuid}`, { quantity }),

  removeItem: (itemUuid: string) =>
    api.delete<ApiResponse<CartResponse>>(`/api/v1/cart/items/${itemUuid}`),

  clear: () =>
    api.delete('/api/v1/cart'),

  attachPrescription: (prescriptionId: string) =>
    api.post(`/api/v1/cart/prescription/${prescriptionId}`),

  validate: () =>
    api.get<ApiResponse<CartValidationResult>>('/api/v1/cart/validate'),
};
