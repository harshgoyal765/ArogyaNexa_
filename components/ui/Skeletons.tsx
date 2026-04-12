'use client';

// Custom Skeleton component using Tailwind CSS
// boneyard-js doesn't export CSS, so we'll create our own skeleton with shimmer effect

interface SkeletonProps {
  height?: string;
  width?: string;
  borderRadius?: string;
  className?: string;
}

function Skeleton({ height = '20px', width = '100%', borderRadius = '4px', className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-surface-container-high via-surface-container-low to-surface-container-high bg-[length:200%_100%] ${className}`}
      style={{
        height,
        width,
        borderRadius,
        animation: 'shimmer 2s infinite linear',
      }}
    />
  );
}

// Add shimmer animation to global styles if not already present
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  if (!document.querySelector('style[data-skeleton-animation]')) {
    style.setAttribute('data-skeleton-animation', 'true');
    document.head.appendChild(style);
  }
}

// ============================================
// CARD SKELETONS
// ============================================

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton height="300px" width="100%" />
      <div className="p-5 space-y-3">
        <Skeleton height="12px" width="40%" />
        <Skeleton height="20px" width="80%" />
        <Skeleton height="12px" width="60%" />
        <div className="flex justify-between items-center pt-3 border-t border-surface-container-high">
          <Skeleton height="24px" width="30%" />
          <Skeleton height="36px" width="36px" borderRadius="50%" />
        </div>
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-4">
        <Skeleton height="40px" width="40px" borderRadius="8px" />
        <Skeleton height="24px" width="60px" borderRadius="12px" />
      </div>
      <Skeleton height="12px" width="50%" className="mb-2" />
      <Skeleton height="32px" width="40%" />
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton height="24px" width="24px" borderRadius="50%" />
        <Skeleton height="12px" width="40%" />
      </div>
      <Skeleton height="36px" width="50%" />
    </div>
  );
}

// ============================================
// TABLE SKELETONS
// ============================================

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-surface-container-high">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton height="16px" width={i === 0 ? '80%' : '60%'} />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container-low">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <Skeleton height="12px" width="60%" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRowSkeleton key={i} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// LIST SKELETONS
// ============================================

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low/50">
      <Skeleton height="48px" width="48px" borderRadius="50%" />
      <div className="flex-1 space-y-2">
        <Skeleton height="16px" width="70%" />
        <Skeleton height="12px" width="50%" />
      </div>
      <Skeleton height="32px" width="80px" borderRadius="8px" />
    </div>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================
// PROFILE SKELETONS
// ============================================

export function ProfileHeaderSkeleton() {
  return (
    <div className="mb-12">
      <Skeleton height="12px" width="120px" className="mb-2" />
      <Skeleton height="40px" width="300px" className="mb-4" />
      <Skeleton height="16px" width="400px" />
    </div>
  );
}

export function ProfileCardSkeleton() {
  return (
    <div className="card p-8">
      <Skeleton height="28px" width="200px" className="mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton height="12px" width="40%" className="mb-2" />
            <Skeleton height="16px" width="80%" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto">
      <ProfileHeaderSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 space-y-6">
          <ProfileCardSkeleton />
          <ProfileCardSkeleton />
        </div>
        <div className="md:col-span-5 space-y-6">
          <div className="card p-8">
            <Skeleton height="28px" width="150px" className="mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                  <div className="flex items-center gap-3">
                    <Skeleton height="24px" width="24px" borderRadius="50%" />
                    <Skeleton height="14px" width="100px" />
                  </div>
                  <Skeleton height="20px" width="60px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// NOTIFICATION SKELETONS
// ============================================

export function NotificationItemSkeleton() {
  return (
    <div className="card p-6">
      <div className="flex items-start gap-4">
        <Skeleton height="40px" width="40px" borderRadius="50%" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton height="16px" width="150px" />
            <Skeleton height="12px" width="60px" />
          </div>
          <Skeleton height="14px" width="100%" />
          <Skeleton height="14px" width="80%" />
        </div>
      </div>
    </div>
  );
}

export function NotificationsSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <NotificationItemSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================
// ORDER SKELETONS
// ============================================

export function OrderCardSkeleton() {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton height="20px" width="120px" />
        <Skeleton height="24px" width="80px" borderRadius="12px" />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <Skeleton height="14px" width="100px" />
          <Skeleton height="14px" width="80px" />
        </div>
        <div className="flex justify-between">
          <Skeleton height="14px" width="120px" />
          <Skeleton height="14px" width="60px" />
        </div>
        <div className="flex justify-between pt-3 border-t border-surface-container-high">
          <Skeleton height="16px" width="80px" />
          <Skeleton height="20px" width="100px" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// DASHBOARD SPECIFIC SKELETONS
// ============================================

export function WellnessScoreSkeleton() {
  return (
    <div className="card p-8 flex flex-col md:flex-row items-center gap-12">
      <Skeleton height="192px" width="192px" borderRadius="50%" />
      <div className="flex-1 space-y-4">
        <Skeleton height="28px" width="200px" />
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="80%" />
        <div className="grid grid-cols-3 gap-4 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface-container-low p-3 rounded-xl">
              <Skeleton height="12px" width="60%" className="mb-2" />
              <Skeleton height="16px" width="40%" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="card p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton height="28px" width="180px" className="mb-2" />
          <Skeleton height="14px" width="220px" />
        </div>
        <Skeleton height="32px" width="120px" borderRadius="8px" />
      </div>
      <Skeleton height="200px" width="100%" borderRadius="8px" />
    </div>
  );
}

// ============================================
// ARTICLE/WELLNESS SKELETONS
// ============================================

export function ArticleCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton height="112px" width="100%" />
      <div className="p-4 space-y-2">
        <Skeleton height="12px" width="40%" />
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="80%" />
        <Skeleton height="12px" width="60%" className="mt-2" />
      </div>
    </div>
  );
}

// ============================================
// PRESCRIPTION SKELETONS
// ============================================

export function PrescriptionCardSkeleton() {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <Skeleton height="48px" width="48px" borderRadius="50%" />
          <div className="space-y-2">
            <Skeleton height="18px" width="150px" />
            <Skeleton height="14px" width="100px" />
          </div>
        </div>
        <Skeleton height="24px" width="80px" borderRadius="12px" />
      </div>
      <div className="space-y-2">
        <Skeleton height="14px" width="100%" />
        <Skeleton height="14px" width="80%" />
      </div>
    </div>
  );
}

// ============================================
// FULL PAGE SKELETON
// ============================================

export function FullPageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <Skeleton height="48px" width="300px" className="mx-auto" />
          <Skeleton height="20px" width="400px" className="mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
