import Link from 'next/link';
import { ShieldOff } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 rounded-full bg-error-container/30 flex items-center justify-center mx-auto">
          <ShieldOff size={48} className="text-error" />
        </div>
        <h1 className="font-headline text-3xl text-primary">Access Denied</h1>
        <p className="text-on-surface-variant">You don&apos;t have permission to access this page.</p>
        <Link href="/" className="btn-primary inline-flex">Go Home</Link>
      </div>
    </div>
  );
}
