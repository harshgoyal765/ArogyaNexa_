'use client';
import { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import PharmacistSidebar from '@/components/layout/PharmacistSidebar';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'prescription' | 'inventory' | 'order' | 'system' | 'urgent';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

const NOTIFICATIONS: Notification[] = [
  { id: 'N-001', type: 'urgent', title: 'Critical Prescription Review', message: 'Prescription RX-D003 flagged for drug interaction - immediate review required', time: '5 min ago', read: false, priority: 'high' },
  { id: 'N-002', type: 'prescription', title: 'New Prescription Received', message: 'Dr. Sarah Thorne submitted prescription for Elena Rodriguez', time: '15 min ago', read: false, priority: 'high' },
  { id: 'N-003', type: 'inventory', title: 'Low Stock Alert', message: 'Metformin 500mg stock below minimum threshold (15 units remaining)', time: '30 min ago', read: false, priority: 'medium' },
  { id: 'N-004', type: 'order', title: 'Order Ready for Pickup', message: 'Order #ORD-1234 has been prepared and is ready for customer pickup', time: '1 hour ago', read: false, priority: 'medium' },
  { id: 'N-005', type: 'prescription', title: 'Refill Request', message: 'Patient David Kumar requested refill for Albuterol Inhaler', time: '2 hours ago', read: true, priority: 'low' },
  { id: 'N-006', type: 'inventory', title: 'Stock Replenishment', message: 'Shipment received: 50 units of Atorvastatin 20mg added to inventory', time: '3 hours ago', read: true, priority: 'low' },
  { id: 'N-007', type: 'system', title: 'System Maintenance', message: 'Pharmacy management system will undergo maintenance tonight at 11 PM', time: '5 hours ago', read: true, priority: 'low' },
  { id: 'N-008', type: 'order', title: 'Delivery Scheduled', message: 'Order #ORD-1230 scheduled for home delivery tomorrow 10 AM - 2 PM', time: '1 day ago', read: true, priority: 'low' },
];

export default function PharmacistNotificationsPage() {
  return (
    <ProtectedRoute requiredRole={['PHARMACIST', 'ADMIN', 'SUPER_ADMIN']}>
      <PharmacistNotificationsContent />
    </ProtectedRoute>
  );
}

function PharmacistNotificationsContent() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent' | 'prescription' | 'inventory'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'urgent') return n.priority === 'high';
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    showToast('Marked as read', 'success');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'success');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification deleted', 'success');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return 'warning';
      case 'prescription': return 'medication';
      case 'inventory': return 'inventory_2';
      case 'order': return 'shopping_bag';
      case 'system': return 'settings';
      default: return 'notifications';
    }
  };

  const getTypeColor = (type: string, priority: string) => {
    if (priority === 'high') return 'bg-error-container text-error';
    switch (type) {
      case 'prescription': return 'bg-tertiary-fixed text-tertiary';
      case 'inventory': return 'bg-primary-fixed text-primary';
      case 'order': return 'bg-secondary-container text-secondary';
      case 'system': return 'bg-surface-container text-outline';
      default: return 'bg-surface-container text-outline';
    }
  };

  return (
    <div className="bg-surface min-h-screen flex">
      <PharmacistSidebar />
      
      <div className="ml-64 flex-1 min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div>
            <h1 className="font-headline text-2xl text-primary">Notifications</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/pharmacist/notifications"
              className="p-2 text-primary transition-colors relative"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
              )}
            </Link>
            <Link 
              href="/pharmacist/profile"
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-on-surface-variant text-sm">
                You have <span className="font-bold text-primary">{unreadCount} unread</span> notifications
              </p>
            </div>
            <button 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">done_all</span>
              Mark All as Read
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'urgent', label: 'Urgent', count: notifications.filter(n => n.priority === 'high').length },
              { id: 'prescription', label: 'Prescriptions', count: notifications.filter(n => n.type === 'prescription').length },
              { id: 'inventory', label: 'Inventory', count: notifications.filter(n => n.type === 'inventory').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={cn(
                  'px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap',
                  filter === tab.id 
                    ? 'bg-primary text-white' 
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="card p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-outline mb-4">notifications_off</span>
                <p className="text-on-surface-variant">No notifications to display</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    'card p-6 transition-all hover:shadow-lg',
                    !notification.read && 'border-l-4 border-primary bg-primary-fixed/5'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn('w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0', getTypeColor(notification.type, notification.priority))}>
                      <span className="material-symbols-outlined text-xl">{getTypeIcon(notification.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-on-surface mb-1">{notification.title}</h3>
                          <p className="text-sm text-on-surface-variant">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-outline">{notification.time}</span>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-primary hover:underline"
                            >
                              Mark as read
                            </button>
                          )}
                          <button 
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-error hover:underline"
                          >
                            Delete
                          </button>
                        </div>
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
    </div>
  );
}
