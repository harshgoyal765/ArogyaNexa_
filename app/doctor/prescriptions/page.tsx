'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import CreatePrescriptionModal from '@/components/doctor/CreatePrescriptionModal';
import PrescriptionDetailsModal from '@/components/doctor/PrescriptionDetailsModal';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/doctor', icon: 'dashboard', label: 'Dashboard' },
  { href: '/doctor/patients', icon: 'people', label: 'Patients' },
  { href: '/doctor/prescriptions', icon: 'description', label: 'Prescriptions' },
  { href: '/doctor/schedule', icon: 'calendar_month', label: 'Schedule' },
  { href: '/ai-assistant', icon: 'smart_toy', label: 'AI Assistant' },
];

const PRESCRIPTIONS = [
  { id: 'RX-D001', patient: 'Elena Rodriguez', medication: 'Metformin 500mg', dosage: '1 tablet twice daily', duration: '30 days', status: 'ACTIVE', date: '2024-10-20' },
  { id: 'RX-D002', patient: 'Marcus Holloway', medication: 'Atorvastatin 20mg', dosage: '1 tablet at night', duration: '90 days', status: 'PENDING_REVIEW', date: '2024-10-22' },
  { id: 'RX-D003', patient: 'Sarah Chen', medication: 'Lisinopril 10mg', dosage: '1 tablet daily', duration: '60 days', status: 'CONFLICT', date: '2024-10-23' },
  { id: 'RX-D004', patient: 'David Kumar', medication: 'Albuterol Inhaler', dosage: '2 puffs as needed', duration: '90 days', status: 'ACTIVE', date: '2024-10-18' },
  { id: 'RX-D005', patient: 'Lisa Anderson', medication: 'Sumatriptan 50mg', dosage: '1 tablet when needed', duration: '30 days', status: 'ACTIVE', date: '2024-10-21' },
];

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-tertiary-fixed/50 text-tertiary',
  PENDING_REVIEW: 'bg-amber-100 text-amber-800',
  CONFLICT: 'bg-error-container text-error',
};

export default function DoctorPrescriptionsPage() {
  return (
    <ProtectedRoute requiredRole="DOCTOR">
      <DoctorPrescriptionsContent />
    </ProtectedRoute>
  );
}

function DoctorPrescriptionsContent() {
  const pathname = usePathname();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<typeof PRESCRIPTIONS[0] | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <div className="bg-surface min-h-screen flex">
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
      </aside>

      <div className="ml-64 flex-1 min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div>
            <h1 className="font-headline text-2xl text-primary">Prescriptions</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/doctor/notifications"
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <Link 
              href="/doctor/profile" 
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </header>

        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-on-surface-variant text-sm">Manage and issue patient prescriptions</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary text-sm"
            >
              <span className="material-symbols-outlined text-sm">add_notes</span> New Prescription
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Prescriptions', value: PRESCRIPTIONS.length, icon: 'description', color: 'text-primary' },
              { label: 'Active', value: PRESCRIPTIONS.filter(p => p.status === 'ACTIVE').length, icon: 'check_circle', color: 'text-tertiary' },
              { label: 'Pending Review', value: PRESCRIPTIONS.filter(p => p.status === 'PENDING_REVIEW').length, icon: 'schedule', color: 'text-amber-600' },
              { label: 'Conflicts', value: PRESCRIPTIONS.filter(p => p.status === 'CONFLICT').length, icon: 'warning', color: 'text-error' },
            ].map(stat => (
              <div key={stat.label} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                  <span className="section-label text-[10px]">{stat.label}</span>
                </div>
                <div className="font-headline text-4xl text-primary">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="card overflow-hidden">
            <div className="px-8 py-6 border-b border-outline-variant/10">
              <h2 className="font-headline text-2xl text-primary">All Prescriptions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    {['Rx ID', 'Patient', 'Medication', 'Dosage', 'Duration', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 section-label text-[10px] font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {PRESCRIPTIONS.map((rx) => (
                    <tr key={rx.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-primary">{rx.id}</td>
                      <td className="px-5 py-4 font-medium text-on-surface">{rx.patient}</td>
                      <td className="px-5 py-4 text-on-surface-variant">{rx.medication}</td>
                      <td className="px-5 py-4 text-on-surface-variant text-xs">{rx.dosage}</td>
                      <td className="px-5 py-4 text-on-surface-variant text-xs">{rx.duration}</td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs ${STATUS_STYLES[rx.status] || 'bg-surface-container text-outline'}`}>
                          {rx.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-on-surface-variant text-xs">{rx.date}</td>
                      <td className="px-5 py-4">
                        <button 
                          onClick={() => {
                            setSelectedPrescription(rx);
                            setShowDetailsModal(true);
                          }}
                          className="text-primary hover:text-primary-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CreatePrescriptionModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          // Optionally refresh prescription list
        }}
      />

      {selectedPrescription && (
        <PrescriptionDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedPrescription(null);
          }}
          prescription={selectedPrescription}
        />
      )}

      <ToastContainer />
    </div>
  );
}

