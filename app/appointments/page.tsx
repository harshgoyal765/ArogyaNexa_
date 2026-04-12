'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { clearAuth } from '@/store/authSlice';
import { authApi } from '@/lib/api/auth';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/products', icon: 'medication', label: 'Products' },
  { href: '/orders', icon: 'receipt_long', label: 'My Orders' },
  { href: '/prescriptions', icon: 'description', label: 'Prescriptions' },
  { href: '/appointments', icon: 'calendar_month', label: 'Book Appointment' },
  { href: '/support', icon: 'support_agent', label: 'Support' },
  { href: '/ai-assistant', icon: 'smart_toy', label: 'AI Assistant' },
];

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  consultationFee: number;
  availability: string[];
}

const DOCTORS: Doctor[] = [
  { id: 'D-001', name: 'Dr. Sarah Thorne', specialization: 'Internal Medicine', experience: '15 years', rating: 4.9, consultationFee: 1500, availability: ['Mon', 'Wed', 'Fri'] },
  { id: 'D-002', name: 'Dr. Rajesh Kumar', specialization: 'Cardiology', experience: '20 years', rating: 4.8, consultationFee: 2000, availability: ['Tue', 'Thu', 'Sat'] },
  { id: 'D-003', name: 'Dr. Emily Chen', specialization: 'Dermatology', experience: '12 years', rating: 4.9, consultationFee: 1800, availability: ['Mon', 'Tue', 'Wed'] },
  { id: 'D-004', name: 'Dr. Michael Brown', specialization: 'Orthopedics', experience: '18 years', rating: 4.7, consultationFee: 2200, availability: ['Wed', 'Thu', 'Fri'] },
  { id: 'D-005', name: 'Dr. Priya Sharma', specialization: 'Pediatrics', experience: '10 years', rating: 4.9, consultationFee: 1200, availability: ['Mon', 'Tue', 'Thu'] },
  { id: 'D-006', name: 'Dr. David Wilson', specialization: 'Psychiatry', experience: '14 years', rating: 4.8, consultationFee: 1600, availability: ['Tue', 'Wed', 'Fri'] },
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

export default function AppointmentsPage() {
  return (
    <ProtectedRoute>
      <AppointmentsContent />
    </ProtectedRoute>
  );
}

function AppointmentsContent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason.trim()) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    showToast('Appointment booked successfully!', 'success');
    setShowBookingModal(false);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setReason('');
  };

  return (
    <div className="bg-surface min-h-screen flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-100 bg-slate-50 flex flex-col z-40">
        <div className="p-8">
          <Link href="/" className="font-headline italic text-2xl text-primary block mb-1">ArogyaNexa</Link>
          <p className="text-xs text-outline font-label uppercase tracking-widest">Patient Portal</p>
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
          {user && (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-on-surface truncate">{user.firstName} {user.lastName}</p>
                <p className="text-[10px] text-outline">PATIENT</p>
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
          <div>
            <h1 className="font-headline text-2xl text-primary">Book Appointment</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/notifications"
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <Link 
              href="/profile" 
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-8">
            <p className="text-on-surface-variant">
              Schedule a consultation with our experienced doctors for prescription and medical advice.
            </p>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOCTORS.map((doctor) => (
              <div key={doctor.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full clinical-gradient flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-on-surface text-lg mb-1">{doctor.name}</h3>
                    <p className="text-sm text-primary font-medium">{doctor.specialization}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                      <span className="text-xs text-on-surface-variant">{doctor.rating} • {doctor.experience}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant">Consultation Fee</span>
                    <span className="font-bold text-primary">₹{doctor.consultationFee}</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant mb-2">Available Days</p>
                    <div className="flex gap-2">
                      {doctor.availability.map((day) => (
                        <span key={day} className="badge bg-tertiary-fixed text-tertiary text-xs">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setShowBookingModal(true);
                  }}
                  className="btn-primary text-sm w-full"
                >
                  <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBookingModal(false)}
          />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
            <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
              <div>
                <h2 className="font-headline text-3xl text-primary">Book Appointment</h2>
                <p className="text-sm text-on-surface-variant mt-1">{selectedDoctor.name}</p>
              </div>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Doctor Info */}
              <div className="bg-surface-container-low p-4 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full clinical-gradient flex items-center justify-center text-white font-bold">
                    {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface">{selectedDoctor.name}</p>
                    <p className="text-sm text-primary">{selectedDoctor.specialization}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-on-surface-variant">Consultation Fee</p>
                    <p className="font-bold text-primary">₹{selectedDoctor.consultationFee}</p>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="section-label text-[10px] block mb-2">
                  Select Date <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="section-label text-[10px] block mb-2">
                  Select Time <span className="text-error">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        'px-3 py-2 text-xs font-medium rounded-lg transition-colors',
                        selectedTime === time
                          ? 'bg-primary text-white'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="section-label text-[10px] block mb-2">
                  Reason for Visit <span className="text-error">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="Please describe your symptoms or reason for consultation..."
                />
              </div>

              {/* Info Box */}
              <div className="bg-primary-fixed/10 border-l-4 border-primary rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">info</span>
                  <div>
                    <p className="text-xs text-on-surface-variant">
                      You will receive a confirmation email with appointment details. Please arrive 10 minutes early for your consultation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-8 py-6 border-t border-outline-variant/10 flex justify-end gap-3">
              <button 
                onClick={() => setShowBookingModal(false)}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleBookAppointment}
                className="btn-primary text-sm"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
