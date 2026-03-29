import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const CERTIFICATIONS = [
  { icon: 'verified', title: 'CDSCO Licensed', desc: 'Registered with the Central Drugs Standard Control Organisation under the Drugs and Cosmetics Act, 1940.' },
  { icon: 'security', title: 'HIPAA Compliant', desc: 'Patient data handled in accordance with international healthcare privacy standards.' },
  { icon: 'local_pharmacy', title: 'Board-Certified Pharmacists', desc: 'Every order reviewed by pharmacists registered with the Pharmacy Council of India.' },
  { icon: 'thermostat', title: 'Cold-Chain Certified', desc: 'Temperature-sensitive medications shipped with WHO-compliant cold-chain logistics.' },
  { icon: 'gpp_good', title: 'Good Pharmacy Practice', desc: 'Operations audited annually against WHO Good Pharmacy Practice guidelines.' },
  { icon: 'lock', title: 'ISO 27001 Certified', desc: 'Information security management system certified to international standards.' },
];

export default function VerifiedPharmacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-16 text-center max-w-3xl mx-auto">
          <div className="w-20 h-20 rounded-full clinical-gradient flex items-center justify-center mx-auto mb-6 shadow-primary-lg">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
          <span className="section-label text-[10px] text-secondary mb-4 block">Trust & Compliance</span>
          <h1 className="font-headline text-5xl text-primary mb-6">Verified Pharmacy</h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            ArogyaNexa operates under the strictest pharmaceutical regulations. Every license, certification, and audit is publicly verifiable.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {CERTIFICATIONS.map((cert) => (
            <div key={cert.title} className="card p-8">
              <span className="material-symbols-outlined text-3xl text-primary mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>{cert.icon}</span>
              <h3 className="font-headline text-xl text-primary mb-3">{cert.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{cert.desc}</p>
            </div>
          ))}
        </section>

        <section className="bg-surface-container-low rounded-2xl p-10 text-center">
          <h2 className="font-headline text-3xl text-primary mb-4">Have a compliance question?</h2>
          <p className="text-on-surface-variant mb-6">Our regulatory team is available to answer questions from patients, healthcare providers, and partners.</p>
          <Link href="/contact" className="btn-primary">Contact Compliance Team</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
