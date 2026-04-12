'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { NotificationsSkeleton } from '@/components/ui/LoadingSpinner';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { loadNotificationsByRole, type Notification } from '@/lib/dataLoader';
import { formatDate, cn } from '@/lib/utils';

const SIDEBAR_LINKS = [
  { href: '/profile', icon: 'person_outline', label: 'Profile' },
  { href: '/prescriptions', icon: 'medication', label: 'Prescriptions' },
  { href: '/orders', icon: 'autorenew', label: 'Orders' },
  { href: '/profile/security', icon: 'shield', label: 'Security' },
  { href: '/notifications', icon: 'notifications_none', label: 'Notifications' },
  { href: '/ai-assistant', icon: 'help_outline', label: 'Support' },
];

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  );
}

function NotificationsContent() {
  const pathname = usePathname();
  const { user } = useAppSelector((s) => s.auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (!user) return;
    
    setLoading(true);
    const primaryRole = user.roles[0] || 'CUSTOMER';
    
    loadNotificationsByRole(primaryRole)
      .then((data) => {
        // Sort by timestamp descending (newest first)
        const sorted = data.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setNotifications(sorted);
      })
      .catch((error) => {
        console.error('Failed to load notifications:', error);
        setNotifications([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    showToast('Notification marked as read', 'success');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'success');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification deleted', 'success');
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen pt-16 bg-surface">
          <aside className="h-screen w-64 fixed left-0 top-0 pt-20 bg-slate-50 flex flex-col border-r border-slate-100 hidden lg:flex">
            <div className="px-8 mb-8">
              <h2 className="font-headline italic text-primary text-lg">Patient Account</h2>
              <p className="section-label text-[11px] mt-1">Clinical Excellence</p>
            </div>
            <nav className="flex-1 space-y-1">
              {SIDEBAR_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={cn('flex items-center gap-3 pl-4 py-3 text-sm transition-all group', pathname === link.href ? 'text-primary font-semibold border-l-4 border-primary bg-white/50' : 'text-on-surface-variant hover:bg-slate-100 hover:translate-x-1 duration-300')}>
                  <span className="material-symbols-outlined text-lg" style={pathname === link.href ? { fontVariationSettings: "'FILL' 1" } : {}}>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 lg:ml-64 px-8 py-12 bg-surface">
            <div className="max-w-4xl mx-auto">
              <header className="mb-12">
                <p className="section-label text-[10px] text-secondary mb-2">Notifications Center</p>
                <h1 className="text-4xl font-headline font-bold text-primary leading-tight">Your Notifications</h1>
              </header>
              <NotificationsSkeleton items={6} />
            </div>
          </main>
        </div>
        <Footer />
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen pt-16 bg-surface">
        {/* Sidebar */}
        <aside className="h-screen w-64 fixed left-0 top-0 pt-20 bg-slate-50 flex flex-col border-r border-slate-100 hidden lg:flex">
          <div className="px-8 mb-8">
            <h2 className="font-headline italic text-primary text-lg">Patient Account</h2>
            <p className="section-label text-[11px] mt-1">Clinical Excellence</p>
          </div>
          <nav className="flex-1 space-y-1">
            {SIDEBAR_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 pl-4 py-3 text-sm transition-all group',
                  pathname === link.href
                    ? 'text-primary font-semibold border-l-4 border-primary bg-white/50'
                    : 'text-on-surface-variant hover:bg-slate-100 hover:translate-x-1 duration-300'
                )}
              >
                <span className="material-symbols-outlined text-lg" style={pathname === link.href ? { fontVariationSettings: "'FILL' 1" } : {}}>{link.icon}</span>
                {link.label}
                {link.href === '/notifications' && unreadCount > 0 && (
                  <span className="ml-auto mr-4 w-5 h-5 clinical-gradient text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="p-6">
            <Link href="/products" className="btn-primary w-full justify-center text-sm py-3">Request Refill</Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 lg:ml-64 px-8 py-12 bg-surface">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <header className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="section-label text-[10px] text-secondary mb-2">Notification Center</p>
                  <h1 className="text-4xl font-headline font-bold text-primary leading-tight">
                    Your Notifications
                  </h1>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary-fixed/30 rounded-lg transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <p className="text-on-surface-variant leading-relaxed max-w-2xl">
                Stay updated with your orders, prescriptions, and health reminders.
              </p>
            </header>

            {/* Filter Tabs */}
            <div className="flex items-center gap-4 mb-8 border-b border-outline-variant/10">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'px-4 py-3 text-sm font-medium transition-colors border-b-2',
                  filter === 'all'
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                )}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={cn(
                  'px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2',
                  filter === 'unread'
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                )}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="w-5 h-5 clinical-gradient text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-outline-variant">notifications_off</span>
                </div>
                <h3 className="text-xl font-headline text-on-surface mb-2">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </h3>
                <p className="text-on-surface-variant">
                  {filter === 'unread' 
                    ? "You're all caught up! Check back later for updates."
                    : "We'll notify you when there's something new."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'card p-6 transition-all hover:shadow-primary-sm group',
                      !notification.read && 'bg-primary-fixed/10 border-l-4 border-primary'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full ${notification.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <span className={`material-symbols-outlined ${notification.iconColor}`}>
                          {notification.icon}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-on-surface">{notification.title}</h3>
                              {!notification.read && (
                                <span className="w-2 h-2 rounded-full bg-primary" />
                              )}
                              {notification.priority === 'CRITICAL' && (
                                <span className="badge bg-error-container text-error text-[10px]">URGENT</span>
                              )}
                              {notification.priority === 'HIGH' && (
                                <span className="badge bg-secondary-container text-secondary text-[10px]">HIGH</span>
                              )}
                            </div>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                              {notification.message}
                            </p>
                          </div>
                          <span className="text-xs text-outline flex-shrink-0">
                            {formatDate(notification.timestamp)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-4">
                          {notification.actionUrl && (
                            <Link
                              href={notification.actionUrl}
                              className="text-sm font-medium text-primary hover:underline"
                            >
                              View Details →
                            </Link>
                          )}
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-sm font-medium text-error hover:underline ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Info Card */}
            {filteredNotifications.length > 0 && (
              <div className="mt-12 p-6 bg-tertiary-fixed/30 rounded-xl border border-tertiary/10">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-tertiary text-white flex items-center justify-center">
                    <span className="material-symbols-outlined">info</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-tertiary-fixed-variant mb-1">
                      Notification Preferences
                    </p>
                    <p className="text-xs text-on-tertiary-fixed-variant leading-relaxed">
                      Manage how you receive notifications in your{' '}
                      <Link href="/profile/security" className="text-tertiary font-semibold hover:underline">
                        security settings
                      </Link>
                      . You can customize email, SMS, and push notification preferences.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
