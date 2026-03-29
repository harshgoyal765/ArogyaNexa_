'use client';
import { useEffect, useRef, useState } from 'react';
import { Shield, Zap, Clock, FileText, Truck, HeartPulse } from 'lucide-react';

const features = [
  {
    icon: <Shield size={28} />,
    title: 'Clinically Verified',
    description: 'Every product reviewed by board-certified pharmacists. Zero compromise on quality or safety.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: <Zap size={28} />,
    title: 'AI Health Assistant',
    description: 'Get instant answers on drug interactions, dosage, and side effects from our clinical AI.',
    color: 'bg-secondary-container/50 text-secondary',
  },
  {
    icon: <FileText size={28} />,
    title: 'Digital Prescriptions',
    description: 'Upload prescriptions digitally. Our pharmacists review and approve within minutes.',
    color: 'bg-tertiary-fixed/50 text-tertiary',
  },
  {
    icon: <Clock size={28} />,
    title: '24/7 Expert Support',
    description: 'Round-the-clock access to licensed pharmacists for any health query.',
    color: 'bg-primary-fixed/50 text-primary',
  },
  {
    icon: <Truck size={28} />,
    title: 'Express Delivery',
    description: 'Same-day delivery for urgent medications. Real-time tracking at every step.',
    color: 'bg-secondary-container/50 text-secondary',
  },
  {
    icon: <HeartPulse size={28} />,
    title: 'Wellness Programs',
    description: 'Personalized health plans, medication reminders, and wellness education hub.',
    color: 'bg-tertiary-fixed/50 text-tertiary',
  },
];

export default function FeaturesSection() {
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
    <section ref={ref} className="py-24 lg:py-32 bg-surface-container-low">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="section-label">Why ArogyaNexa</span>
          <h2 className="font-headline text-4xl lg:text-5xl text-primary mt-3 mb-4 leading-tight">
            ArogyaNexa
            <br />
            <span className="italic font-normal">Difference</span>
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            We reject the big-box pharmacy aesthetic. Every interaction is designed with precision, care, and clinical authority.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`card p-8 group hover:-translate-y-1 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color} transition-transform duration-300 group-hover:scale-110`}>
                {feature.icon}
              </div>
              <h3 className="font-headline text-xl font-semibold text-primary mb-3">{feature.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
