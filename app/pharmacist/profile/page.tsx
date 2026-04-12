'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import PharmacistSidebar from '@/components/layout/PharmacistSidebar';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { clearAuth } from '@/store/authSlice';
import { authApi } from '@/lib/api/auth';
import { cn } from '@/lib/utils';

export default function PharmacistProfilePage() {
  return (
    <ProtectedRoute requiredRole={['PHARMACIST', 'ADMIN', 'SUPER_ADMIN']}>
      <PharmacistProfileContent />
    </ProtectedRoute>
  );
}

function PharmacistProfileContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState<'profile' | 'credentials' | 'settings'>('profile');

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
  };

  const handleSave = () => {
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="bg-surface min-h-screen flex">
      <PharmacistSidebar />

      <div className="ml-64 flex-1 min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div>
            <h1 className="font-headline text-2xl text-primary">My Profile</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/pharmacist/notifications"
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <Link 
              href="/pharmacist/profile"
              className="p-2 text-primary transition-colors"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="card p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-tertiary to-tertiary-container flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {user?.firstName[0]}{user?.lastName[0]}
              </div>
              <div className="flex-1">
                <h2 className="font-headline text-3xl text-primary mb-2">
                  {user?.firstName} {user?.lastName}, PharmD
                </h2>
                <p className="text-on-surface-variant mb-4">Licensed Pharmacist</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">badge</span>
                    <span className="text-on-surface-variant">License: RPH-78901</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">email</span>
                    <span className="text-on-surface-variant">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">phone</span>
                    <span className="text-on-surface-variant">+91 98765 11111</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Prescriptions Reviewed', value: '2,456', icon: 'medication', color: 'text-tertiary' },
              { label: 'Orders Fulfilled', value: '1,892', icon: 'shopping_bag', color: 'text-secondary' },
              { label: 'Inventory Items', value: '456', icon: 'inventory_2', color: 'text-primary' },
              { label: 'Accuracy Rate', value: '99.8%', icon: 'verified', color: 'text-tertiary' },
            ].map(stat => (
              <div key={stat.label} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                  <span className="section-label text-[10px]">{stat.label}</span>
                </div>
                <div className="font-headline text-3xl text-primary">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-outline-variant/20">
            {[
              { id: 'profile', label: 'Profile Information', icon: 'person' },
              { id: 'credentials', label: 'Credentials', icon: 'workspace_premium' },
              { id: 'settings', label: 'Settings', icon: 'settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2',
                  activeTab === tab.id 
                    ? 'text-primary border-primary' 
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                )}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <div className="card p-8">
              <h3 className="font-headline text-2xl text-primary mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="section-label text-[10px] block mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue={user?.firstName}
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="section-label text-[10px] block mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue={user?.lastName}
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="section-label text-[10px] block mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="section-label text-[10px] block mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+91 98765 11111"
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="section-label text-[10px] block mb-2">Specialization</label>
                  <input
                    type="text"
                    defaultValue="Clinical Pharmacy"
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="section-label text-[10px] block mb-2">Years of Experience</label>
                  <input
                    type="text"
                    defaultValue="8 years"
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="section-label text-[10px] block mb-2">Bio</label>
                  <textarea
                    rows={4}
                    defaultValue="Licensed pharmacist with 8 years of experience in clinical pharmacy, medication therapy management, and patient counseling."
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button className="btn-secondary text-sm">Cancel</button>
                <button onClick={handleSave} className="btn-primary text-sm">
                  <span className="material-symbols-outlined text-sm">save</span>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-6">
              <div className="card p-8">
                <h3 className="font-headline text-2xl text-primary mb-6">Pharmacy Credentials</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Pharmacy License Number', value: 'RPH-78901', verified: true },
                    { label: 'DEA Number', value: 'FP1234567', verified: true },
                    { label: 'NPI Number', value: '9876543210', verified: true },
                    { label: 'Board Certification', value: 'Board Certified Pharmacotherapy Specialist', verified: true },
                  ].map((cred) => (
                    <div key={cred.label} className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                      <div>
                        <p className="section-label text-[10px] mb-1">{cred.label}</p>
                        <p className="font-semibold text-on-surface">{cred.value}</p>
                      </div>
                      {cred.verified && (
                        <div className="flex items-center gap-2 text-tertiary">
                          <span className="material-symbols-outlined">verified</span>
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-8">
                <h3 className="font-headline text-2xl text-primary mb-6">Education</h3>
                <div className="space-y-4">
                  {[
                    { degree: 'Doctor of Pharmacy (PharmD)', institution: 'University of California, San Francisco', year: '2016' },
                    { degree: 'Bachelor of Science in Pharmaceutical Sciences', institution: 'University of Michigan', year: '2012' },
                  ].map((edu, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-surface-container-low rounded-lg">
                      <span className="material-symbols-outlined text-primary text-2xl">school</span>
                      <div>
                        <p className="font-semibold text-on-surface">{edu.degree}</p>
                        <p className="text-sm text-on-surface-variant">{edu.institution}</p>
                        <p className="text-xs text-outline mt-1">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-8">
                <h3 className="font-headline text-2xl text-primary mb-6">Certifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Immunization Certification',
                    'Medication Therapy Management',
                    'Anticoagulation Management',
                    'Diabetes Care Specialist',
                  ].map((cert) => (
                    <div key={cert} className="flex items-center gap-3 p-4 bg-tertiary-fixed/20 rounded-lg">
                      <span className="material-symbols-outlined text-tertiary">verified</span>
                      <span className="text-sm font-medium text-on-surface">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card p-8">
              <h3 className="font-headline text-2xl text-primary mb-6">Account Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-on-surface mb-4">Notification Preferences</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Email notifications for new prescriptions', checked: true },
                      { label: 'SMS alerts for low inventory', checked: true },
                      { label: 'Push notifications for order updates', checked: true },
                      { label: 'Daily performance summary', checked: false },
                    ].map((pref) => (
                      <label key={pref.label} className="flex items-center gap-3 p-3 hover:bg-surface-container-low rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={pref.checked}
                          className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-sm text-on-surface">{pref.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant/20">
                  <h4 className="font-semibold text-on-surface mb-4">Security</h4>
                  <div className="space-y-3">
                    <button className="btn-secondary text-sm w-full justify-start">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      Change Password
                    </button>
                    <button className="btn-secondary text-sm w-full justify-start">
                      <span className="material-symbols-outlined text-sm">security</span>
                      Enable Two-Factor Authentication
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant/20">
                  <h4 className="font-semibold text-error mb-4">Danger Zone</h4>
                  <button className="btn-secondary text-sm text-error border-error hover:bg-error-container">
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
