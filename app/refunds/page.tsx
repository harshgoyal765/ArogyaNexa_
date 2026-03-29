import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const ELIGIBLE = [
  'Wrong medication delivered',
  'Damaged or tampered packaging',
  'Order not delivered within 7 business days',
  'Expired product delivered',
  'Duplicate charge on your account',
];

const NOT_ELIGIBLE = [
  'Opened or partially used medications',
  'Prescription medications once dispensed (regulatory requirement)',
  'Orders cancelled after dispatch',
  'Products damaged due to improper storage by customer',
];

export default function RefundsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="section-label text-[10px] text-secondary mb-4 block">Legal</span>
          <h1 className="font-headline text-5xl text-primary mb-4">Refund Policy</h1>
          <p className="text-on-surface-variant">Last updated: January 1, 2025</p>
        </div>

        <div className="space-y-8">
          <div className="card p-8">
            <h2 className="font-headline text-2xl text-primary mb-4">Refund Window</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Refund requests must be raised within <strong className="text-on-surface">48 hours</strong> of delivery for damaged or incorrect items, and within <strong className="text-on-surface">7 days</strong> for non-delivery claims. Refunds are processed within 5–7 business days to the original payment method.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-tertiary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <h2 className="font-headline text-xl text-primary">Eligible for Refund</h2>
              </div>
              <ul className="space-y-3">
                {ELIGIBLE.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-on-surface-variant">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-error text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                <h2 className="font-headline text-xl text-primary">Not Eligible</h2>
              </div>
              <ul className="space-y-3">
                {NOT_ELIGIBLE.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-on-surface-variant">
                    <span className="w-1.5 h-1.5 rounded-full bg-error mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="font-headline text-2xl text-primary mb-4">How to Request a Refund</h2>
            <ol className="space-y-4">
              {[
                'Log in to your account and go to Orders.',
                'Select the order and click "Report an Issue".',
                'Choose the reason and upload supporting photos if applicable.',
                'Our team will review within 24 hours and initiate the refund.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4 text-sm text-on-surface-variant">
                  <span className="w-7 h-7 rounded-full clinical-gradient text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-8 flex gap-4">
              <Link href="/orders" className="btn-primary">Go to My Orders</Link>
              <Link href="/contact" className="btn-secondary">Contact Support</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
