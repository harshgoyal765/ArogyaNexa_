/**
 * Articles & Prescriptions Service — Unified API Router
 * Real API endpoints (when backend is ready):
 *   GET /api/v1/articles
 *   GET /api/v1/articles/:slug
 *   GET /api/v1/prescriptions
 *   POST /api/v1/prescriptions
 *   PUT  /api/v1/prescriptions/:id/approve
 *   PUT  /api/v1/prescriptions/:id/reject
 */

import api from '@/lib/axios';
import {
  mockArticlesService,
  mockPrescriptionsService,
} from '@/mock/services/articles.mock';
import { USE_MOCK_DATA, logServiceMode } from '@/lib/config';
import type { ApiResponse, PagedResponse } from '@/types/api';
import type { ArticleItem, PrescriptionItem } from '@/mock/services/articles.mock';

logServiceMode('ArticlesService', USE_MOCK_DATA);

const USE_MOCK = USE_MOCK_DATA;

// ── Real API stubs (swap in when backend is ready) ──────────────────────────
const realArticlesService = {
  list: (params?: { page?: number; size?: number; category?: string }) =>
    api.get<ApiResponse<PagedResponse<ArticleItem>>>('/api/v1/articles', { params }),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<ArticleItem>>(`/api/v1/articles/${slug}`),
};

const realPrescriptionsService = {
  list: (params?: { status?: string }) =>
    api.get<ApiResponse<PrescriptionItem[]>>('/api/v1/prescriptions', { params }),

  upload: (file: File, notes?: string) => {
    const fd = new FormData();
    fd.append('file', file);
    if (notes) fd.append('notes', notes);
    return api.post<ApiResponse<PrescriptionItem>>('/api/v1/prescriptions', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  approve: (id: string) =>
    api.put<ApiResponse<null>>(`/api/v1/prescriptions/${id}/approve`),

  reject: (id: string) =>
    api.put<ApiResponse<null>>(`/api/v1/prescriptions/${id}/reject`),
};

// ── Exported services ────────────────────────────────────────────────────────
export const articlesService = USE_MOCK ? mockArticlesService : realArticlesService;
export const prescriptionsService = USE_MOCK ? mockPrescriptionsService : realPrescriptionsService;

// Re-export types so consumers don't need to import from mock
export type { ArticleItem, PrescriptionItem };
