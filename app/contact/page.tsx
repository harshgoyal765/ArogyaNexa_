'use client';
import { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { showToast, ToastContainer } from '@/components/ui/Toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Replace with: POST /api/v1/contact
    await new Promise((r) => setTimeout(r, 800));
    showToast('Message sent! We will get back to you within 24 hours.', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <section>
            <span className="section-label text-[10px] text-secondary mb-4 block">Contact Us</span>
            <h1 className="font-headline text-5xl text-primary mb-6">We are here to help</h1>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
              Have a question about your order, prescription, or our services? Our clinical support team is available 24/7.
            </p>
            <div className="space-y-6">
              {[
                { icon: 'support_agent', title: '24/7 Clinical Support', detail: 'support@ArogyaNexa.com' },
                { icon: 'local_pharmacy', title: 'Pharmacist Helpline', detail: '+91 1800-XXX-XXXX (Toll Free)' },
                { icon: 'business', title: 'Corporate & B2B', detail: 'enterprise@ArogyaNexa.com' },
              ].map((c) => (
                <div key={c.title} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed/30 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">{c.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-on-surface text-sm">{c.title}</p>
                    <p className="text-on-surface-variant text-sm">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-8">
            <h2 className="font-headline text-2xl text-primary mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Email</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Subject</label>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" required>
                  <option value="">Select a topic</option>
                  <option>Order Issue</option>
                  <option>Prescription Query</option>
                  <option>Refund Request</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Message</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" placeholder="Describe your issue or question..." />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full justify-center py-3">
                {sending ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Send Message'}
              </button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
}
