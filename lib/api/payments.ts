import api from '@/lib/axios';
import type { ApiResponse, PagedResponse } from '@/types/api';

export interface PaymentResponse {
  uuid: string;
  orderUuid: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  failureReason?: string;
  paidAt?: string;
  expiresAt: string;
  createdAt: string;
}

export const paymentsApi = {
  initiate: (orderUuid: string, amount: number, paymentMethod: 'RAZORPAY' | 'COD' | 'WALLET') =>
    api.post<ApiResponse<PaymentResponse>>('/api/v1/payments/initiate', {
      orderUuid,
      amount,
      paymentMethod,
    }),

  verify: (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) =>
    api.post('/api/v1/payments/verify', {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    }),

  list: (params?: { page?: number; size?: number }) =>
    api.get<ApiResponse<PagedResponse<PaymentResponse>>>('/api/v1/payments', { params }),

  refund: (paymentUuid: string, reason: string) =>
    api.post<ApiResponse<null>>('/api/v1/payments/refund', { paymentUuid, reason }),

  getByUuid: (uuid: string) =>
    api.get<ApiResponse<PaymentResponse>>(`/api/v1/payments/${uuid}`),
};
