import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const SECTIONS = [
  { title: 'Acceptance of Terms', content: 'By accessing or using ArogyaNexa, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.' },
  { title: 'Eligibility', content: 'You must be at least 18 years old to use our services. Prescription medications may only be purchased with a valid prescription from a licensed medical practitioner.' },
  { title: 'Prescription Policy', content: 'All Schedule H and H1 medications require a valid prescription. Prescriptions are verified by our licensed pharmacists before dispensing. Submitting fraudulent prescriptions is a criminal offence.' },
  { title: 'Orders & Payments', content: 'Orders are confirmed only after prescription verification (where applicable) and successful payment. We reserve the right to cancel orders that cannot be fulfilled due to stock unavailability or regulatory restrictions.' },
  { title: 'Returns & Refunds', content: 'Medications cannot be returned once dispensed due to safety regulations. Refunds are issued for damaged, incorrect, or undelivered orders. See our Refund Policy for full details.' },
  { title: 'Limitation of Liability', content: 'ArogyaNexa is not liable for adverse reactions to medications taken as prescribed. Always consult your healthcare provider before starting, stopping, or changing any medication.' },
  { title: 'Governing Law', content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.' },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="section-label text-[10px] text-secondary mb-4 block">Legal</span>
          <h1 className="font-headline text-5xl text-primary mb-4">Terms of Service</h1>
          <p className="text-on-surface-variant">Last updated: January 1, 2025</p>
        </div>
        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title} className="card p-8">
              <h2 className="font-headline text-2xl text-primary mb-4">{s.title}</h2>
              <p className="text-on-surface-variant leading-relaxed">{s.content}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
