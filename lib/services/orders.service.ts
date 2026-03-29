/**
 * Orders Service — Unified API Router
 */

import { ordersApi } from '@/lib/api/orders';
import { mockOrdersService } from '@/mock/services/orders.mock';
import { USE_MOCK_DATA, logServiceMode } from '@/lib/config';

logServiceMode('OrdersService', USE_MOCK_DATA);

const USE_MOCK = USE_MOCK_DATA;

export const ordersService = USE_MOCK
  ? {
      place:        mockOrdersService.place,
      getById:      mockOrdersService.getById,
      list:         mockOrdersService.list,
      cancel:       mockOrdersService.cancel,
      updateStatus: mockOrdersService.updateStatus,
    }
  : {
      place:        ordersApi.place,
      getById:      ordersApi.getById,
      list:         ordersApi.list,
      cancel:       ordersApi.cancel,
      updateStatus: ordersApi.updateStatus,
    };
