/**
 * Payments Service — Unified API Router
 */

import { paymentsApi } from '@/lib/api/payments';
import { mockPaymentsService } from '@/mock/services/payments.mock';
import { USE_MOCK_DATA, logServiceMode } from '@/lib/config';

logServiceMode('PaymentsService', USE_MOCK_DATA);

const USE_MOCK = USE_MOCK_DATA;

export const paymentsService = USE_MOCK
  ? {
      initiate:  mockPaymentsService.initiate,
      verify:    mockPaymentsService.verify,
      list:      mockPaymentsService.list,
      refund:    mockPaymentsService.refund,
      getByUuid: mockPaymentsService.getByUuid,
    }
  : {
      initiate:  paymentsApi.initiate,
      verify:    paymentsApi.verify,
      list:      paymentsApi.list,
      refund:    paymentsApi.refund,
      getByUuid: paymentsApi.getByUuid,
    };
