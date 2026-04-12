'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/doctor', icon: 'dashboard', label: 'Dashboard' },
  { href: '/doctor/patients', icon: 'people', label: 'Patients' },
  { href: '/doctor/prescriptions', icon: 'description', label: 'Prescriptions' },
  { href: '/doctor/schedule', icon: 'calendar_month', label: 'Schedule' },
  { href: '/ai-assistant', icon: 'smart_toy', label: 'AI Assistant' },
];

interface Notification {
  id: string;
  type: 'appointment' | 'prescription' | 'patient' | 'system' | 'urgent';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

const NOTIFICATIONS: Notification[] = [
  { id: 'N-001', type: 'urgent', title: 'Critical Patient Alert', message: 'Sarah Chen flagged for cardiac symptoms - immediate review required', time: '5 min ago', read: false, priority: 'high' },
  { id: 'N-002', type: 'prescription', title: 'Prescription Conflict', message: 'Pharmacist David Wu flagged potential drug interaction for Elena Rodriguez', time: '15 min ago', read: false, priority: 'high' },
  { id: 'N-003', type: 'appointment', title: 'Appointment Reminder', message: 'Marcus Holloway consultation scheduled in 30 minutes', time: '30 min ago', read: false, priority: 'medium' },
  { id: 'N-004', type: 'patient', title: 'Lab Results Available', message: 'HbA1c test results ready for Elena Rodriguez', time: '1 hour ago', read: false, priority: 'medium' },
  { id: 'N-005', type: 'prescription', title: 'Refill Request', message: 'David Kumar requested refill for Albuterol Inhaler', time: '2 hours ago', read: true, priority: 'low' },
  { id: 'N-006', type: 'appointment', title: 'Appointment Cancelled', message: 'Lisa Anderson cancelled tomorrow\'s follow-up appointment', time: '3 hours ago', read: true, priority: 'low' },
  { id: 'N-007', type: 'system', title: 'EHR System Update', message: 'Electronic Health Records system will undergo maintenance tonight at 11 PM', time: '5 hours ago', read: true, priority: 'low' },
  { id: 'N-008', type: 'patient', title: 'New Patient Registration', message: 'New patient John Smith assigned to your care', time: '1 day ago', read: true, priority: 'low' },
];

export default function DoctorNotificationsPage() {
  return (
    <ProtectedRoute requiredRole="DOCTOR">
      <DoctorNotificationsContent />
    </ProtectedRoute>
  );
}

function DoctorNotificationsContent() {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent' | 'prescription' | 'appointment'>('all');

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
      case 'appointment': return 'event';
      case 'patient': return 'person';
      case 'system': return 'settings';
      default: return 'notifications';
    }
  };

  const getTypeColor = (type: string, priority: string) => {
    if (priority === 'high') return 'bg-error-container text-error';
    switch (type) {
      case 'prescription': return 'bg-tertiary-fixed text-tertiary';
      case 'appointment': return 'bg-primary-fixed text-primary';
      case 'patient': return 'bg-secondary-container text-secondary';
      case 'system': return 'bg-surface-container text-outline';
      default: return 'bg-surface-container text-outline';
    }
  };

  return (
    <div className="bg-surface min-h-screen flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-100 bg-slate-50 flex flex-col z-40">
        <div className="p-8">
          <Link href="/" className="font-headline italic text-2xl text-primary block mb-1">ArogyaNexa</Link>
          <p className="text-xs text-outline font-label uppercase tracking-widest">Doctor Portal</p>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={cn('flex items-center gap-3 px-4 py-3 text-xs font-medium uppercase tracking-wide transition-all hover:translate-x-1 duration-200',
                  active ? 'text-primary font-semibold border-r-4 border-primary bg-primary-fixed/30' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                )}>
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="ml-64 flex-1 min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div>
            <h1 className="font-headline text-2xl text-primary">Notifications</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/doctor/notifications"
              className="p-2 text-primary transition-colors relative"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
              )}
            </Link>
            <Link 
              href="/doctor/profile" 
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
              { id: 'appointment', label: 'Appointments', count: notifications.filter(n => n.type === 'appointment').length },
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
