import { cn, getOrderStatusColor } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_LABELS: Record<string, string> = {
  CREATED: 'Created',
  PENDING_PRESCRIPTION: 'Pending Rx',
  APPROVED: 'Approved',
  PAYMENT_PENDING: 'Payment Pending',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export default function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <span className={cn('badge', getOrderStatusColor(status), className)}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
