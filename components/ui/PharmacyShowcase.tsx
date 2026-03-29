'use client';
import { imageSelectors } from '@/lib/images';

interface PharmacyShowcaseProps {
  title?: string;
  description?: string;
  className?: string;
  variant?: 'hero' | 'section' | 'background';
}

export default function PharmacyShowcase({ 
  title = "Clinical Excellence", 
  description = "State-of-the-art pharmaceutical facilities designed for precision and safety.",
  className = '',
  variant = 'section'
}: PharmacyShowcaseProps) {
  const pharmacyImage = imageSelectors.getPharmacyImage();
  const backgroundImage = imageSelectors.getCrystallineBackground();

  if (variant === 'background') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-5"
            style={{ backgroundImage: `url(${backgroundImage.src})` }}
          />
        )}
        <div className="relative z-10">
          {/* Content goes here - this is just the background */}
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <section className={`relative min-h-[60vh] flex items-center justify-center overflow-hidden ${className}`}>
        {pharmacyImage && (
          <>
            <img
              src={pharmacyImage.src}
              alt={pharmacyImage.alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
          </>
        )}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="font-headline text-5xl lg:text-7xl mb-6">{title}</h1>
          <p className="text-xl lg:text-2xl opacity-90 leading-relaxed">{description}</p>
        </div>
      </section>
    );
  }

  return (
    <div className={`bg-surface-container-lowest rounded-2xl overflow-hidden ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Image Side */}
        <div className="relative h-64 lg:h-auto">
          {pharmacyImage ? (
            <img
              src={pharmacyImage.src}
              alt={pharmacyImage.alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-outline-variant">local_pharmacy</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
        </div>

        {/* Content Side */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="space-y-6">
            <div>
              <span className="section-label text-[10px] text-primary mb-2 block">Pharmaceutical Excellence</span>
              <h2 className="font-headline text-3xl text-primary mb-4">{title}</h2>
              <p className="text-on-surface-variant leading-relaxed">{description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">99.9%</div>
                <div className="text-xs text-on-surface-variant uppercase tracking-wider">Purity Standards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                <div className="text-xs text-on-surface-variant uppercase tracking-wider">Quality Control</div>
              </div>
            </div>

            <button className="btn-primary w-fit">
              Learn More
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}