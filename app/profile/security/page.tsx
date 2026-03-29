'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { authApi } from '@/lib/api/auth';
import { cn } from '@/lib/utils';

const SIDEBAR_LINKS = [
  { href: '/profile', icon: 'person_outline', label: 'Profile' },
  { href: '/prescriptions', icon: 'medication', label: 'Prescriptions' },
  { href: '/orders', icon: 'autorenew', label: 'Orders' },
  { href: '/profile/security', icon: 'shield', label: 'Security', active: true },
  { href: '/dashboard', icon: 'notifications_none', label: 'Notifications' },
  { href: '/ai-assistant', icon: 'help_outline', label: 'Support' },
];

const NOTIFICATION_PREFS = [
  { group: 'Order Updates', items: [{ label: 'Email Notifications', checked: true }, { label: 'SMS Tracking', checked: true }] },
  { group: 'Clinical Reminders', items: [{ label: 'Prescription Refill', checked: true }, { label: 'Health Check-ups', checked: false }] },
  { group: 'News & Research', items: [{ label: 'Monthly Newsletter', checked: true }, { label: 'Marketing Alerts', checked: false }] },
];

export default function SecuritySettingsPage() {
  return (
    <ProtectedRoute>
      <SecurityContent />
    </ProtectedRoute>
  );
}

function SecurityContent() {
  const pathname = usePathname();
  const { user } = useAppSelector(s => s.auth);
  const [mfaEnabled, setMfaEnabled] = useState(user?.mfaEnabled ?? false);
  const [notifications, setNotifications] = useState(
    NOTIFICATION_PREFS.map(g => ({ ...g, items: g.items.map(i => ({ ...i })) }))
  );
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [savingPw, setSavingPw] = useState(false);

  const toggleNotif = (gi: number, ii: number) => {
    setNotifications(prev => prev.map((g, gIdx) =>
      gIdx !== gi ? g : { ...g, items: g.items.map((item, iIdx) => iIdx !== ii ? item : { ...item, checked: !item.checked }) }
    ));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { showToast('Passwords do not match', 'error'); return; }
    setSavingPw(true);
    try {
      await authApi.changePassword(pwForm.current, pwForm.next);
      showToast('Password updated successfully', 'success');
      setChangingPassword(false);
      setPwForm({ current: '', next: '', confirm: '' });
    } catch {
      showToast('Failed to update password. Check your current password.', 'error');
    } finally {
      setSavingPw(false);
    }
  };

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
                  pathname === link.href || link.active
                    ? 'text-primary font-semibold border-l-4 border-primary bg-white/50'
                    : 'text-on-surface-variant hover:bg-slate-100 hover:translate-x-1 duration-300'
                )}
              >
                <span className="material-symbols-outlined text-lg" style={link.active ? { fontVariationSettings: "'FILL' 1" } : {}}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="p-6">
            <Link href="/products" className="btn-primary w-full justify-center text-sm py-3">Request Refill</Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 lg:ml-64 px-6 md:px-8 py-12 bg-surface">
          <div className="max-w-4xl mx-auto">
            <header className="mb-12">
              <h1 className="font-headline text-4xl text-on-surface mb-2 font-semibold">Security &amp; Preferences</h1>
              <p className="text-on-surface-variant">Manage your clinical data, security protocols, and communication settings.</p>
            </header>

            <div className="space-y-10">
              {/* Security & Privacy */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Login Security */}
                <div className="md:col-span-2 card p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary p-2 bg-primary-fixed rounded-full">lock</span>
                      <h3 className="text-lg font-semibold text-on-surface">Login Security</h3>
                    </div>
                    <span className="badge bg-secondary-container text-on-secondary-container text-[10px]">Highly Secure</span>
                  </div>
                  <div className="space-y-5">
                    {/* Password */}
                    <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
                      <div>
                        <p className="font-medium text-on-surface">Password</p>
                        <p className="text-sm text-on-surface-variant">Last updated 3 months ago</p>
                      </div>
                      <button
                        onClick={() => setChangingPassword(!changingPassword)}
                        className="text-primary font-semibold text-sm hover:underline"
                      >
                        {changingPassword ? 'Cancel' : 'Change'}
                      </button>
                    </div>

                    {changingPassword && (
                      <form onSubmit={handlePasswordChange} className="space-y-3 pb-4 border-b border-surface-container-high">
                        {[
                          { key: 'current', label: 'Current Password' },
                          { key: 'next', label: 'New Password' },
                          { key: 'confirm', label: 'Confirm New Password' },
                        ].map(field => (
                          <div key={field.key}>
                            <label className="block text-xs font-medium text-on-surface-variant mb-1">{field.label}</label>
                            <input
                              type="password"
                              value={pwForm[field.key as keyof typeof pwForm]}
                              onChange={e => setPwForm(f => ({ ...f, [field.key]: e.target.value }))}
                              className="input-field text-sm py-2"
                              required
                            />
                          </div>
                        ))}
                        <button type="submit" disabled={savingPw} className="btn-primary text-sm py-2">
                          {savingPw ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Update Password'}
                        </button>
                      </form>
                    )}

                    {/* 2FA Toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-on-surface">Two-Factor Authentication</p>
                        <p className="text-sm text-on-surface-variant">Secure your account with SMS or Authenticator App</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMfaEnabled(!mfaEnabled);
                          showToast(`2FA ${!mfaEnabled ? 'enabled' : 'disabled'}`, 'success');
                        }}
                        className={`w-11 h-6 rounded-full relative transition-colors ${mfaEnabled ? 'bg-primary' : 'bg-surface-container-highest'}`}
                      >
                        <div className={`absolute top-[2px] w-5 h-5 bg-white rounded-full transition-all shadow-sm ${mfaEnabled ? 'right-[2px]' : 'left-[2px]'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="card p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-on-surface mb-5">Active Sessions</h3>
                    <div className="space-y-4">
                      {[
                        { icon: 'laptop_mac', device: 'MacBook Pro', location: 'Mumbai, India', time: 'Active', dim: false },
                        { icon: 'smartphone', device: 'iPhone 15 Pro', location: 'Mumbai, India', time: '2h ago', dim: true },
                      ].map(session => (
                        <div key={session.device} className={cn('flex gap-3', session.dim && 'opacity-60')}>
                          <span className="material-symbols-outlined text-outline">{session.icon}</span>
                          <div>
                            <p className="text-xs font-semibold text-on-surface">{session.device}</p>
                            <p className="text-[10px] text-on-surface-variant">{session.location} · {session.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('All other sessions signed out', 'success')}
                    className="text-error font-semibold text-xs mt-6 text-left hover:opacity-80 transition-opacity uppercase tracking-tighter"
                  >
                    Sign out all other devices
                  </button>
                </div>
              </section>

              {/* Notification Preferences */}
              <section className="bg-surface-container-low p-8 rounded-xl">
                <div className="mb-8">
                  <h3 className="font-headline text-xl text-on-surface mb-1">Notification Preferences</h3>
                  <p className="text-sm text-on-surface-variant">Choose how you want to receive clinical and order updates.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
                  {notifications.map((group, gi) => (
                    <div key={group.group} className="space-y-5">
                      <h4 className="section-label text-[10px] text-primary border-b border-primary/10 pb-2">{group.group}</h4>
                      {group.items.map((item, ii) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-on-surface">{item.label}</span>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleNotif(gi, ii)}
                            className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <button onClick={() => showToast('Notification preferences saved', 'success')} className="btn-primary text-sm py-2">
                    Save Preferences
                  </button>
                </div>
              </section>

              {/* Payment Methods */}
              <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-5">
                  <h3 className="font-headline text-xl text-on-surface">Saved Payment Methods</h3>
                  <div className="space-y-4">
                    {[
                      { icon: 'medical_services', iconColor: 'text-tertiary', bg: 'bg-tertiary-container/20', label: 'Health Savings Account (HSA)', mask: '•••• •••• •••• 9281', tag: 'Clinical Only', tagColor: 'bg-tertiary/10 text-tertiary' },
                      { icon: null, iconColor: '', bg: 'bg-primary/10', label: 'Personal Visa Card', mask: '•••• •••• •••• 4402', tag: null, tagColor: '' },
                    ].map((card) => (
                      <div key={card.label} className="card p-5 flex items-center justify-between group hover:border-primary/20 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-8 ${card.bg} rounded flex items-center justify-center flex-shrink-0`}>
                            {card.icon ? (
                              <span className={`material-symbols-outlined ${card.iconColor} text-lg`}>{card.icon}</span>
                            ) : (
                              <span className="text-primary font-bold italic text-sm">VISA</span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-on-surface text-sm">{card.label}</p>
                              {card.tag && <span className={`badge text-[9px] ${card.tagColor}`}>{card.tag}</span>}
                            </div>
                            <p className="text-sm text-on-surface-variant font-mono">{card.mask}</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-outline-variant group-hover:text-on-surface-variant cursor-pointer">more_vert</span>
                      </div>
                    ))}
                    <button className="flex items-center gap-2 text-primary text-sm font-semibold pt-1">
                      <span className="material-symbols-outlined text-lg">add_circle</span> Add New Payment Method
                    </button>
                  </div>
                </div>

                {/* Privacy Controls */}
                <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-blue-950 text-white p-8 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[280px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div>
                    <span className="material-symbols-outlined text-3xl mb-4 text-secondary-fixed block">verified_user</span>
                    <h3 className="font-headline text-xl mb-3">Privacy Controls</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-5">Your clinical data is protected by industry-leading HIPAA-compliant encryption.</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Share data with my GP', checked: true },
                      { label: 'Anonymized clinical research', checked: false },
                    ].map(item => (
                      <label key={item.label} className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="text-xs text-white">{item.label}</span>
                        <input defaultChecked={item.checked} type="checkbox" className="w-3 h-3 text-secondary-fixed bg-transparent border-white/30 rounded focus:ring-0" />
                      </label>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Danger Zone */}
            <div className="mt-16 pt-10 border-t border-surface-container-high">
              <div className="bg-error-container/20 p-8 rounded-xl border border-error/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-error font-semibold">Danger Zone</h4>
                  <p className="text-sm text-on-surface-variant">Deleting your account will permanently remove all medical history and active prescriptions.</p>
                </div>
                <button
                  onClick={() => showToast('Please contact support to delete your account', 'info')}
                  className="px-6 py-2.5 bg-transparent border border-error text-error rounded-md text-sm font-semibold hover:bg-error hover:text-white transition-all flex-shrink-0"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <ToastContainer />
    </>
  );
}
