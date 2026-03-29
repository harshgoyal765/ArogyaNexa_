'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { clearAuth } from '@/store/authSlice';
import { authApi } from '@/lib/api/auth';
import { cn } from '@/lib/utils';

// All nav items point to doctor-scoped routes only
const NAV_ITEMS = [
  { href: '/doctor', icon: 'dashboard', label: 'Dashboard' },
  { href: '/doctor/patients', icon: 'people', label: 'Patients' },
  { href: '/doctor/prescriptions', icon: 'description', label: 'Prescriptions' },
  { href: '/doctor/schedule', icon: 'calendar_month', label: 'Schedule' },
  { href: '/ai-assistant', icon: 'smart_toy', label: 'AI Assistant' },
];

const PENDING_REQUESTS = [
  { name: 'Elena Rodriguez', medication: 'Metformin 500mg • Refill Request', status: 'Awaiting Auth', statusColor: 'text-secondary', iconBg: 'bg-primary-fixed', icon: 'medication', iconColor: 'text-primary' },
  { name: 'Marcus Holloway', medication: 'Atorvastatin 20mg • Dosage Adjustment', status: 'Awaiting Auth', statusColor: 'text-secondary', iconBg: 'bg-tertiary-fixed', icon: 'pill', iconColor: 'text-tertiary' },
  { name: 'Sarah Chen', medication: 'Lisinopril 10mg • Pharmacy Note: Conflict', status: 'Clinical Conflict', statusColor: 'text-error', iconBg: 'bg-error-container', icon: 'warning', iconColor: 'text-error' },
];

const CHAT_MESSAGES = [
  { sender: 'Pharmacist David Wu', content: "Dr. Thorne, I've flagged the Chen prescription. There's a potential interaction with her recent cardiology notes. Could you review the alternate dosage?", isUser: false },
  { sender: 'You', content: "Understood, David. I am pulling up her Clinical Review file now. Let's aim for the 5mg start.", isUser: true },
];

export default function DoctorPortalPage() {
  return (
    <ProtectedRoute requiredRole="DOCTOR">
      <DoctorPortalContent />
    </ProtectedRoute>
  );
}

function DoctorPortalContent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const [chatInput, setChatInput] = useState('');

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    showToast('Message sent to pharmacist', 'success');
    setChatInput('');
  };

  return (
    <div className="bg-surface min-h-screen flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-100 bg-slate-50 flex flex-col z-40">
        <div className="p-8">
          <Link href="/" className="font-headline italic text-2xl text-primary block mb-1">ArogyaNexa</Link>
          <p className="text-xs text-outline font-label uppercase tracking-widest">Doctor Portal</p>
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
          <div className="bg-tertiary/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="text-xs font-bold text-tertiary">System Status: Active</span>
            </div>
            <p className="text-[10px] text-on-surface-variant">EHR sync active</p>
          </div>
          {user && (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full clinical-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-on-surface truncate">{user.firstName} {user.lastName}</p>
                <p className="text-[10px] text-outline">DOCTOR</p>
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
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input className="pl-10 pr-4 py-1.5 bg-surface-container-low border-none rounded-full text-sm w-56 focus:ring-1 focus:ring-primary/20 outline-none" placeholder="Search medical records..." />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">notifications</span></button>
            <Link href="/profile" className="p-2 text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">account_circle</span></Link>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          <header className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="font-headline text-4xl text-primary tracking-tight mb-2">Clinical Oversight</h1>
              <p className="text-on-surface-variant">Welcome back, {user?.firstName || 'Doctor'}. You have <span className="font-bold text-primary">4 pending requests</span> from ArogyaNexa Pharmacists.</p>
            </div>
            <Link href="/doctor/prescriptions" className="btn-primary text-sm">
              <span className="material-symbols-outlined text-sm">add_notes</span> Create Prescription
            </Link>
          </header>

          <div className="grid grid-cols-12 gap-8">
            <section className="col-span-12 lg:col-span-8 space-y-6">
              <div className="card p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-headline text-2xl text-primary italic">Priority Review Queue</h3>
                  <span className="badge bg-surface-container-low text-on-surface-variant text-xs">4 Urgent</span>
                </div>
                <div className="space-y-4">
                  {PENDING_REQUESTS.map((req) => (
                    <div key={req.name} className="group flex items-center justify-between p-5 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-lowest transition-all hover:shadow-primary-sm cursor-pointer">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-full ${req.iconBg} flex items-center justify-center`}>
                          <span className={`material-symbols-outlined ${req.iconColor}`}>{req.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-primary">{req.name}</p>
                          <p className="text-sm text-on-surface-variant">{req.medication}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="section-label text-[10px]">Status</p>
                          <p className={`text-sm font-medium ${req.statusColor}`}>{req.status}</p>
                        </div>
                        <Link href="/doctor/prescriptions" className="bg-primary text-white p-2 rounded-lg group-hover:bg-primary-container transition-colors">
                          <span className="material-symbols-outlined">chevron_right</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat */}
              <div className="card flex flex-col h-[380px]">
                <div className="p-6 border-b border-surface-container flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">forum</span>
                    <h3 className="font-headline text-xl italic text-primary">Pharmacist Collaboration</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse" />
                    <span className="section-label text-[10px]">Live: ArogyaNexa Center 04</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {CHAT_MESSAGES.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.isUser ? 'flex-row-reverse max-w-[80%] ml-auto' : 'max-w-[80%]'}`}>
                      {!msg.isUser && (
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-sm text-on-surface-variant">person</span>
                        </div>
                      )}
                      <div className={`p-4 rounded-xl ${msg.isUser ? 'clinical-gradient text-white rounded-tr-none' : 'bg-surface-container-low rounded-tl-none'}`}>
                        {!msg.isUser && <p className="text-sm text-on-surface font-medium mb-1">{msg.sender}</p>}
                        <p className={`text-sm ${msg.isUser ? 'text-white' : 'text-on-surface-variant'}`}>{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-surface-container">
                  <div className="flex gap-3 items-center bg-surface-container-low px-4 py-2 rounded-full">
                    <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                      className="flex-1 bg-transparent border-none text-sm focus:ring-0 outline-none" placeholder="Reply to pharmacist..." />
                    <button onClick={handleSendChat} className="text-primary"><span className="material-symbols-outlined">send</span></button>
                  </div>
                </div>
              </div>
            </section>

            <aside className="col-span-12 lg:col-span-4 space-y-6">
              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="font-headline text-lg text-primary mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { icon: 'add_notes', label: 'New Prescription', href: '/doctor/prescriptions' },
                    { icon: 'people', label: 'View Patients', href: '/doctor/patients' },
                    { icon: 'smart_toy', label: 'Ask AI Assistant', href: '/ai-assistant' },
                    { icon: 'person', label: 'My Profile', href: '/profile' },
                  ].map((a) => (
                    <Link key={a.label} href={a.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors group">
                      <span className="material-symbols-outlined text-primary text-xl">{a.icon}</span>
                      <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{a.label}</span>
                      <span className="material-symbols-outlined text-outline text-sm ml-auto">chevron_right</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Insight */}
              <div className="clinical-gradient text-white rounded-xl p-8 shadow-primary-lg relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-headline text-xl mb-4 italic">ArogyaNexa Insight</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-6">Your approval speed has increased by 14% this week. Patient wait times reduced by 4 hours on average.</p>
                  <div className="flex items-end gap-2">
                    <span className="font-headline text-4xl">98.2<span className="text-lg">%</span></span>
                    <span className="section-label text-[10px] text-white/70 mb-1.5">Accuracy Rating</span>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-10">
                  <span className="material-symbols-outlined text-[160px]" style={{ fontVariationSettings: "'wght' 100" }}>medical_services</span>
                </div>
              </div>

              {/* Upcoming */}
              <div className="bg-surface-container-low/30 rounded-xl p-6 border border-outline-variant/5">
                <h4 className="section-label text-[10px] mb-4">Upcoming Reviews</h4>
                <div className="space-y-4">
                  {[
                    { date: '24', title: 'Compliance Audit', sub: 'ArogyaNexa Q3 Inventory Check' },
                    { date: '28', title: 'Telehealth Block', sub: '09:00 - 11:30 AM (12 Patients)' },
                  ].map(item => (
                    <div key={item.title} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-outline-variant/15 text-primary flex-shrink-0">
                        <span className="text-xs font-bold italic font-headline">{item.date}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{item.title}</p>
                        <p className="text-xs text-on-surface-variant">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
