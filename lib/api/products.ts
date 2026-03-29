import api from '@/lib/axios';
import type { ApiResponse, PagedResponse } from '@/types/api';
import type { ProductResponse, ProductSearchParams } from '@/types/product';

export const productsApi = {
  list: (params?: { page?: number; size?: number; sort?: string; dir?: string }) =>
    api.get<ApiResponse<PagedResponse<ProductResponse>>>('/api/v1/products', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<ProductResponse>>(`/api/v1/products/${id}`),

  search: (params: ProductSearchParams) =>
    api.get<ApiResponse<PagedResponse<ProductResponse>>>('/api/v1/products/search', { params }),

  getAlternatives: (id: number) =>
    api.get<ApiResponse<ProductResponse[]>>(`/api/v1/products/${id}/alternatives`),

  getExpirySorted: (params?: { page?: number; size?: number }) =>
    api.get<ApiResponse<PagedResponse<ProductResponse>>>('/api/v1/products/expiry-sorted', { params }),

  create: (formData: FormData) =>
    api.post<ApiResponse<ProductResponse>>('/api/v1/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: number, formData: FormData) =>
    api.put<ApiResponse<ProductResponse>>(`/api/v1/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id: number) =>
    api.delete(`/api/v1/products/${id}`),
};
