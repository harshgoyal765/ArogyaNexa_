'use client';
import { useEffect, useRef, useState } from 'react';
import { Search, FileText, ShoppingCart, Truck } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: <Search size={24} />,
    title: 'Search & Discover',
    description: 'Browse 10,000+ medicines by name, category, or describe your symptoms to our AI assistant.',
  },
  {
    step: '02',
    icon: <FileText size={24} />,
    title: 'Upload Prescription',
    description: 'For Rx medicines, upload your prescription digitally. Our pharmacists review within minutes.',
  },
  {
    step: '03',
    icon: <ShoppingCart size={24} />,
    title: 'Secure Checkout',
    description: 'Add to cart, review drug interactions, and pay securely via Razorpay or Cash on Delivery.',
  },
  {
    step: '04',
    icon: <Truck size={24} />,
    title: 'Track & Receive',
    description: 'Real-time order tracking from our warehouse to your doorstep. Same-day delivery available.',
  },
];

export default function HowItWorksSection() {
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
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="section-label">Simple Process</span>
          <h2 className="font-headline text-4xl lg:text-5xl text-primary mt-3 mb-4 leading-tight">
            How It <span className="italic font-normal">Works</span>
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            From search to delivery in four seamless steps. Clinical precision, human simplicity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent" />

          {steps.map((step, i) => (
            <div
              key={step.step}
              className={`relative text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Step circle */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full clinical-gradient shadow-primary-md flex items-center justify-center text-white">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-surface-container-lowest border-2 border-primary rounded-full flex items-center justify-center text-xs font-bold text-primary">
                  {step.step}
                </span>
              </div>

              <h3 className="font-headline text-lg font-semibold text-primary mb-3">{step.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
