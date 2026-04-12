'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import ConsultationModal from '@/components/doctor/ConsultationModal';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/doctor', icon: 'dashboard', label: 'Dashboard' },
  { href: '/doctor/patients', icon: 'people', label: 'Patients' },
  { href: '/doctor/prescriptions', icon: 'description', label: 'Prescriptions' },
  { href: '/doctor/schedule', icon: 'calendar_month', label: 'Schedule' },
  { href: '/ai-assistant', icon: 'smart_toy', label: 'AI Assistant' },
];

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  duration: string;
  type: 'Consultation' | 'Follow-up' | 'Emergency';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

const APPOINTMENTS: Appointment[] = [
  { id: 'APT-001', patientName: 'Elena Rodriguez', time: '09:00 AM', duration: '30 min', type: 'Follow-up', status: 'Scheduled', notes: 'Diabetes checkup' },
  { id: 'APT-002', patientName: 'Marcus Holloway', time: '10:00 AM', duration: '45 min', type: 'Consultation', status: 'Scheduled', notes: 'Blood pressure review' },
  { id: 'APT-003', patientName: 'Sarah Chen', time: '11:00 AM', duration: '30 min', type: 'Emergency', status: 'Scheduled', notes: 'Cardiac symptoms' },
  { id: 'APT-004', patientName: 'David Kumar', time: '02:00 PM', duration: '30 min', type: 'Follow-up', status: 'Scheduled', notes: 'Asthma medication review' },
  { id: 'APT-005', patientName: 'Lisa Anderson', time: '03:00 PM', duration: '30 min', type: 'Consultation', status: 'Scheduled', notes: 'Migraine treatment' },
  { id: 'APT-006', patientName: 'Raj Patel', time: '04:00 PM', duration: '45 min', type: 'Follow-up', status: 'Scheduled', notes: 'Arthritis progress check' },
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

export default function DoctorSchedulePage() {
  return (
    <ProtectedRoute requiredRole="DOCTOR">
      <DoctorScheduleContent />
    </ProtectedRoute>
  );
}

function DoctorScheduleContent() {
  const pathname = usePathname();
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState('2024-10-24');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showConsultation, setShowConsultation] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Consultation': return 'bg-primary-fixed text-primary';
      case 'Follow-up': return 'bg-tertiary-fixed text-tertiary';
      case 'Emergency': return 'bg-error-container text-error';
      default: return 'bg-surface-container text-outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-amber-100 text-amber-800';
      case 'Completed': return 'bg-tertiary-fixed text-tertiary';
      case 'Cancelled': return 'bg-surface-container text-outline';
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
            <h1 className="font-headline text-2xl text-primary">My Schedule</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 bg-surface-container-low p-1 rounded-lg">
              <button
                onClick={() => setView('day')}
                className={cn('px-4 py-1.5 text-xs font-bold rounded-md transition-colors',
                  view === 'day' ? 'bg-white shadow-sm text-on-surface' : 'text-on-surface-variant hover:text-primary'
                )}
              >
                Day
              </button>
              <button
                onClick={() => setView('week')}
                className={cn('px-4 py-1.5 text-xs font-bold rounded-md transition-colors',
                  view === 'week' ? 'bg-white shadow-sm text-on-surface' : 'text-on-surface-variant hover:text-primary'
                )}
              >
                Week
              </button>
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
              { label: 'Today\'s Appointments', value: APPOINTMENTS.length, icon: 'event', color: 'text-primary' },
              { label: 'Scheduled', value: APPOINTMENTS.filter(a => a.status === 'Scheduled').length, icon: 'schedule', color: 'text-amber-600' },
              { label: 'Emergency', value: APPOINTMENTS.filter(a => a.type === 'Emergency').length, icon: 'warning', color: 'text-error' },
              { label: 'Available Slots', value: 2, icon: 'event_available', color: 'text-tertiary' },
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar/Timeline */}
            <div className="lg:col-span-2 space-y-6">
              {/* Date Selector */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-headline text-2xl text-primary">October 2024</h2>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-on-surface-variant">chevron_left</span>
                    </button>
                    <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {WEEK_DAYS.map(day => (
                    <div key={day} className="text-center text-xs font-bold text-on-surface-variant py-2">
                      {day}
                    </div>
                  ))}
                  {[21, 22, 23, 24, 25, 26, 27].map(date => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(`2024-10-${date}`)}
                      className={cn(
                        'aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors',
                        date === 24 
                          ? 'bg-primary text-white' 
                          : 'hover:bg-surface-container-low text-on-surface'
                      )}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              {/* Appointments List */}
              <div className="card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-headline text-2xl text-primary">Today's Appointments</h2>
                  <span className="text-sm text-on-surface-variant">Thursday, Oct 24</span>
                </div>
                <div className="space-y-4">
                  {APPOINTMENTS.map((apt) => (
                    <div key={apt.id} className="p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-headline text-primary">{apt.time.split(':')[0]}</div>
                            <div className="text-xs text-on-surface-variant">{apt.time.split(' ')[1]}</div>
                          </div>
                          <div className="h-12 w-px bg-outline-variant" />
                          <div>
                            <p className="font-semibold text-on-surface mb-1">{apt.patientName}</p>
                            <p className="text-sm text-on-surface-variant">{apt.notes}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`badge text-xs ${getTypeColor(apt.type)}`}>
                            {apt.type}
                          </span>
                          <span className="text-xs text-on-surface-variant">{apt.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/10">
                        <button 
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setShowConsultation(true);
                          }}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          Start Consultation
                        </button>
                        <button 
                          onClick={() => showToast('Rescheduling...', 'info')}
                          className="text-xs text-on-surface-variant hover:text-primary transition-colors"
                        >
                          Reschedule
                        </button>
                        <button 
                          onClick={() => showToast('Cancelling...', 'error')}
                          className="text-xs text-error hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Working Hours */}
              <div className="card p-6">
                <h3 className="font-headline text-lg text-primary mb-4">Working Hours</h3>
                <div className="space-y-3">
                  {[
                    { day: 'Monday - Friday', hours: '09:00 AM - 05:00 PM' },
                    { day: 'Saturday', hours: '09:00 AM - 01:00 PM' },
                    { day: 'Sunday', hours: 'Closed' },
                  ].map(schedule => (
                    <div key={schedule.day} className="flex justify-between items-center p-3 bg-surface-container-low rounded-lg">
                      <span className="text-sm text-on-surface-variant">{schedule.day}</span>
                      <span className="text-sm font-medium text-on-surface">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card p-6">
                <h3 className="font-headline text-lg text-primary mb-4">This Week</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Total Appointments', value: '28', icon: 'event' },
                    { label: 'Completed', value: '22', icon: 'check_circle' },
                    { label: 'Cancelled', value: '2', icon: 'cancel' },
                    { label: 'No-shows', value: '1', icon: 'person_off' },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-sm">{stat.icon}</span>
                        <span className="text-sm text-on-surface-variant">{stat.label}</span>
                      </div>
                      <span className="font-semibold text-on-surface">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="font-headline text-lg text-primary mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => showToast('Block time functionality coming soon', 'info')}
                    className="btn-secondary text-sm w-full"
                  >
                    <span className="material-symbols-outlined text-sm">block</span>
                    Block Time
                  </button>
                  <button 
                    onClick={() => showToast('Export schedule functionality coming soon', 'info')}
                    className="btn-secondary text-sm w-full"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Export Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedAppointment && (
        <ConsultationModal
          isOpen={showConsultation}
          onClose={() => {
            setShowConsultation(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
        />
      )}

      <ToastContainer />
    </div>
  );
}
