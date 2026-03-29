export type OrderStatus =
  | 'CREATED'
  | 'PENDING_PRESCRIPTION'
  | 'APPROVED'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface ShippingAddressDto {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItemResponse {
  uuid: string;
  productId: number;
  productName: string;
  productSlug: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  prescriptionRequired: boolean;
  scheduleType?: string;
}

export interface OrderStatusHistoryResponse {
  fromStatus?: string;
  toStatus: string;
  changedBy: string;
  reason?: string;
  createdAt: string;
}

export interface OrderResponse {
  uuid: string;
  customerId: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItemResponse[];
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  totalAmount: number;
  requiresPrescription: boolean;
  prescriptionVerified: boolean;
  prescriptionId?: string;
  shippingAddress: ShippingAddressDto;
  paymentId?: string;
  paymentMethod?: string;
  paidAt?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  notes?: string;
  statusHistory: OrderStatusHistoryResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface PlaceOrderRequest {
  shippingAddress: ShippingAddressDto;
  paymentMethod?: string;
  notes?: string;
}
