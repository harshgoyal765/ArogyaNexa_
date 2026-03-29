'use client';
import Link from 'next/link';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';

const PRESCRIPTIONS = [
  { id: 'RX-D001', patient: 'Elena Rodriguez', medication: 'Metformin 500mg', dosage: '1 tablet twice daily', duration: '30 days', status: 'ACTIVE', date: '2024-10-20' },
  { id: 'RX-D002', patient: 'Marcus Holloway', medication: 'Atorvastatin 20mg', dosage: '1 tablet at night', duration: '90 days', status: 'PENDING_REVIEW', date: '2024-10-22' },
  { id: 'RX-D003', patient: 'Sarah Chen', medication: 'Lisinopril 10mg', dosage: '1 tablet daily', duration: '60 days', status: 'CONFLICT', date: '2024-10-23' },
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
  const router = useRouter();

  return (
    <div className="bg-surface min-h-screen flex">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-100 bg-slate-50 flex flex-col z-40 pt-8 px-8">
        <Link href="/" className="font-headline italic text-2xl text-primary block mb-1">ArogyaNexa</Link>
        <p className="text-xs text-outline font-label uppercase tracking-widest mb-8">Doctor Portal</p>
        {[
          { href: '/doctor', icon: 'dashboard', label: 'Dashboard' },
          { href: '/doctor/patients', icon: 'people', label: 'Patients' },
          { href: '/doctor/prescriptions', icon: 'description', label: 'Prescriptions' },
          { href: '/doctor/schedule', icon: 'calendar_month', label: 'Schedule' },
          { href: '/ai-assistant', icon: 'smart_toy', label: 'AI Assistant' },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-medium uppercase tracking-wide transition-all hover:translate-x-1 duration-200 rounded-lg mb-1 ${item.href === '/doctor/prescriptions' ? 'text-primary font-semibold bg-primary-fixed/30' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`}>
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </aside>

      <div className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-headline text-3xl text-primary">Prescriptions</h1>
            <p className="text-on-surface-variant text-sm mt-1">Manage and issue patient prescriptions</p>
          </div>
          <button onClick={() => showToast('Prescription form coming soon', 'success')} className="btn-primary text-sm">
            <span className="material-symbols-outlined text-sm">add_notes</span> New Prescription
          </button>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-container-low">
              <tr>
                {['Rx ID', 'Patient', 'Medication', 'Dosage', 'Duration', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-5 py-3 section-label text-[10px] font-semibold">{h}</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
