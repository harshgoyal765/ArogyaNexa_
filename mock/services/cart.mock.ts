/**
 * Mock Cart Service
 * Mirrors the interface of lib/api/cart.ts exactly.
 */

import type { ApiResponse } from '@/types/api';
import type { AddToCartRequest, CartResponse, CartValidationResult } from '@/types/cart';
import { mockCall, ok, fail } from '@/mock/engine';
import { mockCart } from '@/mock/data/cart';
import { mockProducts } from '@/mock/data/products';

// Mutable in-session cart
let cart: CartResponse = JSON.parse(JSON.stringify(mockCart));

const recalculate = (): void => {
  cart.itemCount = cart.items.reduce((s, i) => s + i.quantity, 0);
  cart.totalPrice = cart.items.reduce((s, i) => s + i.lineTotal, 0);
  cart.requiresPrescription = cart.items.some((i) => i.prescriptionRequired);
  cart.updatedAt = new Date().toISOString();
};

export const mockCartService = {
  get: () =>
    mockCall<CartResponse>(() => ok({ ...cart })),

  addItem: (data: AddToCartRequest) =>
    mockCall<CartResponse>(() => {
      const product = mockProducts.find((p) => p.id === data.productId);
      if (!product) fail(`Product ${data.productId} not found`, 404);
      if (product!.quantityAvailable < data.quantity) fail('Insufficient stock');

      const existing = cart.items.find((i) => i.productId === data.productId);
      if (existing) {
        existing.quantity += data.quantity;
        existing.lineTotal = existing.quantity * existing.unitPrice;
      } else {
        cart.items.push({
          uuid: `ci-${Date.now()}`,
          productId: product!.id,
          productName: product!.name,
          productSlug: product!.slug,
          quantity: data.quantity,
          unitPrice: product!.finalPrice,
          currentPrice: product!.finalPrice,
          lineTotal: product!.finalPrice * data.quantity,
          prescriptionRequired: product!.prescriptionRequired,
          nearExpiry: product!.nearExpiry,
          expiryDate: product!.expiryDate,
          scheduleType: product!.scheduleType,
          priceChanged: false,
          addedAt: new Date().toISOString(),
        });
      }
      recalculate();
      return ok({ ...cart }, 'Item added to cart');
    }),

  updateItem: (itemUuid: string, quantity: number) =>
    mockCall<CartResponse>(() => {
      const item = cart.items.find((i) => i.uuid === itemUuid);
      if (!item) fail(`Cart item ${itemUuid} not found`, 404);
      if (quantity < 1) fail('Quantity must be at least 1');
      item!.quantity = quantity;
      item!.lineTotal = item!.unitPrice * quantity;
      recalculate();
      return ok({ ...cart }, 'Cart updated');
    }),

  removeItem: (itemUuid: string) =>
    mockCall<CartResponse>(() => {
      const idx = cart.items.findIndex((i) => i.uuid === itemUuid);
      if (idx === -1) fail(`Cart item ${itemUuid} not found`, 404);
      cart.items.splice(idx, 1);
      recalculate();
      return ok({ ...cart }, 'Item removed');
    }),

  clear: () =>
    mockCall<null>(() => {
      cart.items = [];
      recalculate();
      return ok(null, 'Cart cleared');
    }),

  attachPrescription: (prescriptionId: string) =>
    mockCall<null>(() => {
      cart.prescriptionId = prescriptionId;
      cart.prescriptionValidated = true;
      return ok(null, 'Prescription attached');
    }),

  validate: () =>
    mockCall<CartValidationResult>(() => {
      const issues = cart.items
        .filter((i) => i.prescriptionRequired && !cart.prescriptionValidated)
        .map((i) => ({
          itemUuid: i.uuid,
          productName: i.productName,
          issueType: 'PRESCRIPTION_REQUIRED',
          message: `${i.productName} requires a valid prescription.`,
        }));
      return ok({ readyForCheckout: issues.length === 0, issues });
    }),
};
