'use client';
import { useEffect, useRef, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { imageSelectors } from '@/lib/images';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Chronic Patient',
    rating: 5,
    text: 'ArogyaNexa has transformed how I manage my medications. The prescription upload is seamless and the pharmacist review gives me real confidence.',
    initials: 'PS',
  },
  {
    name: 'Dr. Rajesh Kumar',
    role: 'General Physician',
    rating: 5,
    text: 'I recommend ArogyaNexa to all my patients. The drug interaction warnings and clinical information are accurate and genuinely helpful.',
    initials: 'RK',
  },
  {
    name: 'Anita Patel',
    role: 'Caregiver',
    rating: 5,
    text: 'Managing medicines for my elderly parents used to be stressful. Now with ArogyaNexa, everything is organized, tracked, and delivered on time.',
    initials: 'AP',
  },
  {
    name: 'Vikram Singh',
    role: 'Fitness Enthusiast',
    rating: 5,
    text: 'The wellness section is incredible. Genuine supplements, great prices, and the AI assistant helped me understand what I actually need.',
    initials: 'VS',
  },
];

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Get profile images for testimonials
  const profileImages = imageSelectors.getProfileImages();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-surface-container-low">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="section-label">Patient Stories</span>
          <h2 className="font-headline text-4xl lg:text-5xl text-primary mt-3 mb-4 leading-tight">
            Trusted by
            <br />
            <span className="italic font-normal">Thousands</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => {
            // Use profile images, cycling through available ones
            const profileImage = profileImages[i % profileImages.length];
            
            return (
              <div
                key={t.name}
                className={`card p-6 flex flex-col gap-4 transition-all duration-700 hover:-translate-y-1 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <Quote size={24} className="text-primary-fixed" />
                <p className="text-sm text-on-surface-variant leading-relaxed flex-1 italic">"{t.text}"</p>
                <div className="flex items-center gap-1 mt-auto">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-surface-container-high">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-surface-container">
                    {profileImage ? (
                      <img
                        src={profileImage.src}
                        alt={profileImage.alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full clinical-gradient flex items-center justify-center text-white text-sm font-bold">
                        {t.initials}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{t.name}</p>
                    <p className="text-xs text-outline">{t.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
