import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-16 text-center max-w-3xl mx-auto">
          <span className="section-label text-[10px] text-secondary mb-4 block">Our Story</span>
          <h1 className="font-headline text-5xl text-primary mb-6">Bridging clinical precision with human wellness</h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            ArogyaNexa was founded on a simple belief — that every person deserves access to pharmaceutical-grade care, expert guidance, and transparent health information.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: 'verified', title: 'Board-Certified Pharmacists', desc: 'Every prescription reviewed by licensed clinical pharmacists before dispensing.' },
            { icon: 'security', title: 'HIPAA Compliant', desc: 'Your health data is protected with enterprise-grade encryption and strict access controls.' },
            { icon: 'local_shipping', title: 'Cold-Chain Logistics', desc: 'Temperature-sensitive medications shipped with precision monitoring end-to-end.' },
          ].map((item) => (
            <div key={item.title} className="card p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-primary mb-4 block">{item.icon}</span>
              <h3 className="font-headline text-xl text-primary mb-3">{item.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="clinical-gradient text-white rounded-2xl p-12 text-center">
          <h2 className="font-headline text-4xl mb-4">Join our mission</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">We are always looking for passionate people to help us build the future of healthcare.</p>
          <Link href="/careers" className="bg-white text-primary font-semibold px-8 py-3 rounded-xl hover:bg-primary-fixed transition-colors inline-block">
            View Open Roles
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
