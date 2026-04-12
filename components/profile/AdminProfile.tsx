'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { formatDate, cn } from '@/lib/utils';

const SIDEBAR_LINKS = [
  { href: '/profile', icon: 'person_outline', label: 'Profile' },
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/admin/users', icon: 'group', label: 'Users' },
  { href: '/profile/security', icon: 'shield', label: 'Security' },
  { href: '/notifications', icon: 'notifications_none', label: 'Notifications' },
];

interface AdminProfileData {
  organization?: string;
  department?: string;
  employeeId?: string;
  joinedDate?: string;
  permissions?: string[];
  managedUsers?: number;
  activeProjects?: number;
  lastActivity?: string;
  bio?: string;
  officeLocation?: string;
  workingHours?: string;
}

export default function AdminProfile() {
  const pathname = usePathname();
  const { user } = useAppSelector((s) => s.auth);
  const [profileData, setProfileData] = useState<AdminProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/adminProfile.json')
      .then(res => res.json())
      .then(data => setProfileData(data))
      .catch(() => setProfileData(null))
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen pt-16 bg-surface">
        {/* Sidebar */}
        <aside className="h-screen w-64 fixed left-0 top-0 pt-20 bg-slate-50 flex flex-col border-r border-slate-100 hidden lg:flex">
          <div className="px-8 mb-8">
            <h2 className="font-headline italic text-primary text-lg">Admin Account</h2>
            <p className="section-label text-[11px] mt-1">Platform Operations</p>
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
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 lg:ml-64 px-8 py-12 bg-surface">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-12">
              <p className="section-label text-[10px] text-secondary mb-2">Administrator Profile</p>
              <h1 className="text-4xl font-headline font-bold text-primary leading-tight">
                {user.firstName} {user.lastName}
              </h1>
              <p className="mt-2 text-on-surface-variant">
                Platform administrator for {profileData?.organization || 'ArogyaNexa'}
              </p>
            </header>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column */}
              <div className="md:col-span-7 space-y-6">
                {/* Personal Information */}
                <section className="card p-8">
                  <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { label: 'First Name', value: user.firstName },
                      { label: 'Last Name', value: user.lastName },
                      { label: 'Email', value: user.email },
                      { label: 'Phone', value: user.phone || 'Not set' },
                      { label: 'Employee ID', value: profileData?.employeeId || 'Not set' },
                      { label: 'Department', value: profileData?.department || 'Not set' },
                      { label: 'Office Location', value: profileData?.officeLocation || 'Not set' },
                      { label: 'Joined Date', value: profileData?.joinedDate ? formatDate(profileData.joinedDate) : 'N/A' },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="section-label text-[10px]">{field.label}</label>
                        <p className="font-body text-on-surface mt-1">{field.value}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => showToast('Edit functionality coming soon', 'info')}
                    className="mt-6 btn-secondary text-sm"
                  >
                    Edit Information
                  </button>
                </section>

                {/* Permissions */}
                <section className="card p-8">
                  <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Permissions & Access</h2>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {profileData?.permissions?.map(permission => (
                        <span key={permission} className="badge bg-primary-fixed text-primary">
                          {permission}
                        </span>
                      )) || <span className="text-on-surface-variant text-sm">No permissions loaded</span>}
                    </div>
                  </div>
                </section>

                {/* Bio */}
                {profileData?.bio && (
                  <section className="card p-8">
                    <h2 className="text-2xl font-headline font-semibold text-primary mb-4">About</h2>
                    <p className="text-on-surface-variant leading-relaxed">{profileData.bio}</p>
                  </section>
                )}
              </div>

              {/* Right Column */}
              <div className="md:col-span-5 space-y-6">
                {/* Statistics */}
                <section className="card p-8">
                  <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Statistics</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Managed Users', value: profileData?.managedUsers || 0, icon: 'group' },
                      { label: 'Active Projects', value: profileData?.activeProjects || 0, icon: 'work' },
                      { label: 'Working Hours', value: profileData?.workingHours || 'Not set', icon: 'schedule' },
                    ].map(stat => (
                      <div key={stat.label} className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">{stat.icon}</span>
                          <span className="text-sm text-on-surface-variant">{stat.label}</span>
                        </div>
                        <span className="font-semibold text-on-surface">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Account Status */}
                <section className="card p-8">
                  <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Account Status</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface-variant">Email Verified</span>
                      <span className={`badge ${user.emailVerified ? 'bg-tertiary-fixed text-tertiary' : 'bg-error-container text-error'}`}>
                        {user.emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface-variant">2FA Enabled</span>
                      <span className={`badge ${user.mfaEnabled ? 'bg-tertiary-fixed text-tertiary' : 'bg-surface-container text-outline'}`}>
                        {user.mfaEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface-variant">Role</span>
                      <span className="badge bg-primary-fixed text-primary">{user.roles[0]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface-variant">Last Activity</span>
                      <span className="text-sm text-on-surface">
                        {profileData?.lastActivity ? formatDate(profileData.lastActivity) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
