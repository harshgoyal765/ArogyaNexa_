import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="font-headline text-[120px] text-primary-fixed leading-none select-none">404</div>
        <h1 className="font-headline text-3xl text-primary">Page not found</h1>
        <p className="text-on-surface-variant">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/products" className="btn-secondary">Browse Medicines</Link>
        </div>
      </div>
    </div>
  );
}
