'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastContainer } from '@/components/ui/Toast';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchProfileThunk } from '@/store/authSlice';
import { formatDate, cn } from '@/lib/utils';

const SIDEBAR_LINKS = [
  { href: '/profile', icon: 'person_outline', label: 'Profile' },
  { href: '/prescriptions', icon: 'medication', label: 'Prescriptions' },
  { href: '/orders', icon: 'autorenew', label: 'Orders' },
  { href: '/profile/security', icon: 'shield', label: 'Security' },
  { href: '/dashboard', icon: 'notifications_none', label: 'Notifications' },
  { href: '/ai-assistant', icon: 'help_outline', label: 'Support' },
];

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { user, isLoading } = useAppSelector((s) => s.auth);

  useEffect(() => { dispatch(fetchProfileThunk()); }, [dispatch]);

  if (isLoading || !user) return <LoadingSpinner fullPage />;

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
              </Link>
            ))}
          </nav>
          <div className="p-6">
            <Link href="/products" className="btn-primary w-full justify-center text-sm py-3">Request Refill</Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 lg:ml-64 px-8 py-12 bg-surface">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="section-label text-[10px] text-secondary mb-2">Patient Profile Overview</p>
                <h1 className="text-4xl font-headline font-bold text-primary leading-tight">
                  Welcome back, {user.firstName} {user.lastName}.
                </h1>
                <p className="mt-4 text-on-surface-variant leading-relaxed max-w-xl">
                  Your clinical profile is managed by our dedicated pharmacist team. Ensure your medical data remains accurate for optimal treatment efficacy.
                </p>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-2.5 bg-surface-container-lowest border border-outline-variant/15 text-primary rounded-md text-sm font-medium hover:bg-surface-container-low transition-colors">
                  Export Health Data
                </button>
                <button className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-container text-white rounded-md text-sm font-medium shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform">
                  Update Health Records
                </button>
              </div>
            </header>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left: Health Snapshot */}
              <div className="md:col-span-7 space-y-8">
                <section className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-headline font-semibold text-primary">Health Snapshot</h2>
                    <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-label uppercase tracking-wider rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Clinical Active
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-surface-container-low p-5 rounded-lg">
                      <p className="section-label text-[10px] mb-1">Active Prescriptions</p>
                      <p className="text-3xl font-headline font-bold text-primary">04</p>
                      <p className="text-xs text-secondary mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">history</span> Last 30 days
                      </p>
                    </div>
                    <div className="bg-surface-container-low p-5 rounded-lg">
                      <p className="section-label text-[10px] mb-1">Next Refill Date</p>
                      <p className="text-xl font-headline font-bold text-primary">Oct 24, 2024</p>
                      <p className="text-xs text-error mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">priority_high</span> Action required
                      </p>
                    </div>
                    <div className="bg-surface-container-low p-5 rounded-lg">
                      <p className="section-label text-[10px] mb-1">Account Status</p>
                      <p className="text-xl font-headline font-bold text-primary">{user.emailVerified ? 'Verified' : 'Pending'}</p>
                      <p className="text-xs text-on-surface-variant mt-2">{user.roles.join(', ')}</p>
                    </div>
                  </div>
                </section>

                {/* Personal Information */}
                <section className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-headline font-semibold text-primary">Personal Information</h2>
                    <Link href="/profile/security" className="text-secondary hover:text-primary transition-colors flex items-center gap-1 font-medium text-sm">
                      <span className="material-symbols-outlined text-base">edit</span> Edit Fields
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                    {[
                      { label: 'First Name', value: user.firstName },
                      { label: 'Last Name', value: user.lastName },
                      { label: 'Email Address', value: user.email },
                      { label: 'Contact Number', value: user.phone || 'Not set' },
                      { label: 'Member Since', value: formatDate(user.createdAt) },
                      { label: 'Last Login', value: user.lastLoginAt ? formatDate(user.lastLoginAt) : 'N/A' },
                    ].map((field) => (
                      <div key={field.label} className="space-y-1">
                        <label className="section-label text-[10px]">{field.label}</label>
                        <p className="font-body text-on-surface border-b border-outline-variant/15 pb-2">{field.value}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right: Medical Profile & Concierge */}
              <div className="md:col-span-5 space-y-8">
                {/* Medical Profile */}
                <section className="bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
                  <div className="p-8">
                    <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Medical Profile</h2>
                    <div className="mb-8">
                      <p className="section-label text-[10px] mb-4">Verified Roles</p>
                      <div className="flex flex-wrap gap-2">
                        {user.roles.map((role) => (
                          <span key={role} className="badge bg-primary-fixed text-primary">{role}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="section-label text-[10px] mb-4">Account Security</p>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-lg">
                          <span className="material-symbols-outlined text-secondary pt-0.5">shield</span>
                          <div>
                            <p className="font-body text-sm font-semibold text-primary">Two-Factor Authentication</p>
                            <p className="text-xs text-on-surface-variant mt-1">{user.mfaEnabled ? 'Enabled — Your account is protected' : 'Not enabled — Consider enabling for security'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-lg">
                          <span className="material-symbols-outlined text-secondary pt-0.5">email</span>
                          <div>
                            <p className="font-body text-sm font-semibold text-primary">Email Verification</p>
                            <p className="text-xs text-on-surface-variant mt-1">{user.emailVerified ? 'Email verified' : 'Email not verified'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Health Concierge */}
                <section className="bg-primary-container text-white rounded-xl p-8 relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="section-label text-[10px] uppercase tracking-[0.2em] text-on-primary-container mb-2 block">Premium Concierge</span>
                    <h2 className="text-2xl font-headline font-semibold mb-4">Direct Clinical Access</h2>
                    <p className="text-sm text-blue-100 font-light leading-relaxed mb-8">
                      Have questions about your current medication regimen or potential interactions? Our licensed pharmacists are available for digital consultation.
                    </p>
                    <div className="space-y-3">
                      <Link href="/ai-assistant" className="block w-full py-3 bg-white text-primary rounded-md font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg text-center">
                        Consult a Pharmacist
                      </Link>
                      <Link href="/dashboard" className="block w-full py-3 bg-transparent border border-white/30 text-white rounded-md font-medium text-sm hover:bg-white/10 transition-colors text-center">
                        Schedule Health Review
                      </Link>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                </section>

                {/* Privacy note */}
                <div className="p-6 bg-tertiary-fixed/30 rounded-xl border border-tertiary/10">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-tertiary text-white flex items-center justify-center">
                      <span className="material-symbols-outlined">health_and_safety</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-tertiary-fixed-variant">Privacy First</p>
                      <p className="text-xs text-on-tertiary-fixed-variant leading-relaxed mt-1">Your data is encrypted following HIPAA protocols. Only authorized clinical staff can access your records.</p>
                    </div>
                  </div>
                </div>
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
