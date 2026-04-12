'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { clearAuth } from '@/store/authSlice';
import { authApi } from '@/lib/api/auth';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/superadmin', icon: 'dashboard', label: 'System Monitor' },
  { href: '/superadmin/api-health', icon: 'api', label: 'API Health' },
  { href: '/superadmin/logs', icon: 'description', label: 'System Logs' },
  { href: '/superadmin/admins', icon: 'admin_panel_settings', label: 'Admin Management' },
];

interface SystemActivity {
  action: string;
  timestamp: string;
  details: string;
}

export default function SuperAdminProfilePage() {
  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <SuperAdminProfileContent />
    </ProtectedRoute>
  );
}

function SuperAdminProfileContent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const [activities, setActivities] = useState<SystemActivity[]>([
    { action: 'Created Admin User', timestamp: '2024-10-24 12:15:00', details: 'Created admin user: Maya Patel' },
    { action: 'System Configuration Update', timestamp: '2024-10-23 16:30:00', details: 'Updated API rate limiting configuration' },
    { action: 'Viewed System Logs', timestamp: '2024-10-23 14:20:00', details: 'Accessed system logs for error analysis' },
    { action: 'API Health Check', timestamp: '2024-10-23 10:45:00', details: 'Performed manual API health verification' },
    { action: 'Admin User Deactivated', timestamp: '2024-10-22 09:30:00', details: 'Deactivated admin user: James Wilson' },
  ]);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
  };

  if (!user) return null;

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
            className="p-2 text-primary transition-colors"
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
        <header className="mb-12">
          <h1 className="font-headline text-5xl text-primary tracking-tight mb-2">SuperAdmin Profile</h1>
          <p className="text-on-surface-variant max-w-2xl leading-relaxed text-sm">
            System-level account information and activity logs. SuperAdmin has developer-level access to system monitoring and admin management.
          </p>
        </header>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="md:col-span-7 space-y-6">
            {/* Account Information */}
            <section className="card p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 rounded-full clinical-gradient flex items-center justify-center text-white text-3xl font-bold">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-headline font-semibold text-primary">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-on-surface-variant">System Administrator</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: 'First Name', value: user.firstName },
                  { label: 'Last Name', value: user.lastName },
                  { label: 'Email', value: user.email },
                  { label: 'Phone', value: user.phone || 'Not set' },
                  { label: 'Role', value: 'SUPER_ADMIN' },
                  { label: 'Account Type', value: 'System Account' },
                  { label: 'Access Level', value: 'Developer Portal' },
                  { label: 'Account Created', value: '2024-01-01' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="section-label text-[10px]">{field.label}</label>
                    <p className="font-body text-on-surface mt-1">{field.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* System Permissions */}
            <section className="card p-8">
              <h2 className="text-2xl font-headline font-semibold text-primary mb-6">System Permissions</h2>
              <div className="space-y-4">
                <p className="text-sm text-on-surface-variant mb-4">
                  SuperAdmin has developer-level access to system monitoring and admin management. No access to business data.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'System Health Monitoring',
                    'API Health Dashboard',
                    'System Logs Access',
                    'Admin User Management',
                    'Create Admin Users',
                    'View Admin Users',
                    'System Configuration',
                    'Developer Portal Access',
                  ].map(permission => (
                    <div key={permission} className="flex items-center gap-2 p-3 bg-primary-fixed/10 rounded-lg">
                      <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                      <span className="text-sm text-on-surface">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Security Settings */}
            <section className="card p-8">
              <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                  <div>
                    <p className="font-medium text-on-surface">Two-Factor Authentication</p>
                    <p className="text-xs text-on-surface-variant">Add an extra layer of security</p>
                  </div>
                  <span className={`badge ${user.mfaEnabled ? 'bg-tertiary-fixed text-tertiary' : 'bg-surface-container text-outline'}`}>
                    {user.mfaEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                  <div>
                    <p className="font-medium text-on-surface">Email Verification</p>
                    <p className="text-xs text-on-surface-variant">Verify your email address</p>
                  </div>
                  <span className={`badge ${user.emailVerified ? 'bg-tertiary-fixed text-tertiary' : 'bg-error-container text-error'}`}>
                    {user.emailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                <button 
                  onClick={() => showToast('Password change functionality coming soon', 'info')}
                  className="btn-secondary text-sm w-full"
                >
                  Change Password
                </button>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="md:col-span-5 space-y-6">
            {/* System Statistics */}
            <section className="card p-8">
              <h2 className="text-2xl font-headline font-semibold text-primary mb-6">System Statistics</h2>
              <div className="space-y-4">
                {[
                  { label: 'Admins Created', value: '3', icon: 'person_add' },
                  { label: 'System Checks', value: '127', icon: 'query_stats' },
                  { label: 'Log Reviews', value: '45', icon: 'description' },
                  { label: 'API Monitors', value: '89', icon: 'api' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">{stat.icon}</span>
                      <span className="text-sm text-on-surface-variant">{stat.label}</span>
                    </div>
                    <span className="font-headline text-2xl text-primary">{stat.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Account Status */}
            <section className="card p-8">
              <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Account Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Account Status</span>
                  <span className="badge bg-tertiary-fixed text-tertiary">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Access Level</span>
                  <span className="badge bg-primary-fixed text-primary">System Admin</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Last Login</span>
                  <span className="text-sm text-on-surface">2024-10-24 08:30</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Session Expires</span>
                  <span className="text-sm text-on-surface">In 2 hours</span>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="card p-8">
              <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/superadmin/admins" className="btn-secondary text-sm w-full">
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  Create Admin User
                </Link>
                <Link href="/superadmin/api-health" className="btn-secondary text-sm w-full">
                  <span className="material-symbols-outlined text-sm">api</span>
                  Check API Health
                </Link>
                <Link href="/superadmin/logs" className="btn-secondary text-sm w-full">
                  <span className="material-symbols-outlined text-sm">description</span>
                  View System Logs
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* Recent Activity */}
        <section className="mt-8 card p-8">
          <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {activities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-primary mt-1">history</span>
                <div className="flex-1">
                  <p className="font-medium text-on-surface">{activity.action}</p>
                  <p className="text-sm text-on-surface-variant">{activity.details}</p>
                </div>
                <span className="text-xs text-outline whitespace-nowrap">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <ToastContainer />
    </div>
  );
}
