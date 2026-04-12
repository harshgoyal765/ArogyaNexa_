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
  { href: '/prescriptions', icon: 'medication', label: 'Prescriptions' },
  { href: '/orders', icon: 'autorenew', label: 'Orders' },
  { href: '/profile/security', icon: 'shield', label: 'Security' },
  { href: '/notifications', icon: 'notifications_none', label: 'Notifications' },
  { href: '/ai-assistant', icon: 'help_outline', label: 'Support' },
];

interface CustomerProfileData {
  age?: number;
  gender?: string;
  bloodGroup?: string;
  medicalHistory?: {
    allergies?: string[];
    chronicConditions?: string[];
    currentMedications?: string[];
  };
  healthMetrics?: {
    height?: string;
    weight?: string;
    bmi?: number;
  };
}

export default function CustomerProfile() {
  const pathname = usePathname();
  const { user } = useAppSelector((s) => s.auth);
  const [profileData, setProfileData] = useState<CustomerProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/customerProfile.json')
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
            <header className="mb-12">
              <p className="section-label text-[10px] text-secondary mb-2">Patient Profile</p>
              <h1 className="text-4xl font-headline font-bold text-primary leading-tight">
                {user.firstName} {user.lastName}
              </h1>
              <p className="mt-2 text-on-surface-variant">
                Your health profile and medical information
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
                      { label: 'Age', value: profileData?.age || 'Not set' },
                      { label: 'Gender', value: profileData?.gender || 'Not set' },
                      { label: 'Blood Group', value: profileData?.bloodGroup || 'Not set' },
                      { label: 'Member Since', value: formatDate(user.createdAt) },
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

                {/* Medical History */}
                <section className="card p-8">
                  <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Medical History</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-on-surface mb-3">Allergies</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData?.medicalHistory?.allergies?.map(allergy => (
                          <span key={allergy} className="badge bg-error-container text-error">{allergy}</span>
                        )) || <span className="text-on-surface-variant text-sm">None reported</span>}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-on-surface mb-3">Chronic Conditions</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData?.medicalHistory?.chronicConditions?.map(condition => (
                          <span key={condition} className="badge bg-amber-100 text-amber-800">{condition}</span>
                        )) || <span className="text-on-surface-variant text-sm">None reported</span>}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-on-surface mb-3">Current Medications</h3>
                      <ul className="space-y-2">
                        {profileData?.medicalHistory?.currentMedications?.map((med, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-primary text-base">medication</span>
                            {med}
                          </li>
                        )) || <span className="text-on-surface-variant text-sm">No active medications</span>}
                      </ul>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="md:col-span-5 space-y-6">
                {/* Health Metrics */}
                <section className="card p-8">
                  <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Health Metrics</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Height', value: profileData?.healthMetrics?.height || 'Not set', icon: 'straighten' },
                      { label: 'Weight', value: profileData?.healthMetrics?.weight || 'Not set', icon: 'monitor_weight' },
                      { label: 'BMI', value: profileData?.healthMetrics?.bmi || 'Not set', icon: 'analytics' },
                    ].map(metric => (
                      <div key={metric.label} className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">{metric.icon}</span>
                          <span className="text-sm text-on-surface-variant">{metric.label}</span>
                        </div>
                        <span className="font-semibold text-on-surface">{metric.value}</span>
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
