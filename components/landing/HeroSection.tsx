'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  // Use the exact same images from weshopify reference
  const backgroundImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuC6Z6PUVHl7uusGgGT_lgr-LyoYmuHTlBaRXE3EyciDDUxstfP7kdTmQpmoMhzXlLO8d7FWWmjYFX93Q462sb5Fb8YkKbjpBeEK7OfibRpOLdWap-z-LKetumCQSEmWwMtG_csDgt3dww3HUIOrBlSRKYtsO1FgFKtS7h1S14wOu6KlLiQ5ImpmaEpZgzjaQnupXE4jogXyQcGbE32abWUtqEj63hjzFUER0eHeJ8z0alxpKIeT4KzsZpcRQaSEZ-yBOMeYBGEQ6Yk";
  const heroImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAf3SiPsnivzkBCzEXMpwmkNzF0-jUbdH6CjcEyRbVRkPVt3F-En6WFgJWcpIIiC8aHqrD9EI4AFmGfNjAmDa3c-VWSVYnAW6oBRUKxUMEFPGH_h006TjLJZMDhm-yZNZJlGiYZTajtcDyH1AP2_-xtQTD_IM7nGk7QjzgQ-x57nQHzgSZN3evh3CRjnRHDC6Z0YVcEa_BOTye9KfaOfXgoD2jPHl1vzPFVfgIGvNuG5sPe-704YNjnDVY3tdQcraDGK9kUbEprPQw";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden bg-surface">
      {/* Background Layer: Editorial Aesthetic */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-20 pointer-events-none">
          <img 
            className="w-full h-full object-cover" 
            alt="Close-up of high-end glass apothecary bottles and medical laboratory equipment in a bright, clean, minimalist studio setting with soft natural light"
            src={backgroundImage}
          />
        </div>
        <div className="absolute bottom-[-10%] left-[-5%] w-1/3 h-2/3 bg-primary-container/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Content Canvas */}
      <div className="relative z-10 w-full max-w-[1440px] flex flex-col md:flex-row items-center gap-12 lg:gap-24">
        {/* Left Column: Typography & Messaging */}
        <div className={`w-full md:w-3/5 space-y-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-secondary-container/30 text-secondary font-label text-[0.7rem] uppercase tracking-[0.15em] font-bold">
            <span className="material-symbols-outlined text-[1rem]">science</span>
            ArogyaNexa Excellence
          </div>

          <div className="space-y-4">
            <h1 className="font-headline italic text-5xl lg:text-8xl text-primary leading-[1.1] tracking-tight">
              ArogyaNexa: <br/>
              <span className="font-medium not-italic text-on-surface">Elevating the Modern Apothecary</span>
            </h1>
            <p className="text-on-surface-variant text-xl lg:text-2xl max-w-xl font-light leading-relaxed">
              A premium pharmacy platform bridging the gap between clinical precision and human wellness.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-6 pt-4">
            <Link
              href="/register"
              className="clinical-gradient text-on-primary px-8 py-4 rounded-md font-medium tracking-wide shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all flex items-center gap-3 group"
            >
              Explore the Ecosystem
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
            <Link
              href="/wellness"
              className="bg-transparent border border-outline-variant/30 text-primary px-8 py-4 rounded-md font-medium hover:bg-surface-container-low transition-colors"
            >
              View Case Studies
            </Link>
          </div>

          {/* Stats grid - matching weshopify reference */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 pt-12 border-t border-outline-variant/15">
            <div>
              <div className="text-3xl font-headline text-primary">01 / 99</div>
              <div className="text-[0.7rem] uppercase tracking-widest text-outline mt-1">Digital Apothecary</div>
            </div>
            <div>
              <div className="text-3xl font-headline text-primary">Precision</div>
              <div className="text-[0.7rem] uppercase tracking-widest text-outline mt-1">Quality Guaranteed</div>
            </div>
            <div className="hidden lg:block">
              <div className="text-3xl font-headline text-primary">24/7</div>
              <div className="text-[0.7rem] uppercase tracking-widest text-outline mt-1">Expert Support</div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Component */}
        <div className={`w-full md:w-2/5 relative flex justify-center items-center transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-2xl transform rotate-1 md:rotate-2 hover:rotate-0 transition-transform duration-700 group">
            <img 
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" 
              alt="Ultra high-definition close up of premium pharmaceutical packaging with minimalist labels and elegant blue typography on a white textured background"
              src={heroImage}
            />
            
            {/* Floating UI Element (Glassmorphism) */}
            <div className="absolute bottom-8 left-8 right-8 glass-effect p-6 rounded-xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">verified</span>
                </div>
                <div>
                  <h4 className="font-headline text-lg font-medium text-primary">Clinically Verified</h4>
                  <p className="text-xs text-on-surface-variant font-body">Every solution vetted by our board-certified pharmacists.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-5 h-8 border-2 border-outline-variant rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-outline rounded-full" />
        </div>
      </div>
    </section>
  );
}
