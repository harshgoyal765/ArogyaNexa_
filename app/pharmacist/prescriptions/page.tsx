'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { formatDate, cn } from '@/lib/utils';
import { prescriptionsService, type PrescriptionItem } from '@/lib/services/articles.service';
import PharmacistSidebar from '@/components/layout/PharmacistSidebar';
import type { ApiResponse } from '@/types/api';

type Prescription = PrescriptionItem;

export default function PharmacistPrescriptionsPage() {
  return (
    <ProtectedRoute requiredRole={['PHARMACIST', 'ADMIN', 'SUPER_ADMIN']}>
      <PharmacistDashboard />
    </ProtectedRoute>
  );
}

function PharmacistDashboard() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [selected, setSelected] = useState<Prescription | null>(null);
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });

  const fetchPrescriptions = (status: string) => {
    setLoading(true);
    prescriptionsService
      .list({ status })
      .then(({ data }) => setPrescriptions(data.data))
      .catch(() => setPrescriptions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPrescriptions(activeTab); }, [activeTab]);

  useEffect(() => {
    prescriptionsService.list()
      .then(({ data }) => {
        const all = data.data;
        setSummary({
          total: all.length,
          pending: all.filter((p) => p.status === 'PENDING').length,
          approved: all.filter((p) => p.status === 'APPROVED').length,
          rejected: all.filter((p) => p.status === 'REJECTED').length,
        });
      })
      .catch(() => setSummary({ pending: 0, approved: 0, rejected: 0, total: 0 }));
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessing(id);
    try {
      if (action === 'approve') {
        await prescriptionsService.approve(id);
      } else {
        await prescriptionsService.reject(id);
      }
      showToast(`Prescription ${action}d successfully`, 'success');
      fetchPrescriptions(activeTab);
      setSelected(null);
    } catch {
      showToast(`Failed to ${action} prescription`, 'error');
    } finally {
      setProcessing(null);
    }
  };

  const stats = [
    { label: 'Pending Review', value: summary.pending, icon: 'pending_actions', color: 'text-amber-600', bg: 'bg-amber-50', badge: '4 Urgent', badgeColor: 'bg-secondary-container text-on-secondary-container' },
    { label: 'Approved Today', value: summary.approved, icon: 'check_circle', color: 'text-tertiary', bg: 'bg-tertiary-fixed/30', badge: '12 Pending', badgeColor: 'bg-surface-container text-on-surface-variant' },
    { label: 'Rejected', value: summary.rejected, icon: 'cancel', color: 'text-error', bg: 'bg-error-container/30', badge: null, badgeColor: '' },
    { label: 'Total Processed', value: summary.total, icon: 'assignment_turned_in', color: 'text-primary', bg: 'bg-primary-fixed/30', badge: null, badgeColor: '' },
  ];

  return (
    <div className="bg-surface min-h-screen flex">
      <PharmacistSidebar />
      <div className="ml-64 flex-1 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div>
            <h1 className="font-headline text-2xl text-primary">Prescription Review</h1>
            <p className="text-xs text-on-surface-variant">Clinical dispensing queue</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-outline font-bold">Queue Status</p>
              <p className="text-lg font-bold text-primary">{stats[0].value} Pending Reviews</p>
            </div>
            <Link 
              href="/pharmacist/notifications"
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <Link 
              href="/pharmacist/profile"
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="card p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
                </div>
                <div>
                  <p className="section-label text-[10px]">{s.label}</p>
                  <p className="font-headline text-2xl text-on-surface">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bento Grid: Queue + Review Interface */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left: Queue List */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-outline">Priority Queue</h3>
                <span className="material-symbols-outlined text-outline cursor-pointer">filter_list</span>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl">
                {(['PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
                  <button key={tab} onClick={() => { setActiveTab(tab); setSelected(null); }}
                    className={cn('flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all',
                      activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary')}>
                    {tab}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
              ) : prescriptions.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <span className="material-symbols-outlined text-4xl text-outline-variant">check_circle</span>
                  <p className="text-sm text-on-surface-variant">No {activeTab.toLowerCase()} prescriptions</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                  {prescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      onClick={() => { setSelected(rx); setNotes(rx.notes || ''); }}
                      className={cn(
                        'p-4 rounded-xl cursor-pointer transition-all',
                        selected?.id === rx.id
                          ? 'bg-surface-container-lowest shadow-md border-l-4 border-primary'
                          : rx.status === 'PENDING'
                            ? 'bg-surface-container-lowest border-l-4 border-error hover:shadow-md'
                            : 'bg-surface-container-low hover:bg-surface-container-lowest hover:shadow-md'
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={cn('text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded', {
                          'bg-error-container/30 text-error': rx.status === 'PENDING',
                          'bg-secondary-container/20 text-on-secondary-container': rx.status === 'APPROVED',
                          'bg-surface-container-high text-on-surface-variant': rx.status === 'REJECTED',
                        })}>
                          {rx.status === 'PENDING' ? 'Urgent' : rx.status}
                        </span>
                        <span className="text-[10px] text-outline">{formatDate(rx.createdAt)}</span>
                      </div>
                      <h4 className="font-bold text-primary text-sm">Rx #{rx.id.slice(0, 8)}</h4>
                      <p className="text-xs text-on-surface-variant mt-1">Prescription Document</p>
                      {rx.notes && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-outline">clinical_notes</span>
                          <span className="text-[10px] text-outline truncate">{rx.notes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Review Interface */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {selected ? (
                <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_-10px_rgba(0,65,130,0.06)] min-h-[600px] flex flex-col">
                  <div className="flex flex-col md:flex-row gap-8 mb-8">
                    {/* Prescription Image */}
                    <div className="w-full md:w-1/2 aspect-[3/4] bg-surface-container rounded-xl overflow-hidden border border-outline-variant/20 relative group flex items-center justify-center">
                      {selected.fileUrl ? (
                        <img src={selected.fileUrl} alt="Prescription" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center space-y-3">
                          <span className="material-symbols-outlined text-6xl text-outline-variant">description</span>
                          <p className="text-xs text-on-surface-variant">No document preview</p>
                        </div>
                      )}
                      {selected.fileUrl && (
                        <a href={selected.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-primary flex items-center gap-2 shadow-lg">
                            <Eye size={14} /> View Full Document
                          </div>
                        </a>
                      )}
                    </div>

                    {/* Patient & Med Details */}
                    <div className="w-full md:w-1/2 space-y-6">
                      <div>
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-outline font-bold mb-3">Clinical Profile</h3>
                        <div className="space-y-1">
                          <p className="text-2xl font-headline font-bold text-primary">Prescription #{selected.id.slice(0, 8)}</p>
                          <p className="text-sm text-on-surface-variant">Submitted: {formatDate(selected.createdAt)}</p>
                          <p className="text-sm text-on-surface-variant">Status: <span className={cn('font-semibold', {
                            'text-amber-600': selected.status === 'PENDING',
                            'text-tertiary': selected.status === 'APPROVED',
                            'text-error': selected.status === 'REJECTED',
                          })}>{selected.status}</span></p>
                        </div>
                      </div>

                      <div className="p-4 bg-surface-container-low rounded-xl">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-outline font-bold mb-3">Dispensing Notes</h3>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full bg-white border-none rounded-lg text-sm focus:ring-1 focus:ring-primary h-24 placeholder:text-outline/50 p-3 outline-none resize-none"
                          placeholder="Add clinical notes for the dispensing team..."
                        />
                      </div>

                      {selected.fileUrl && (
                        <a href={selected.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                          <Eye size={12} /> View Prescription File
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Treatment Timeline */}
                  <div className="mt-auto pt-6 border-t border-outline-variant/20">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-outline font-bold mb-4">Verification Timeline</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {[
                        { label: 'Intake', time: 'Received', done: true },
                        { label: 'Clinical', time: 'Assigned', done: true },
                        { label: 'Pharmacist', time: 'Current', active: true },
                        { label: 'Fulfillment', time: '--:--', done: false },
                        { label: 'Logistics', time: '--:--', done: false },
                      ].map((step) => (
                        <div key={step.label} className="min-w-[100px] p-3 rounded-lg bg-surface border border-outline-variant/10 text-center">
                          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-white text-xs font-bold', {
                            'bg-tertiary': step.done,
                            'bg-primary animate-pulse': step.active,
                            'bg-surface-container-high text-on-surface-variant/40': !step.done && !step.active,
                          })}>
                            {step.done ? '✓' : step.active ? '●' : '○'}
                          </div>
                          <p className={cn('text-[10px] font-bold uppercase tracking-widest', step.active ? 'text-primary' : 'text-on-surface-variant')}>{step.label}</p>
                          <p className={cn('text-[9px] font-medium mt-0.5', step.active ? 'text-primary' : 'text-on-surface-variant/40')}>{step.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Decision Bar */}
                  {selected.status === 'PENDING' && (
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => handleAction(selected.id, 'approve')}
                        disabled={processing === selected.id}
                        className="flex-1 min-w-[140px] bg-gradient-to-r from-tertiary-container to-tertiary text-white font-bold py-3 rounded-xl shadow-lg shadow-tertiary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        {processing === selected.id ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(selected.id, 'reject')}
                        disabled={processing === selected.id}
                        className="flex-1 min-w-[140px] bg-error-container text-on-error-container font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-error hover:text-white transition-all"
                      >
                        <span className="material-symbols-outlined">cancel</span>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Analytics Overview when nothing selected */
                <div className="space-y-6">
                  <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
                    <h3 className="font-headline text-2xl text-primary mb-6">Prescription Review</h3>
                    <p className="text-on-surface-variant mb-6">Verify clinical accuracy and authorize pharmaceutical distribution for pending requests.</p>
                    <p className="text-sm text-outline italic">← Select a prescription from the queue to begin review</p>
                  </div>

                  {/* Analytics cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { icon: 'psychology', color: 'text-secondary', bg: 'bg-secondary-container/20', title: 'AI Suggestion', desc: '"Reviewing renal dosing for Patient ID RX-99021 based on last GFR."' },
                      { icon: 'inventory_2', color: 'text-tertiary', bg: 'bg-tertiary-fixed/20', title: 'Inventory Alert', desc: '"Critical low stock for Ozempic 1mg. Scheduled for restock tomorrow."' },
                      { icon: 'group_work', color: 'text-primary', bg: 'bg-primary/5', title: 'Team Pulse', desc: '"2 pharmacists and 4 technicians currently active in this clinic."' },
                    ].map((card) => (
                      <div key={card.title} className={`${card.bg} p-6 rounded-xl flex items-center gap-4`}>
                        <span className={`material-symbols-outlined text-3xl ${card.color}`}>{card.icon}</span>
                        <div>
                          <h5 className="text-xs font-bold uppercase text-on-surface-variant">{card.title}</h5>
                          <p className="text-sm italic mt-1">{card.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
