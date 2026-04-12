'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearAuth } from '@/store/authSlice';
import { authApi } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin/content', icon: 'edit_note', label: 'Content Hub' },
  { href: '/wellness', icon: 'spa', label: 'Wellness Articles' },
];

interface Notification {
  id: string;
  type: 'article' | 'review' | 'publish' | 'seo' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

const NOTIFICATIONS: Notification[] = [
  { id: 'N-001', type: 'review', title: 'Article Review Required', message: 'Dr. Sarah Thorne requested review for "Therapeutic Benefits of Ashwagandha"', time: '10 min ago', read: false, priority: 'high' },
  { id: 'N-002', type: 'publish', title: 'Article Published', message: 'Your article "Understanding the Microbiome" has been published successfully', time: '1 hour ago', read: false, priority: 'medium' },
  { id: 'N-003', type: 'seo', title: 'SEO Score Updated', message: 'Your article "Sleep Hygiene Tips" SEO score improved to 9.2/10', time: '2 hours ago', read: false, priority: 'low' },
  { id: 'N-004', type: 'article', title: 'Draft Saved', message: 'Auto-save completed for "Seasonal Nutrients Guide"', time: '3 hours ago', read: true, priority: 'low' },
  { id: 'N-005', type: 'review', title: 'Feedback Received', message: 'Editor provided feedback on "Mental Vitality & Focus" article', time: '5 hours ago', read: true, priority: 'medium' },
  { id: 'N-006', type: 'system', title: 'Content Calendar Updated', message: 'New content deadline added for November 15th', time: '1 day ago', read: true, priority: 'low' },
];

export default function ContentNotificationsPage() {
  return (
    <ProtectedRoute requiredRole={['CONTENT_EDITOR', 'ADMIN', 'SUPER_ADMIN']}>
      <ContentNotificationsContent />
    </ProtectedRoute>
  );
}

function ContentNotificationsContent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'review' | 'article'>('all');

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
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
      case 'article': return 'article';
      case 'review': return 'rate_review';
      case 'publish': return 'publish';
      case 'seo': return 'trending_up';
      case 'system': return 'settings';
      default: return 'notifications';
    }
  };

  const getTypeColor = (type: string, priority: string) => {
    if (priority === 'high') return 'bg-error-container text-error';
    switch (type) {
      case 'article': return 'bg-primary-fixed text-primary';
      case 'review': return 'bg-tertiary-fixed text-tertiary';
      case 'publish': return 'bg-secondary-container text-secondary';
      case 'seo': return 'bg-amber-100 text-amber-800';
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
          <p className="text-xs text-outline font-label uppercase tracking-widest">Content Portal</p>
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
        <div className="p-4 border-t border-slate-100 space-y-2">
          {user && (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full clinical-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-on-surface truncate">{user.firstName} {user.lastName}</p>
                <p className="text-[10px] text-outline">CONTENT EDITOR</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/20 transition-colors w-full rounded-lg text-xs uppercase tracking-wide">
            <span className="material-symbols-outlined text-sm">logout</span> Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-64 flex-1 min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div>
            <h1 className="font-headline text-2xl text-primary">Notifications</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/content/notifications"
              className="p-2 text-primary transition-colors relative"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
              )}
            </Link>
            <Link 
              href="/content/profile"
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
              { id: 'review', label: 'Reviews', count: notifications.filter(n => n.type === 'review').length },
              { id: 'article', label: 'Articles', count: notifications.filter(n => n.type === 'article').length },
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
