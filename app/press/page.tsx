import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const PRESS_ITEMS = [
  { outlet: 'Economic Times', date: 'October 2024', headline: 'ArogyaNexa raises Series A to expand clinical pharmacy network across India', tag: 'Funding' },
  { outlet: 'YourStory', date: 'August 2024', headline: 'How ArogyaNexa is redefining the online pharmacy experience with AI-powered clinical review', tag: 'Feature' },
  { outlet: 'Inc42', date: 'June 2024', headline: 'ArogyaNexa partners with 200+ hospitals for seamless prescription fulfilment', tag: 'Partnership' },
  { outlet: 'Mint', date: 'March 2024', headline: 'ArogyaNexa: The premium pharmacy brand disrupting India\'s ₹4 lakh crore pharma market', tag: 'Analysis' },
];

export default function PressPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-16 max-w-2xl">
          <span className="section-label text-[10px] text-secondary mb-4 block">Press & Media</span>
          <h1 className="font-headline text-5xl text-primary mb-6">ArogyaNexa in the news</h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            For press inquiries, interview requests, or media assets, contact our communications team.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {PRESS_ITEMS.map((item) => (
            <div key={item.headline} className="card p-8 hover:shadow-primary-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="font-headline text-lg text-primary">{item.outlet}</span>
                <span className="badge bg-surface-container text-on-surface-variant text-[10px]">{item.tag}</span>
              </div>
              <h3 className="text-on-surface font-medium leading-snug mb-3">{item.headline}</h3>
              <p className="section-label text-[10px]">{item.date}</p>
            </div>
          ))}
        </section>

        <section className="clinical-gradient text-white rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-headline text-2xl mb-2">Media Kit & Assets</h2>
            <p className="text-white/80 text-sm">Download logos, brand guidelines, and executive headshots.</p>
          </div>
          <a href="mailto:press@ArogyaNexa.com" className="bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-primary-fixed transition-colors flex-shrink-0">
            Contact Press Team
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
