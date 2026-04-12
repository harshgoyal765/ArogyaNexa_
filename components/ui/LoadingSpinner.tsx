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

// Re-export all skeletons from Skeletons.tsx for backward compatibility
export {
  ProductCardSkeleton,
  DashboardCardSkeleton,
  MetricCardSkeleton,
  TableSkeleton,
  TableRowSkeleton,
  ListSkeleton,
  ListItemSkeleton,
  ProfileSkeleton,
  ProfileCardSkeleton,
  ProfileHeaderSkeleton,
  NotificationsSkeleton,
  NotificationItemSkeleton,
  OrderCardSkeleton,
  WellnessScoreSkeleton,
  ChartSkeleton,
  ArticleCardSkeleton,
  PrescriptionCardSkeleton,
  FullPageSkeleton,
} from './Skeletons';
