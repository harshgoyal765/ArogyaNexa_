'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Shield } from 'lucide-react';
import { imageSelectors } from '@/lib/images';

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Get background image
  const backgroundImage = imageSelectors.getCrystallineBackground();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-surface">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative overflow-hidden rounded-3xl clinical-gradient p-12 lg:p-20 text-center transition-all duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          {/* Background image */}
          {backgroundImage && (
            <div 
              className="absolute inset-0 opacity-10"
              style={{ 
                backgroundImage: `url(${backgroundImage.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          )}
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-8 left-8 opacity-10">
              <span className="material-symbols-outlined text-[120px] text-white">medication</span>
            </div>
            <div className="absolute bottom-8 right-8 opacity-10">
              <span className="material-symbols-outlined text-[80px] text-white">health_and_safety</span>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
              <Shield size={14} className="text-white" />
              <span className="text-xs font-label uppercase tracking-[0.15em] text-white/90">Licensed & Verified</span>
            </div>

            <h2 className="font-headline text-4xl lg:text-5xl text-white leading-tight">
              Start Your Clinical
              <br />
              <span className="italic font-normal opacity-90">Wellness Journey</span>
            </h2>

            <p className="text-white/80 text-lg leading-relaxed">
              Join thousands of patients who trust ArogyaNexa for their healthcare needs. Sign up free and get ₹100 off your first order.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/register"
                className="flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-md font-semibold hover:bg-primary-fixed transition-colors shadow-lg"
              >
                Create Free Account <ArrowRight size={18} />
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-2 border border-white/30 text-white px-8 py-4 rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                Browse Medicines
              </Link>
            </div>

            <p className="text-white/50 text-xs">No credit card required. Free to browse.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
