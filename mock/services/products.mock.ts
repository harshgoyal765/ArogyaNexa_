/**
 * Mock Products Service
 * Mirrors the interface of lib/api/products.ts exactly.
 * Swap by setting USE_MOCK_API=false — no component changes needed.
 */

import type { ApiResponse, PagedResponse } from '@/types/api';
import type { ProductResponse, ProductSearchParams } from '@/types/product';
import { mockCall, ok, paginate, fail } from '@/mock/engine';
import { mockProducts } from '@/mock/data/products';

// In-memory mutable store so create/update/delete work within a session
let store: ProductResponse[] = [...mockProducts];

export const mockProductsService = {
  list: (params?: { page?: number; size?: number }) =>
    mockCall<PagedResponse<ProductResponse>>(() =>
      ok(paginate(store, params?.page ?? 0, params?.size ?? 12))
    ),

  getById: (id: number) =>
    mockCall<ProductResponse>(() => {
      const product = store.find((p) => p.id === id);
      if (!product) fail(`Product ${id} not found`, 404);
      return ok(product!);
    }),

  search: (params: ProductSearchParams) =>
    mockCall<PagedResponse<ProductResponse>>(() => {
      let results = [...store];

      if (params.keyword) {
        const kw = params.keyword.toLowerCase();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(kw) ||
            p.saltComposition.toLowerCase().includes(kw) ||
            p.description.toLowerCase().includes(kw)
        );
      }
      if (params.scheduleType) {
        results = results.filter((p) => p.scheduleType === params.scheduleType);
      }
      if (params.dosageForm) {
        results = results.filter((p) => p.dosageForm === params.dosageForm);
      }
      if (params.prescriptionRequired !== undefined) {
        results = results.filter(
          (p) => p.prescriptionRequired === params.prescriptionRequired
        );
      }
      if (params.nearExpiry) {
        results = results.filter((p) => p.nearExpiry);
      }

      // Sorting
      const sortBy = (params.sortBy ?? 'name') as keyof ProductResponse;
      const dir = params.sortDir === 'desc' ? -1 : 1;
      results.sort((a, b) => {
        const av = a[sortBy] as string | number;
        const bv = b[sortBy] as string | number;
        return av < bv ? -dir : av > bv ? dir : 0;
      });

      return ok(paginate(results, params.page ?? 0, params.size ?? 12));
    }),

  getAlternatives: (id: number) =>
    mockCall<ProductResponse[]>(() => {
      const product = store.find((p) => p.id === id);
      if (!product) return ok([]);
      const alts = store
        .filter(
          (p) =>
            p.id !== id &&
            (p.categoryId === product.categoryId ||
              p.saltComposition
                .toLowerCase()
                .includes(product.saltComposition.split(' ')[0].toLowerCase()))
        )
        .slice(0, 4);
      return ok(alts);
    }),

  create: (formData: FormData) =>
    mockCall<ProductResponse>(() => {
      const raw = formData.get('product');
      if (!raw) fail('Missing product data');
      const payload = JSON.parse(raw as string);
      const newProduct: ProductResponse = {
        ...payload,
        id: Math.max(...store.map((p) => p.id)) + 1,
        uuid: `prod-${Date.now()}`,
        mainImageUrl: '',
        extraImageUrls: [],
        createdAt: new Date().toISOString(),
      };
      store = [...store, newProduct];
      return ok(newProduct, 'Product created');
    }),

  update: (id: number, formData: FormData) =>
    mockCall<ProductResponse>(() => {
      const raw = formData.get('product');
      if (!raw) fail('Missing product data');
      const payload = JSON.parse(raw as string);
      const idx = store.findIndex((p) => p.id === id);
      if (idx === -1) fail(`Product ${id} not found`, 404);
      store[idx] = { ...store[idx], ...payload };
      return ok(store[idx], 'Product updated');
    }),

  delete: (id: number) =>
    mockCall<null>(() => {
      const idx = store.findIndex((p) => p.id === id);
      if (idx === -1) fail(`Product ${id} not found`, 404);
      store = store.filter((p) => p.id !== id);
      return ok(null, 'Product deleted');
    }),
};
