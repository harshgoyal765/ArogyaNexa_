import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

// Static article data — in production this would come from a CMS/API
const ARTICLE = {
  title: 'The Neurobiology of Cortisol: Strategic Management of Modern Stress',
  category: 'CLINICAL REVIEW',
  readTime: '12 MIN READ',
  author: 'Dr. Elena Sterling, PharmD',
  authorRole: 'Board-Certified Clinical Pharmacist',
  date: 'May 24, 2024',
  keyTakeaways: [
    'Cortisol follows a diurnal rhythm, peaking in the morning to facilitate alertness.',
    'Chronic elevation can lead to metabolic dysregulation and immune suppression.',
    'Evidence-based interventions include specific micronutrients and sleep hygiene.',
  ],
  relatedProducts: [
    { name: 'Adrenal Harmony Complex', category: 'STRESS SUPPORT', price: '₹3,500' },
    { name: 'Deep Rest Botanicals', category: 'EVENING RITUAL', price: '₹2,300' },
  ],
};

export default function ArticleDetailPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 bg-surface">
        {/* Hero Header */}
        <header className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden mb-12 bg-gradient-to-br from-primary to-primary-container">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="material-symbols-outlined text-[200px] text-white">biotech</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge bg-tertiary text-white text-[10px]">{ARTICLE.category}</span>
                <span className="text-sm font-medium opacity-90">{ARTICLE.readTime}</span>
              </div>
              <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight max-w-4xl">
                {ARTICLE.title}
              </h1>
            </div>
          </div>

          {/* Author + Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-outline-variant/30 pb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full clinical-gradient flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                ES
              </div>
              <div>
                <div className="font-semibold text-primary font-headline text-lg">{ARTICLE.author}</div>
                <div className="text-sm text-on-surface-variant">{ARTICLE.authorRole} • {ARTICLE.date}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-surface-container-low hover:bg-surface-container transition-all text-sm font-medium">
                <span className="material-symbols-outlined text-sm">ios_share</span> Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-surface-container-low hover:bg-surface-container transition-all text-sm font-medium">
                <span className="material-symbols-outlined text-sm">print</span> Print for Doctor
              </button>
            </div>
          </div>
        </header>

        {/* Article Content + Sidebar */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">
          {/* Article Body */}
          <article className="space-y-8 text-on-surface-variant leading-relaxed">
            {/* Key Takeaways */}
            <div className="bg-secondary-container/20 p-8 rounded-xl border-l-4 border-secondary">
              <h3 className="font-headline text-2xl font-bold mb-4 text-secondary">Key Takeaways</h3>
              <ul className="space-y-4">
                {ARTICLE.keyTakeaways.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary mt-0.5 flex-shrink-0">check_circle</span>
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-lg">
              Stress is often discussed as a psychological phenomenon, yet its foundations are strictly biological. At the center of this mechanism is cortisol, a steroid hormone produced by the adrenal glands. While vital for survival, the persistent activation of the Hypothalamic-Pituitary-Adrenal (HPA) axis in contemporary life has led to a clinical epidemic of cortisol dysregulation.
            </p>

            <h2 className="font-headline text-3xl font-bold text-primary">The Mechanism of Action</h2>
            <p>
              Cortisol acts on nearly every organ in the body. It regulates blood glucose, modulates the inflammatory response, and influences cognitive function. In a healthy state, cortisol levels are high upon waking—known as the Cortisol Awakening Response (CAR)—and gradually decline throughout the day to allow for melatonin synthesis in the evening.
            </p>

            <blockquote className="my-10 py-8 px-10 border-l-2 border-primary bg-surface-container-low/50 italic font-headline text-2xl text-primary leading-relaxed rounded-r-xl">
              &ldquo;The transition from acute adaptive stress to chronic maladaptive stress represents the most significant physiological challenge of the 21st century.&rdquo;
            </blockquote>

            <h2 className="font-headline text-3xl font-bold text-primary">Clinical Indicators of Dysregulation</h2>
            <p>
              Identifying cortisol imbalance requires a nuanced understanding of biomarkers. Symptoms often present as &ldquo;tired but wired&rdquo; sensations, abdominal adiposity, and delayed muscle recovery. From a clinical perspective, we look for shifts in the diurnal curve through salivary or urinary testing over a 24-hour period.
            </p>

            {/* Inline visual */}
            <div className="my-10 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 aspect-video relative flex items-center justify-center">
              <div className="glass-card p-6 rounded-lg text-center border border-white/20">
                <span className="block section-label text-[10px] text-primary mb-2">Internal Visualization</span>
                <span className="font-headline text-xl font-bold text-on-surface">The Diurnal Cortisol Rhythm</span>
              </div>
            </div>

            <h2 className="font-headline text-3xl font-bold text-primary">Evidence-Based Management</h2>
            <p>
              Management of HPA-axis dysfunction requires a multi-modal approach. Pharmacological grade supplements, such as Phosphatidylserine and Ashwagandha, have shown statistical significance in dampening excessive cortisol response during double-blind clinical trials.
            </p>

            {/* Citations */}
            <div className="mt-12 pt-8 border-t border-outline-variant/30 text-xs text-outline space-y-2">
              <p>[1] Smith, J. et al. (2023). &ldquo;Biomarkers of Chronic Stress in Modern Environments.&rdquo; Journal of Clinical Endocrinology.</p>
              <p>[2] Miller, R. (2022). &ldquo;Adaptogenic Efficacy in Cortisol Regulation: A Meta-Analysis.&rdquo; Pharmacological Research Monthly.</p>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-10">
            {/* Related Products */}
            <div>
              <h4 className="font-headline text-xl font-bold mb-6 text-primary">Related Solutions</h4>
              <div className="space-y-5">
                {ARTICLE.relatedProducts.map((product) => (
                  <div key={product.name} className="group card p-4 hover:shadow-primary-md transition-all">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-surface-container to-surface-container-high overflow-hidden mb-4 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-outline-variant group-hover:scale-110 transition-transform duration-500">medication</span>
                    </div>
                    <div className="section-label text-[10px] text-secondary mb-1">{product.category}</div>
                    <h5 className="font-headline font-bold text-on-surface mb-2">{product.name}</h5>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold">{product.price}</span>
                      <Link href="/products" className="w-8 h-8 rounded-full clinical-gradient text-white flex items-center justify-center active:scale-90 transition-transform">
                        <span className="material-symbols-outlined text-sm">add</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="clinical-gradient p-6 rounded-xl text-white">
              <span className="material-symbols-outlined mb-4 text-3xl block">medical_services</span>
              <h4 className="font-headline text-xl font-bold mb-2">Get Clinical Insights</h4>
              <p className="text-sm text-white/80 mb-5">Receive expert-vetted wellness reports directly to your inbox every Tuesday.</p>
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/10 border border-white/20 rounded-md py-2 px-4 mb-3 text-sm placeholder:text-white/40 focus:ring-secondary outline-none text-white"
              />
              <button className="w-full bg-white text-primary font-bold py-2 rounded-md text-sm hover:bg-primary-fixed transition-all">
                Subscribe Now
              </button>
            </div>
          </aside>
        </div>

        {/* Consultation Banner */}
        <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="bg-surface-container-low rounded-2xl p-12 flex flex-col md:flex-row items-center gap-12 border border-outline-variant/10">
            <div className="flex-1">
              <h2 className="font-headline text-4xl font-bold text-primary mb-4">Unsure where to start?</h2>
              <p className="text-on-surface-variant text-lg mb-8 max-w-xl">
                Our clinical team provides personalized consultations to help you navigate hormonal health and wellness protocols tailored to your unique biology.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/ai-assistant" className="btn-primary">Book Clinical Consultation</Link>
                <Link href="/wellness" className="btn-secondary">Explore All Services</Link>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[80px] text-primary/30">health_and_safety</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
