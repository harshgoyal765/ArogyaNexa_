/**
 * Cart Service — Unified API Router
 */

import { cartApi } from '@/lib/api/cart';
import { mockCartService } from '@/mock/services/cart.mock';
import { USE_MOCK_DATA, logServiceMode } from '@/lib/config';

logServiceMode('CartService', USE_MOCK_DATA);

const USE_MOCK = USE_MOCK_DATA;

export const cartService = USE_MOCK
  ? {
      get:                mockCartService.get,
      addItem:            mockCartService.addItem,
      updateItem:         mockCartService.updateItem,
      removeItem:         mockCartService.removeItem,
      clear:              mockCartService.clear,
      attachPrescription: mockCartService.attachPrescription,
      validate:           mockCartService.validate,
    }
  : {
      get:                cartApi.get,
      addItem:            cartApi.addItem,
      updateItem:         cartApi.updateItem,
      removeItem:         cartApi.removeItem,
      clear:              cartApi.clear,
      attachPrescription: cartApi.attachPrescription,
      validate:           cartApi.validate,
    };
