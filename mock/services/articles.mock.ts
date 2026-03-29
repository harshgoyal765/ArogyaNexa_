/**
 * Mock Articles / Wellness Service
 * Covers the wellness hub and health article detail pages.
 */

import type { ApiResponse, PagedResponse } from '@/types/api';
import { mockCall, ok, paginate, fail } from '@/mock/engine';
import { mockArticles, mockPrescriptions } from '@/mock/data/articles';

export interface ArticleItem {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  verified: boolean;
}

export interface PrescriptionItem {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  fileUrl: string;
  notes?: string;
  createdAt: string;
}

let articleStore: ArticleItem[] = [...mockArticles];
let prescriptionStore: PrescriptionItem[] = [...mockPrescriptions] as PrescriptionItem[];

export const mockArticlesService = {
  list: (params?: { page?: number; size?: number; category?: string }) =>
    mockCall<PagedResponse<ArticleItem>>(() => {
      let results = [...articleStore];
      if (params?.category) {
        results = results.filter(
          (a) => a.category.toLowerCase() === params.category!.toLowerCase()
        );
      }
      return ok(paginate(results, params?.page ?? 0, params?.size ?? 6));
    }),

  getBySlug: (slug: string) =>
    mockCall<ArticleItem>(() => {
      const article = articleStore.find((a) => a.slug === slug);
      if (!article) fail(`Article "${slug}" not found`, 404);
      return ok(article!);
    }),
};

export const mockPrescriptionsService = {
  list: (params?: { status?: string }) =>
    mockCall<PrescriptionItem[]>(() => {
      let results = [...prescriptionStore];
      if (params?.status) {
        results = results.filter((p) => p.status === params.status);
      }
      return ok(results);
    }),

  upload: (file: File, notes?: string) =>
    mockCall<PrescriptionItem>(() => {
      const newRx: PrescriptionItem = {
        id: `RX-${Date.now()}`,
        status: 'PENDING',
        fileUrl: URL.createObjectURL(file),
        notes,
        createdAt: new Date().toISOString(),
      };
      prescriptionStore = [newRx, ...prescriptionStore];
      return ok(newRx, 'Prescription uploaded successfully');
    }),

  approve: (id: string) =>
    mockCall<null>(() => {
      const rx = prescriptionStore.find((p) => p.id === id);
      if (!rx) fail(`Prescription ${id} not found`, 404);
      rx!.status = 'APPROVED';
      return ok(null, 'Prescription approved');
    }),

  reject: (id: string) =>
    mockCall<null>(() => {
      const rx = prescriptionStore.find((p) => p.id === id);
      if (!rx) fail(`Prescription ${id} not found`, 404);
      rx!.status = 'REJECTED';
      return ok(null, 'Prescription rejected');
    }),
};
