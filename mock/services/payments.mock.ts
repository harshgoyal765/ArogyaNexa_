/**
 * Mock Payments Service
 * Mirrors the interface of lib/api/payments.ts exactly.
 */

import type { ApiResponse, PagedResponse } from '@/types/api';
import type { PaymentResponse } from '@/lib/api/payments';
import { mockCall, ok, fail, paginate } from '@/mock/engine';

let store: PaymentResponse[] = [];

export const mockPaymentsService = {
  initiate: (
    orderUuid: string,
    amount: number,
    paymentMethod: 'RAZORPAY' | 'COD' | 'WALLET'
  ) =>
    mockCall<PaymentResponse>(() => {
      const payment: PaymentResponse = {
        uuid: `pay-${Date.now()}`,
        orderUuid,
        amount,
        currency: 'INR',
        paymentMethod,
        status: paymentMethod === 'COD' ? 'SUCCESS' : 'INITIATED',
        gatewayOrderId: `order_mock_${Date.now()}`,
        gatewayPaymentId: paymentMethod === 'COD' ? `pay_cod_${Date.now()}` : undefined,
        paidAt: paymentMethod === 'COD' ? new Date().toISOString() : undefined,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        createdAt: new Date().toISOString(),
      };
      store.push(payment);
      return ok(payment, 'Payment initiated');
    }),

  verify: (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    _razorpaySignature: string
  ) =>
    mockCall<null>(() => {
      const payment = store.find((p) => p.gatewayOrderId === razorpayOrderId);
      if (!payment) fail('Payment not found', 404);
      payment!.status = 'SUCCESS';
      payment!.gatewayPaymentId = razorpayPaymentId;
      payment!.paidAt = new Date().toISOString();
      return ok(null, 'Payment verified');
    }),

  list: (params?: { page?: number; size?: number }) =>
    mockCall<PagedResponse<PaymentResponse>>(() =>
      ok(paginate(store, params?.page ?? 0, params?.size ?? 10))
    ),

  refund: (paymentUuid: string, reason: string) =>
    mockCall<null>(() => {
      const payment = store.find((p) => p.uuid === paymentUuid);
      if (!payment) fail(`Payment ${paymentUuid} not found`, 404);
      payment!.status = 'REFUNDED';
      return ok(null, 'Refund initiated');
    }),

  getByUuid: (uuid: string) =>
    mockCall<PaymentResponse>(() => {
      const payment = store.find((p) => p.uuid === uuid);
      if (!payment) fail(`Payment ${uuid} not found`, 404);
      return ok(payment!);
    }),
};
