import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullPage?: boolean;
}

const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

export default function LoadingSpinner({ size = 'md', className, fullPage }: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        'border-2 border-primary-fixed border-t-primary rounded-full animate-spin',
        sizes[size],
        className
      )}
    />
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="text-sm text-on-surface-variant animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-surface-container-high" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-surface-container-high rounded w-1/3" />
        <div className="h-5 bg-surface-container-high rounded w-3/4" />
        <div className="h-3 bg-surface-container-high rounded w-1/2" />
        <div className="flex justify-between items-center pt-3 border-t border-surface-container-high">
          <div className="h-6 bg-surface-container-high rounded w-1/4" />
          <div className="w-9 h-9 bg-surface-container-high rounded-full" />
        </div>
      </div>
    </div>
  );
}
