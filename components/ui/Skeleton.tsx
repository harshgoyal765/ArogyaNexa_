import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  style?: React.CSSProperties;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  style: externalStyle,
}: SkeletonProps) {
  const baseClasses = 'bg-surface-container-high';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high bg-[length:200%_100%]',
    none: '',
  };

  const style: React.CSSProperties = { ...externalStyle };
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
}

// Card Skeleton
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('card p-6 space-y-4', className)}>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" variant="rounded" />
        <Skeleton className="h-8 w-20" variant="rounded" />
      </div>
    </div>
  );
}

// List Item Skeleton
export function SkeletonListItem({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 p-4', className)}>
      <Skeleton variant="circular" className="w-12 h-12 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-16" variant="rounded" />
    </div>
  );
}

// Table Row Skeleton
export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-outline-variant/10">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Table Skeleton
export function SkeletonTable({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-outline-variant/20">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="py-4 px-4 text-left">
                <Skeleton className="h-4 w-24" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Profile Skeleton
export function SkeletonProfile() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Skeleton variant="circular" className="w-24 h-24" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-4 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Content Sections */}
      <div className="card p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

// Dashboard Stats Skeleton
export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton variant="circular" className="w-10 h-10" />
          </div>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

// Notification Skeleton
export function SkeletonNotification() {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton variant="circular" className="w-10 h-10 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

// Grid Skeleton (for product grids, etc.)
export function SkeletonGrid({ items = 6, columns = 3 }: { items?: number; columns?: number }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="card p-4 space-y-4">
          <Skeleton className="w-full aspect-square" variant="rounded" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton variant="circular" className="w-8 h-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Chart Skeleton
export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div className={cn('card p-6 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24" variant="rounded" />
      </div>
      <div className="h-64 flex items-end gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${Math.random() * 100 + 50}px` }}
          />
        ))}
      </div>
    </div>
  );
}

// Form Skeleton
export function SkeletonForm({ fields = 5 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-12 w-full" variant="rounded" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-12 w-32" variant="rounded" />
        <Skeleton className="h-12 w-24" variant="rounded" />
      </div>
    </div>
  );
}

// Calendar Skeleton
export function SkeletonCalendar() {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton variant="circular" className="w-8 h-8" />
          <Skeleton variant="circular" className="w-8 h-8" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square" variant="rounded" />
        ))}
      </div>
    </div>
  );
}
