'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearAuth } from '@/store/authSlice';
import { authApi } from '@/lib/api/auth';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/superadmin', icon: 'dashboard', label: 'System Monitor' },
  { href: '/superadmin/api-health', icon: 'api', label: 'API Health' },
  { href: '/superadmin/logs', icon: 'description', label: 'System Logs' },
  { href: '/superadmin/admins', icon: 'admin_panel_settings', label: 'Admin Management' },
];

interface SystemNotification {
  id: string;
  type: 'system' | 'security' | 'admin' | 'api';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'info' | 'warning' | 'critical';
}

export default function SuperAdminNotificationsPage() {
  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <SuperAdminNotificationsContent />
    </ProtectedRoute>
  );
}

function SuperAdminNotificationsContent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    { id: '1', type: 'critical', title: 'API Gateway Degraded Performance', message: 'Response time exceeded threshold on /api/v1/prescriptions endpoint', timestamp: '2024-10-24 14:32:00', read: false, severity: 'critical' },
    { id: '2', type: 'security', title: 'New Admin User Created', message: 'Admin user "Maya Patel" was created by SuperAdmin', timestamp: '2024-10-24 12:15:00', read: false, severity: 'info' },
    { id: '3', type: 'system', title: 'Database Connection Pool Warning', message: 'Connection pool reached 85% capacity', timestamp: '2024-10-24 10:45:00', read: true, severity: 'warning' },
    { id: '4', type: 'api', title: 'High Error Rate Detected', message: 'Payment gateway API showing 15% error rate', timestamp: '2024-10-24 09:20:00', read: true, severity: 'warning' },
    { id: '5', type: 'system', title: 'Scheduled Maintenance Completed', message: 'Database optimization completed successfully', timestamp: '2024-10-24 06:00:00', read: true, severity: 'info' },
    { id: '6', type: 'security', title: 'Failed Login Attempts', message: '5 failed login attempts detected from IP 192.168.1.100', timestamp: '2024-10-23 22:30:00', read: true, severity: 'warning' },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
  };

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-error text-white';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'info': return 'bg-primary-fixed text-primary';
      default: return 'bg-surface-container text-outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return 'settings';
      case 'security': return 'security';
      case 'admin': return 'admin_panel_settings';
      case 'api': return 'api';
      default: return 'notifications';
    }
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface">
      {/* Top Nav */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/10 shadow-sm shadow-primary/5 flex justify-between items-center px-8 h-16">
        <div className="flex items-center gap-8">
          <span className="font-headline italic text-2xl text-primary">ArogyaNexa</span>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/superadmin/notifications"
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
            href="/superadmin/profile"
            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Profile"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 flex flex-col pt-20 pb-4 h-screen w-64 border-r border-slate-100 bg-slate-50 z-40">
        <div className="px-6 mb-8">
          <p className="section-label text-[10px] text-primary/60 mb-1">System Administration</p>
          <h2 className="font-headline text-lg text-primary leading-tight">Developer Portal</h2>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-xs font-label uppercase tracking-wide transition-all hover:translate-x-1 duration-200',
                  active ? 'bg-white text-primary font-bold border-r-4 border-primary' : 'text-on-surface-variant hover:bg-slate-100'
                )}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 mt-auto pt-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/20 transition-colors w-full rounded-lg text-xs uppercase tracking-wide">
            <span className="material-symbols-outlined text-sm">logout</span> Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 pt-24 px-10 pb-12">
        {/* Header */}
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="font-headline text-5xl text-primary tracking-tight mb-2">System Notifications</h1>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed text-sm">
              System-level alerts, security notifications, and administrative updates.
            </p>
          </div>
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
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-tertiary-fixed text-tertiary hover:bg-tertiary-fixed-dim transition-colors"
              >
                Mark All Read
              </button>
            )}
          </div>
        </header>

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
                    notification.severity === 'critical' ? 'bg-error/10' :
                    notification.severity === 'warning' ? 'bg-amber-100' :
                    'bg-primary-fixed'
                  )}>
                    <span className={cn(
                      'material-symbols-outlined',
                      notification.severity === 'critical' ? 'text-error' :
                      notification.severity === 'warning' ? 'text-amber-600' :
                      'text-primary'
                    )}>
                      {getTypeIcon(notification.type)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-on-surface">{notification.title}</h3>
                        <span className={cn('badge text-xs', getSeverityColor(notification.severity))}>
                          {notification.severity.toUpperCase()}
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
      </main>

      <ToastContainer />
    </div>
  );
}
