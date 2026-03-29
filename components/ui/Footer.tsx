import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  const links = {
    Platform: [
      { label: 'Browse Medicines', href: '/products' },
      { label: 'Upload Prescription', href: '/prescriptions' },
      { label: 'Track Order', href: '/orders' },
      { label: 'AI Assistant', href: '/ai-assistant' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Verified Pharmacy', href: '/verified' },
      { label: 'Refund Policy', href: '/refunds' },
    ],
  };

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/10">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg clinical-gradient flex items-center justify-center">
                <span className="text-white text-sm font-bold">W</span>
              </div>
              <span className="font-headline text-xl font-semibold text-primary">ArogyaNexa</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs">
              A premium pharmacy e-commerce platform bridging clinical precision and human wellness. Every product vetted by board-certified pharmacists.
            </p>
            <div className="flex items-center gap-2 text-xs text-outline">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim inline-block"></span>
              Licensed Pharmaceutical Practice
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h4 className="section-label text-on-surface font-semibold">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-outline">
            © {new Date().getFullYear()} ArogyaNexa. All rights reserved.
          </p>
          <p className="text-xs text-outline flex items-center gap-1">
            Built with <Heart size={12} className="text-error" /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
}
