'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Overview' },
  { href: '/admin/products', icon: 'inventory_2', label: 'Products' },
  { href: '/admin/orders', icon: 'receipt_long', label: 'Orders' },
  { href: '/admin/users', icon: 'group', label: 'Users' },
  { href: '/admin/payments', icon: 'payments', label: 'Payments' },
];

interface AdminNotification {
  id: string;
  type: 'order' | 'product' | 'user' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function AdminNotificationsPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN" blockSuperAdmin={true}>
      <AdminNotificationsContent />
    </ProtectedRoute>
  );
}

function AdminNotificationsContent() {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<AdminNotification[]>([
    { id: '1', type: 'order', title: 'New Order Received', message: 'Order #ORD-2024-10-24-001 placed by John Doe for ₹1,245.50', timestamp: '2024-10-24 14:32:00', read: false, priority: 'high' },
    { id: '2', type: 'product', title: 'Low Stock Alert', message: 'Paracetamol 500mg has only 5 units remaining', timestamp: '2024-10-24 13:15:00', read: false, priority: 'high' },
    { id: '3', type: 'payment', title: 'Payment Received', message: 'Payment of ₹2,340.75 received for Order #ORD-2024-10-24-003', timestamp: '2024-10-24 12:45:00', read: true, priority: 'medium' },
    { id: '4', type: 'user', title: 'New User Registration', message: 'New customer Sarah Williams registered', timestamp: '2024-10-24 11:20:00', read: true, priority: 'low' },
    { id: '5', type: 'order', title: 'Order Shipped', message: 'Order #ORD-2024-10-23-015 has been shipped', timestamp: '2024-10-24 10:30:00', read: true, priority: 'medium' },
    { id: '6', type: 'product', title: 'Product Expiring Soon', message: '14 products will expire within 30 days', timestamp: '2024-10-24 09:00:00', read: true, priority: 'high' },
    { id: '7', type: 'payment', title: 'Refund Processed', message: 'Refund of ₹780.25 processed for Order #ORD-2024-10-23-005', timestamp: '2024-10-23 16:45:00', read: true, priority: 'medium' },
    { id: '8', type: 'system', title: 'Daily Report Generated', message: 'Sales report for October 23 is ready', timestamp: '2024-10-23 23:59:00', read: true, priority: 'low' },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    showToast('Notification marked as read', 'success');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'success');
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-error-container text-error';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-surface-container text-outline';
      default: return 'bg-surface-container text-outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order': return 'receipt_long';
      case 'product': return 'inventory_2';
      case 'user': return 'group';
      case 'payment': return 'payments';
      case 'system': return 'settings';
      default: return 'notifications';
    }
  };

  return (
    <>
      <AdminSidebar title="ArogyaNexa" subtitle="Pharmacy Admin" navItems={NAV_ITEMS} />
      <div className="ml-64 min-h-screen bg-surface">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div>
            <h1 className="font-headline text-2xl text-primary">Notifications</h1>
            <p className="text-xs text-on-surface-variant">Admin alerts and updates</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/notifications"
              className="relative p-2 text-primary transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link 
              href="/admin/profile"
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div className="flex gap-3">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  filter === 'all' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-low'
                )}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  filter === 'unread' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-low'
                )}
              >
                Unread ({unreadCount})
              </button>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-tertiary-fixed text-tertiary hover:bg-tertiary-fixed-dim transition-colors"
              >
                Mark All Read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="card p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">notifications_off</span>
                <h3 className="text-xl font-semibold text-on-surface mb-2">No notifications</h3>
                <p className="text-on-surface-variant">You're all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'card p-6 transition-all hover:shadow-primary-sm',
                    !notification.read && 'border-l-4 border-primary bg-primary-fixed/10'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                      notification.priority === 'high' ? 'bg-error/10' :
                      notification.priority === 'medium' ? 'bg-amber-100' :
                      'bg-surface-container-low'
                    )}>
                      <span className={cn(
                        'material-symbols-outlined',
                        notification.priority === 'high' ? 'text-error' :
                        notification.priority === 'medium' ? 'text-amber-600' :
                        'text-on-surface-variant'
                      )}>
                        {getTypeIcon(notification.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-on-surface">{notification.title}</h3>
                          <span className={cn('badge text-xs', getPriorityColor(notification.priority))}>
                            {notification.priority.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs text-on-surface-variant whitespace-nowrap">
                          {notification.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant mb-3">{notification.message}</p>
                      <div className="flex items-center gap-3">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-primary hover:underline font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                        <button className="text-xs text-on-surface-variant hover:text-primary transition-colors">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
