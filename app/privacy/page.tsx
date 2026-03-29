import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const SECTIONS = [
  { title: 'Information We Collect', content: 'We collect information you provide directly (name, email, phone, address, prescription data) and information generated through your use of our services (order history, browsing behavior, device information).' },
  { title: 'How We Use Your Information', content: 'Your information is used to process orders, verify prescriptions, provide clinical support, improve our services, and comply with pharmaceutical regulations. We never sell your personal data to third parties.' },
  { title: 'Prescription Data', content: 'Prescription data is handled with the highest level of confidentiality in compliance with applicable pharmaceutical laws. Access is restricted to licensed pharmacists and authorized clinical staff only.' },
  { title: 'Data Security', content: 'We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. Our infrastructure is HIPAA-compliant and undergoes regular third-party security audits.' },
  { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time. Contact our Data Protection Officer at privacy@ArogyaNexa.com to exercise these rights.' },
  { title: 'Cookies', content: 'We use essential cookies for authentication and session management, and optional analytics cookies to improve user experience. You can manage cookie preferences in your browser settings.' },
  { title: 'Contact', content: 'For privacy-related queries, contact our Data Protection Officer at privacy@ArogyaNexa.com or write to: ArogyaNexa, Privacy Team, Mumbai, India.' },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="section-label text-[10px] text-secondary mb-4 block">Legal</span>
          <h1 className="font-headline text-5xl text-primary mb-4">Privacy Policy</h1>
          <p className="text-on-surface-variant">Last updated: January 1, 2025</p>
        </div>
        <div className="prose max-w-none space-y-8">
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
