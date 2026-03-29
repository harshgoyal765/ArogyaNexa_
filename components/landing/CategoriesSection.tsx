'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const categories = [
  { icon: 'cardiology', label: 'Cardiology', query: 'cardiology' },
  { icon: 'neurology', label: 'Neurology', query: 'neurology' },
  { icon: 'dermatology', label: 'Skin Care', query: 'dermatology' },
  { icon: 'medication', label: 'General', query: 'general' },
  { icon: 'psychology', label: 'Mental Health', query: 'mental health' },
  { icon: 'vaccines', label: 'Immunity', query: 'immunity' },
  { icon: 'child_care', label: 'Baby Care', query: 'baby care' },
  { icon: 'monitor_heart', label: 'Devices', query: 'devices' },
];

export default function CategoriesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-surface">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-end justify-between mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <span className="section-label">Browse by</span>
            <h2 className="font-headline text-4xl lg:text-5xl text-primary mt-2 leading-tight">
              Clinical
              <br />
              <span className="italic font-normal">Specializations</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary border-b-2 border-primary-container pb-1 hover:border-primary transition-colors"
          >
            View All
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.label}
              href={`/products?keyword=${cat.query}`}
              className={`group cursor-pointer transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="bg-surface-container-low rounded-2xl aspect-square flex flex-col items-center justify-center gap-3 group-hover:bg-primary-fixed transition-all duration-300 p-4">
                <div className="p-3 bg-surface-container-lowest rounded-xl shadow-primary-sm group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-primary text-2xl">{cat.icon}</span>
                </div>
                <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant group-hover:text-primary text-center leading-tight transition-colors">
                  {cat.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
