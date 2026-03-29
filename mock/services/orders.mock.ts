/**
 * Mock Orders Service
 * Mirrors the interface of lib/api/orders.ts exactly.
 */

import type { ApiResponse, PagedResponse } from '@/types/api';
import type { OrderResponse, PlaceOrderRequest } from '@/types/order';
import { mockCall, ok, paginate, fail } from '@/mock/engine';
import { mockOrders } from '@/mock/data/orders';
import { mockProducts } from '@/mock/data/products';

let store: OrderResponse[] = [...mockOrders];
let orderCounter = store.length + 1;

export const mockOrdersService = {
  place: (data: PlaceOrderRequest) =>
    mockCall<OrderResponse>(() => {
      const now = new Date().toISOString();
      const newOrder: OrderResponse = {
        uuid: `ord-${Date.now()}`,
        customerId: 'usr-001',
        orderNumber: `ORD-${Date.now()}`,
        status: 'CREATED',
        paymentStatus: 'PENDING',
        items: [],
        subtotal: 0,
        discountAmount: 0,
        shippingAmount: 0,
        totalAmount: 0,
        requiresPrescription: false,
        prescriptionVerified: false,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        statusHistory: [
          { fromStatus: undefined, toStatus: 'CREATED', changedBy: 'system', createdAt: now },
        ],
        createdAt: now,
        updatedAt: now,
      };
      store = [newOrder, ...store];
      orderCounter++;
      return ok(newOrder, 'Order placed successfully');
    }),

  getById: (uuid: string) =>
    mockCall<OrderResponse>(() => {
      const order = store.find((o) => o.uuid === uuid);
      if (!order) fail(`Order ${uuid} not found`, 404);
      return ok(order!);
    }),

  list: (params?: { page?: number; size?: number; status?: string }) =>
    mockCall<PagedResponse<OrderResponse>>(() => {
      let results = [...store];
      if (params?.status) {
        results = results.filter((o) => o.status === params.status);
      }
      return ok(paginate(results, params?.page ?? 0, params?.size ?? 10));
    }),

  cancel: (uuid: string, reason: string) =>
    mockCall<null>(() => {
      const idx = store.findIndex((o) => o.uuid === uuid);
      if (idx === -1) fail(`Order ${uuid} not found`, 404);
      const now = new Date().toISOString();
      store[idx] = {
        ...store[idx],
        status: 'CANCELLED',
        cancellationReason: reason,
        cancelledAt: now,
        updatedAt: now,
        statusHistory: [
          ...store[idx].statusHistory,
          { fromStatus: store[idx].status, toStatus: 'CANCELLED', changedBy: 'customer', reason, createdAt: now },
        ],
      };
      return ok(null, 'Order cancelled');
    }),

  updateStatus: (uuid: string, status: string, reason?: string) =>
    mockCall<null>(() => {
      const idx = store.findIndex((o) => o.uuid === uuid);
      if (idx === -1) fail(`Order ${uuid} not found`, 404);
      const now = new Date().toISOString();
      store[idx] = {
        ...store[idx],
        status: status as OrderResponse['status'],
        updatedAt: now,
        statusHistory: [
          ...store[idx].statusHistory,
          { fromStatus: store[idx].status, toStatus: status, changedBy: 'admin', reason, createdAt: now },
        ],
      };
      return ok(null, 'Status updated');
    }),
};
