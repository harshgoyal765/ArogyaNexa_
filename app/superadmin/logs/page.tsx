'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer } from '@/components/ui/Toast';
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

interface SystemLog {
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  service: string;
  message: string;
  details?: string;
}

export default function SystemLogsPage() {
  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <SystemLogsContent />
    </ProtectedRoute>
  );
}

function SystemLogsContent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logs, setLogs] = useState<SystemLog[]>([
    { timestamp: '2024-10-24 14:32:15', level: 'INFO', service: 'API Gateway', message: 'Health check completed successfully', details: 'All endpoints responding within acceptable latency' },
    { timestamp: '2024-10-24 14:31:42', level: 'WARNING', service: 'Prescription Service', message: 'High response time detected', details: 'Average response time: 450ms (threshold: 300ms)' },
    { timestamp: '2024-10-24 14:30:18', level: 'INFO', service: 'Auth Service', message: 'User login successful', details: 'User ID: usr-004, IP: 192.168.1.100' },
    { timestamp: '2024-10-24 14:29:55', level: 'ERROR', service: 'Payment Gateway', message: 'Payment processing failed', details: 'Razorpay API timeout after 30s' },
    { timestamp: '2024-10-24 14:28:30', level: 'INFO', service: 'Order Service', message: 'Order created successfully', details: 'Order ID: ORD-2024-10-24-001' },
    { timestamp: '2024-10-24 14:27:12', level: 'WARNING', service: 'Database', message: 'Connection pool nearing capacity', details: 'Active connections: 85/100' },
    { timestamp: '2024-10-24 14:26:45', level: 'INFO', service: 'Product Service', message: 'Product inventory updated', details: 'Product ID: PRD-001, New stock: 45 units' },
    { timestamp: '2024-10-24 14:25:20', level: 'CRITICAL', service: 'Email Service', message: 'SMTP server connection failed', details: 'Unable to send order confirmation emails' },
    { timestamp: '2024-10-24 14:24:08', level: 'INFO', service: 'Cache Service', message: 'Cache cleared successfully', details: 'Redis cache flushed, 1.2GB freed' },
    { timestamp: '2024-10-24 14:23:15', level: 'WARNING', service: 'File Storage', message: 'Storage capacity warning', details: 'Disk usage: 82% (threshold: 80%)' },
  ]);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'text-primary';
      case 'WARNING': return 'text-amber-600';
      case 'ERROR': return 'text-error';
      case 'CRITICAL': return 'text-error';
      default: return 'text-outline';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'INFO': return 'bg-primary-fixed text-primary';
      case 'WARNING': return 'bg-amber-100 text-amber-800';
      case 'ERROR': return 'bg-error-container text-error';
      case 'CRITICAL': return 'bg-error text-white';
      default: return 'bg-surface-container text-outline';
    }
  };

  const filteredLogs = filterLevel === 'ALL' ? logs : logs.filter(log => log.level === filterLevel);

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
            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
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
            <h1 className="font-headline text-5xl text-primary tracking-tight mb-2">System Logs</h1>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed text-sm">
              Real-time system logs from all services. Monitor errors, warnings, and system events.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary text-sm">Export Logs</button>
            <button className="btn-primary text-sm">Refresh</button>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="section-label text-[10px]">Filter by Level:</span>
              <div className="flex gap-2">
                {['ALL', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'].map(level => (
                  <button
                    key={level}
                    onClick={() => setFilterLevel(level)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-xs font-semibold transition-colors',
                      filterLevel === level
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-sm text-on-surface-variant">
              Showing {filteredLogs.length} of {logs.length} logs
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low">
                <tr>
                  {['Timestamp', 'Level', 'Service', 'Message', 'Details'].map(h => (
                    <th key={h} className="px-6 py-4 section-label text-[10px] font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {filteredLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <code className="text-xs font-mono text-on-surface-variant">{log.timestamp}</code>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge text-xs ${getLevelBadge(log.level)}`}>{log.level}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-on-surface">{log.service}</td>
                    <td className="px-6 py-4 text-on-surface">{log.message}</td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-on-surface-variant">{log.details || '-'}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
