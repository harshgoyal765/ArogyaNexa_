import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const ROLES = [
  { dept: 'Engineering', title: 'Senior Full-Stack Engineer', location: 'Mumbai / Remote', type: 'Full-time' },
  { dept: 'Clinical', title: 'Clinical Pharmacist (Review)', location: 'Bengaluru', type: 'Full-time' },
  { dept: 'Design', title: 'Product Designer', location: 'Remote', type: 'Full-time' },
  { dept: 'Operations', title: 'Logistics Coordinator', location: 'Delhi', type: 'Full-time' },
  { dept: 'Engineering', title: 'DevOps / Cloud Engineer', location: 'Remote', type: 'Contract' },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-16 max-w-2xl">
          <span className="section-label text-[10px] text-secondary mb-4 block">Careers</span>
          <h1 className="font-headline text-5xl text-primary mb-6">Build the future of healthcare with us</h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            We are a team of engineers, pharmacists, designers, and operators united by a mission to make clinical-grade healthcare accessible to everyone.
          </p>
        </section>

        <section className="space-y-4 mb-16">
          {ROLES.map((role) => (
            <div key={role.title} className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-primary-md transition-shadow">
              <div>
                <span className="badge bg-primary-fixed text-primary text-[10px] mb-2 inline-block">{role.dept}</span>
                <h3 className="font-headline text-xl text-primary">{role.title}</h3>
                <p className="text-sm text-on-surface-variant mt-1">{role.location} · {role.type}</p>
              </div>
              <Link href="/contact" className="btn-primary text-sm flex-shrink-0">Apply Now</Link>
            </div>
          ))}
        </section>

        <section className="bg-surface-container-low rounded-2xl p-12 text-center">
          <h2 className="font-headline text-3xl text-primary mb-4">Don&apos;t see your role?</h2>
          <p className="text-on-surface-variant mb-6">Send us your resume and we will reach out when the right opportunity opens up.</p>
          <Link href="/contact" className="btn-secondary">Get in Touch</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
