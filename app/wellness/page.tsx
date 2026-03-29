'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { articlesService, type ArticleItem } from '@/lib/services/articles.service';
import { imageSelectors, getImagesByCategory } from '@/lib/images';

// Source: stitch/stitch/wellness_education_hub/code.html
// Replace with: GET /api/v1/articles?page=0&size=6 when CMS API is ready

const DEFAULT_RESEARCH_ARTICLES: ArticleItem[] = [];

const LIFESTYLE_CARDS = [
  { bg: 'bg-primary text-white', icon: 'psychology', title: 'Mental Resilience', desc: 'Micro-practices for cognitive decompression in high-stress clinical environments.' },
  { bg: 'bg-tertiary text-white', icon: 'fitness_center', title: 'Longevity Protocols', desc: 'High-intensity intervals vs. steady-state: What the latest longevity data suggests.' },
];

export default function WellnessPage() {
  const [researchArticles, setResearchArticles] = useState<ArticleItem[]>(DEFAULT_RESEARCH_ARTICLES);
  const [loading, setLoading] = useState(true);

  // Get images for the page
  const heroImage = imageSelectors.getHeroImage();
  const researchImages = imageSelectors.getResearchImages();
  const wellnessImages = imageSelectors.getWellnessImages();

  useEffect(() => {
    articlesService
      .list({ page: 0, size: 6 })
      .then(({ data }) => setResearchArticles(data.data.content.slice(0, 3)))
      .catch(() => setResearchArticles(DEFAULT_RESEARCH_ARTICLES))
      .finally(() => setLoading(false));
  }, []);

  const articles = researchArticles;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Featured Article */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-surface-container-lowest rounded-xl overflow-hidden shadow-primary-sm">
            <div className="lg:col-span-7 relative h-[400px] lg:h-[560px] bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
              <div className="text-center text-white/20">
                <span className="material-symbols-outlined text-[120px]">biotech</span>
              </div>
              {heroImage && (
                <img 
                  className="absolute inset-0 w-full h-full object-cover" 
                  alt={heroImage.alt} 
                  src={heroImage.src} 
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            <div className="lg:col-span-5 p-12 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <span className="badge bg-secondary-container text-on-secondary-container">Featured Research</span>
                <span className="text-on-surface-variant text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span> 12 min read
                </span>
              </div>
              <h1 className="font-headline text-4xl lg:text-5xl text-primary leading-tight mb-6">
                The Future of Precision Medicine in Cardiac Care
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                Exploring how clinical genomics and personalized lifestyle data are reshaping our approach to cardiovascular health and long-term wellness.
              </p>
              <div className="flex items-center gap-4 mb-8 border-l-2 border-tertiary pl-4">
                <div>
                  <span className="text-sm font-bold text-on-surface block">Dr. Helena Vance</span>
                  <span className="text-xs text-on-surface-variant">Chief Medical Officer, ArogyaNexa</span>
                </div>
                <div className="ml-auto badge bg-tertiary-fixed text-on-tertiary-fixed text-[9px]">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Expert Verified
                </div>
              </div>
              <Link href="/wellness/cardiac-precision-medicine" className="btn-primary w-fit">Read Full Analysis</Link>
            </div>
          </div>
        </section>

        {/* Latest Research */}
        <section className="mb-24">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <h2 className="font-headline text-3xl text-primary">Latest Research</h2>
              <div className="h-1 w-12 bg-tertiary-container rounded-full" />
            </div>
            <Link href="/wellness" className="text-primary font-medium flex items-center gap-2 hover:gap-3 transition-all text-sm">
              Browse all findings <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article, index) => {
              // Cycle through research images for each article
              const articleImage = researchImages[index % researchImages.length];
              
              return (
                <div key={article.title} className="group cursor-pointer">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-surface-container to-surface-container-high">
                    {articleImage ? (
                      <img 
                        src={articleImage.src} 
                        alt={articleImage.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-outline-variant group-hover:scale-110 transition-transform duration-700">science</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 badge bg-white/90 text-primary text-[10px] uppercase tracking-widest">{article.category}</div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-3 uppercase tracking-tighter">
                    <span>{article.date}</span>
                    <span className="w-1 h-1 bg-outline-variant rounded-full" />
                    <span>{article.readTime}</span>
                  </div>
                  <Link href={`/wellness/${article.slug}`} className="font-headline text-xl text-primary mb-3 leading-snug group-hover:text-primary-container transition-colors block">{article.title}</Link>
                  <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2 mb-4">{article.excerpt}</p>
                  <span className="text-[10px] font-bold text-on-tertiary-fixed-variant flex items-center gap-1 uppercase">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified Research
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Lifestyle Guides Bento */}
        <section className="bg-surface-container-low -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-20 rounded-3xl mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-headline text-4xl text-primary mb-4">Curated Lifestyle Guides</h2>
            <p className="text-on-surface-variant">Actionable health intelligence curated by our board of clinical experts.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:h-[500px]">
            {/* Large card */}
            <div className="md:col-span-2 md:row-span-2 bg-surface-container-lowest rounded-2xl overflow-hidden p-8 flex flex-col justify-end relative group cursor-pointer shadow-primary-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/30 to-surface-container-high" />
              {wellnessImages[0] && (
                <img 
                  src={wellnessImages[0].src} 
                  alt={wellnessImages[0].alt}
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <span className="material-symbols-outlined text-[200px] text-primary">bedtime</span>
              </div>
              <div className="relative z-10">
                <span className="section-label text-[10px] text-primary mb-4 block">Holistic Foundations</span>
                <h3 className="font-headline text-3xl text-primary mb-4">The Circadian Blueprint: Optimizing Sleep Hygiene</h3>
                <p className="text-on-surface-variant mb-6 max-w-md text-sm">How light temperature and thermal regulation determine your cellular recovery cycles.</p>
                <Link href="/wellness/sleep-hygiene" className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest border-b border-primary/20 pb-1 w-fit">
                  Start Guide <span className="material-symbols-outlined text-lg">north_east</span>
                </Link>
              </div>
            </div>

            {/* Side card 1 */}
            <div className="md:col-span-2 bg-surface-container-lowest rounded-2xl overflow-hidden p-8 flex items-center gap-8 shadow-primary-sm group cursor-pointer relative">
              {wellnessImages[1] && (
                <img 
                  src={wellnessImages[1].src} 
                  alt={wellnessImages[1].alt}
                  className="absolute inset-0 w-full h-full object-cover opacity-10"
                />
              )}
              <div className="w-24 h-24 rounded-xl bg-surface-container-low flex items-center justify-center flex-shrink-0 relative z-10">
                <span className="material-symbols-outlined text-4xl text-secondary">restaurant</span>
              </div>
              <div className="relative z-10">
                <span className="section-label text-[10px] text-secondary mb-2 block">Nutrition</span>
                <h3 className="font-headline text-xl text-primary mb-2">Anti-Inflammatory Kitchen Staples</h3>
                <p className="text-on-surface-variant text-sm line-clamp-2">The essential pantry audit for long-term metabolic health and lowered systemic inflammation.</p>
              </div>
            </div>

            {LIFESTYLE_CARDS.map((card) => (
              <div key={card.title} className={`md:col-span-1 ${card.bg} rounded-2xl p-8 flex flex-col justify-between shadow-primary-md group cursor-pointer`}>
                <span className="material-symbols-outlined text-4xl opacity-80">{card.icon}</span>
                <div>
                  <h3 className="font-headline text-xl mb-2">{card.title}</h3>
                  <p className="text-xs leading-relaxed opacity-80">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section>
          <div className="bg-surface-container-high rounded-3xl p-12 lg:p-20 text-center">
            <span className="material-symbols-outlined text-5xl text-primary mb-6 block">biotech</span>
            <h2 className="font-headline text-4xl text-primary mb-6">Stay informed with ArogyaNexa</h2>
            <p className="text-on-surface-variant text-lg mb-10 max-w-xl mx-auto">Bi-weekly clinical digests, expert roundtables, and the latest in pharmaceutical innovations.</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="professional@medical.com" className="input-field flex-1" />
              <button type="submit" className="btn-primary justify-center">Join Hub</button>
            </form>
            <p className="mt-6 section-label text-[10px]">We respect your privacy. No marketing, only science.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
