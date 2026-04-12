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

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  lastUpdate: string;
}

const SUPPORT_TICKETS: Ticket[] = [
  { id: 'TKT-001', subject: 'Order delivery delayed', category: 'Order Issue', status: 'In Progress', priority: 'High', createdAt: '2024-10-20', lastUpdate: '2024-10-22' },
  { id: 'TKT-002', subject: 'Prescription verification pending', category: 'Prescription', status: 'Open', priority: 'Medium', createdAt: '2024-10-21', lastUpdate: '2024-10-21' },
  { id: 'TKT-003', subject: 'Payment refund request', category: 'Payment', status: 'Resolved', priority: 'High', createdAt: '2024-10-15', lastUpdate: '2024-10-18' },
];

const FAQ_ITEMS = [
  { question: 'How do I track my order?', answer: 'You can track your order by going to "My Orders" section and clicking on the specific order. You\'ll see real-time tracking information.' },
  { question: 'How long does prescription verification take?', answer: 'Prescription verification typically takes 2-4 hours during business hours. You\'ll receive a notification once verified.' },
  { question: 'What is your refund policy?', answer: 'We offer full refunds within 7 days of delivery for unopened medications. Please contact support to initiate a refund.' },
  { question: 'How do I upload a prescription?', answer: 'Go to the "Prescriptions" section and click "Upload Prescription". You can upload images or PDF files of your prescription.' },
  { question: 'Can I cancel my order?', answer: 'Orders can be cancelled within 1 hour of placement. After that, please contact support for assistance.' },
];

export default function SupportPage() {
  return (
    <ProtectedRoute>
      <SupportContent />
    </ProtectedRoute>
  );
}

function SupportContent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState<'tickets' | 'faq' | 'contact'>('tickets');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // New ticket form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(clearAuth());
    router.push('/');
  };

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketCategory || !ticketDescription.trim()) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    showToast('Support ticket created successfully!', 'success');
    setShowNewTicketModal(false);
    setTicketSubject('');
    setTicketCategory('');
    setTicketDescription('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-amber-100 text-amber-800';
      case 'In Progress': return 'bg-primary-fixed text-primary';
      case 'Resolved': return 'bg-tertiary-fixed text-tertiary';
      case 'Closed': return 'bg-surface-container text-outline';
      default: return 'bg-surface-container text-outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-error';
      case 'Medium': return 'text-amber-600';
      case 'Low': return 'text-tertiary';
      default: return 'text-outline';
    }
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
            <h1 className="font-headline text-2xl text-primary">Support Center</h1>
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
          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: 'phone', label: 'Call Us', value: '+91 1800-123-4567', color: 'text-primary', bg: 'bg-primary-fixed' },
              { icon: 'email', label: 'Email Us', value: 'support@arogyanexa.com', color: 'text-tertiary', bg: 'bg-tertiary-fixed' },
              { icon: 'schedule', label: 'Support Hours', value: 'Mon-Sat: 9 AM - 6 PM', color: 'text-secondary', bg: 'bg-secondary-container' },
            ].map((contact) => (
              <div key={contact.label} className="card p-6">
                <div className={`w-12 h-12 rounded-full ${contact.bg} flex items-center justify-center mb-4`}>
                  <span className={`material-symbols-outlined ${contact.color}`}>{contact.icon}</span>
                </div>
                <p className="section-label text-[10px] mb-1">{contact.label}</p>
                <p className="font-semibold text-on-surface">{contact.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-outline-variant/20">
            {[
              { id: 'tickets', label: 'My Tickets', icon: 'confirmation_number' },
              { id: 'faq', label: 'FAQ', icon: 'help' },
              { id: 'contact', label: 'Contact Form', icon: 'mail' },
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
          {activeTab === 'tickets' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-on-surface-variant text-sm">View and manage your support tickets</p>
                <button 
                  onClick={() => setShowNewTicketModal(true)}
                  className="btn-primary text-sm"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  New Ticket
                </button>
              </div>

              <div className="space-y-4">
                {SUPPORT_TICKETS.map((ticket) => (
                  <div key={ticket.id} className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-on-surface">{ticket.subject}</h3>
                          <span className={cn('badge text-xs', getStatusColor(ticket.status))}>
                            {ticket.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">confirmation_number</span>
                            {ticket.id}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">category</span>
                            {ticket.category}
                          </span>
                          <span className={cn('flex items-center gap-1 font-medium', getPriorityColor(ticket.priority))}>
                            <span className="material-symbols-outlined text-sm">flag</span>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-outline">
                      <span>Created: {ticket.createdAt}</span>
                      <span>Last Update: {ticket.lastUpdate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, index) => (
                <div key={index} className="card overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors"
                  >
                    <span className="font-semibold text-on-surface pr-4">{faq.question}</span>
                    <span className={cn('material-symbols-outlined text-primary transition-transform', expandedFaq === index && 'rotate-180')}>
                      expand_more
                    </span>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6 text-sm text-on-surface-variant border-t border-outline-variant/10 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="card p-8 max-w-3xl">
              <h3 className="font-headline text-2xl text-primary mb-6">Send us a message</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="section-label text-[10px] block mb-2">Your Name</label>
                    <input
                      type="text"
                      defaultValue={`${user?.firstName} ${user?.lastName}`}
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
                </div>
                <div>
                  <label className="section-label text-[10px] block mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div>
                  <label className="section-label text-[10px] block mb-2">Message</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                    placeholder="Please provide detailed information about your inquiry..."
                  />
                </div>
                <button 
                  onClick={() => showToast('Message sent successfully!', 'success')}
                  className="btn-primary text-sm"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  Send Message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNewTicketModal(false)}
          />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
            <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
              <div>
                <h2 className="font-headline text-3xl text-primary">Create Support Ticket</h2>
                <p className="text-sm text-on-surface-variant mt-1">We'll get back to you within 24 hours</p>
              </div>
              <button 
                onClick={() => setShowNewTicketModal(false)}
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="section-label text-[10px] block mb-2">
                  Subject <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">
                  Category <span className="text-error">*</span>
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                >
                  <option value="">Select a category</option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Payment">Payment</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Product">Product</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="section-label text-[10px] block mb-2">
                  Description <span className="text-error">*</span>
                </label>
                <textarea
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="Please provide detailed information about your issue..."
                />
              </div>
            </div>

            <div className="px-8 py-6 border-t border-outline-variant/10 flex justify-end gap-3">
              <button 
                onClick={() => setShowNewTicketModal(false)}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitTicket}
                className="btn-primary text-sm"
              >
                <span className="material-symbols-outlined text-sm">confirmation_number</span>
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
