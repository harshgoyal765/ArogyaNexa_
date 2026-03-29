/**
 * Products Service — Unified API Router
 * ─────────────────────────────────────────────────────────────────────────────
 * Components import from HERE, never from lib/api or mock directly.
 *
 * To switch to real API:
 *   Set NEXT_PUBLIC_USE_MOCK_API=false in .env.local
 *   No component changes required.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { productsApi } from '@/lib/api/products';
import { mockProductsService } from '@/mock/services/products.mock';
import { USE_MOCK_DATA, logServiceMode } from '@/lib/config';
import type { ProductSearchParams } from '@/types/product';

logServiceMode('ProductsService', USE_MOCK_DATA);

const USE_MOCK = USE_MOCK_DATA;

export const productsService = USE_MOCK
  ? {
      list:            mockProductsService.list,
      getById:         mockProductsService.getById,
      search:          mockProductsService.search,
      getAlternatives: mockProductsService.getAlternatives,
      create:          mockProductsService.create,
      update:          mockProductsService.update,
      delete:          mockProductsService.delete,
    }
  : {
      list:            productsApi.list,
      getById:         productsApi.getById,
      search:          productsApi.search,
      getAlternatives: productsApi.getAlternatives,
      create:          productsApi.create,
      update:          productsApi.update,
      delete:          productsApi.delete,
    };
