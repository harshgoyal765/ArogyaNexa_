'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import PatientHistoryModal from '@/components/doctor/PatientHistoryModal';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/doctor', icon: 'dashboard', label: 'Dashboard' },
  { href: '/doctor/patients', icon: 'people', label: 'Patients' },
  { href: '/doctor/prescriptions', icon: 'description', label: 'Prescriptions' },
  { href: '/doctor/schedule', icon: 'calendar_month', label: 'Schedule' },
  { href: '/ai-assistant', icon: 'smart_toy', label: 'AI Assistant' },
];

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  lastVisit: string;
  condition: string;
  status: 'Active' | 'Follow-up' | 'Critical';
}

const PATIENTS: Patient[] = [
  { id: 'PT-001', name: 'Elena Rodriguez', age: 45, gender: 'Female', bloodGroup: 'A+', phone: '+91 98765 43210', email: 'elena.r@email.com', lastVisit: '2024-10-20', condition: 'Type 2 Diabetes', status: 'Active' },
  { id: 'PT-002', name: 'Marcus Holloway', age: 58, gender: 'Male', bloodGroup: 'O+', phone: '+91 98765 43211', email: 'marcus.h@email.com', lastVisit: '2024-10-22', condition: 'Hypertension', status: 'Follow-up' },
  { id: 'PT-003', name: 'Sarah Chen', age: 62, gender: 'Female', bloodGroup: 'B+', phone: '+91 98765 43212', email: 'sarah.c@email.com', lastVisit: '2024-10-23', condition: 'Cardiac Arrhythmia', status: 'Critical' },
  { id: 'PT-004', name: 'David Kumar', age: 35, gender: 'Male', bloodGroup: 'AB+', phone: '+91 98765 43213', email: 'david.k@email.com', lastVisit: '2024-10-18', condition: 'Asthma', status: 'Active' },
  { id: 'PT-005', name: 'Lisa Anderson', age: 41, gender: 'Female', bloodGroup: 'O-', phone: '+91 98765 43214', email: 'lisa.a@email.com', lastVisit: '2024-10-21', condition: 'Migraine', status: 'Follow-up' },
  { id: 'PT-006', name: 'Raj Patel', age: 52, gender: 'Male', bloodGroup: 'A-', phone: '+91 98765 43215', email: 'raj.p@email.com', lastVisit: '2024-10-19', condition: 'Arthritis', status: 'Active' },
];

export default function DoctorPatientsPage() {
  return (
    <ProtectedRoute requiredRole="DOCTOR">
      <DoctorPatientsContent />
    </ProtectedRoute>
  );
}

function DoctorPatientsContent() {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const filteredPatients = PATIENTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-tertiary-fixed text-tertiary';
      case 'Follow-up': return 'bg-amber-100 text-amber-800';
      case 'Critical': return 'bg-error-container text-error';
      default: return 'bg-surface-container text-outline';
    }
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
      </aside>

      {/* Main */}
      <div className="ml-64 flex-1 min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-white/80 backdrop-blur-md shadow-sm shadow-primary/5">
          <div>
            <h1 className="font-headline text-2xl text-primary">My Patients</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-1.5 bg-surface-container-low border-none rounded-full text-sm w-64 focus:ring-1 focus:ring-primary/20 outline-none" 
                placeholder="Search patients..." 
              />
            </div>
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
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Patients', value: PATIENTS.length, icon: 'people', color: 'text-primary' },
              { label: 'Active', value: PATIENTS.filter(p => p.status === 'Active').length, icon: 'check_circle', color: 'text-tertiary' },
              { label: 'Follow-up', value: PATIENTS.filter(p => p.status === 'Follow-up').length, icon: 'schedule', color: 'text-amber-600' },
              { label: 'Critical', value: PATIENTS.filter(p => p.status === 'Critical').length, icon: 'warning', color: 'text-error' },
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

          {/* Patients Table */}
          <div className="card overflow-hidden">
            <div className="px-8 py-6 border-b border-outline-variant/10">
              <h2 className="font-headline text-2xl text-primary">Patient List</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    {['Patient ID', 'Name', 'Age/Gender', 'Blood Group', 'Contact', 'Condition', 'Last Visit', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 section-label text-[10px] font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-primary">{patient.id}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full clinical-gradient flex items-center justify-center text-white text-sm font-bold">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium text-on-surface">{patient.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-on-surface-variant">{patient.age}Y / {patient.gender[0]}</td>
                      <td className="px-5 py-4">
                        <span className="badge bg-error-container text-error text-xs">{patient.bloodGroup}</span>
                      </td>
                      <td className="px-5 py-4 text-on-surface-variant text-xs">
                        <div>{patient.phone}</div>
                        <div className="text-outline">{patient.email}</div>
                      </td>
                      <td className="px-5 py-4 text-on-surface-variant">{patient.condition}</td>
                      <td className="px-5 py-4 text-on-surface-variant text-xs">{patient.lastVisit}</td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button 
                          onClick={() => setSelectedPatient(patient)}
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

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedPatient(null)}
          />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
              <div>
                <h2 className="font-headline text-3xl text-primary">Patient Details</h2>
                <p className="text-sm text-on-surface-variant mt-1">{selectedPatient.id}</p>
              </div>
              <button 
                onClick={() => setSelectedPatient(null)}
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Full Name', value: selectedPatient.name },
                  { label: 'Age', value: `${selectedPatient.age} years` },
                  { label: 'Gender', value: selectedPatient.gender },
                  { label: 'Blood Group', value: selectedPatient.bloodGroup },
                  { label: 'Phone', value: selectedPatient.phone },
                  { label: 'Email', value: selectedPatient.email },
                  { label: 'Condition', value: selectedPatient.condition },
                  { label: 'Last Visit', value: selectedPatient.lastVisit },
                ].map(field => (
                  <div key={field.label}>
                    <label className="section-label text-[10px] block mb-1">{field.label}</label>
                    <p className="text-on-surface">{field.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <Link href="/doctor/prescriptions" className="flex-1 btn-primary text-sm">
                  <span className="material-symbols-outlined text-sm">add_notes</span>
                  Create Prescription
                </Link>
                <button 
                  onClick={() => {
                    setShowHistory(true);
                  }}
                  className="flex-1 btn-secondary text-sm"
                >
                  <span className="material-symbols-outlined text-sm">history</span>
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPatient && (
        <PatientHistoryModal
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          patientName={selectedPatient.name}
          patientId={selectedPatient.id}
        />
      )}

      <ToastContainer />
    </div>
  );
}
