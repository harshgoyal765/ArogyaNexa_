'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, hasRole } = useAuth();
  const router = useRouter();

  const hasRequiredRole = !requiredRole || (
    Array.isArray(requiredRole)
      ? requiredRole.some(hasRole)
      : hasRole(requiredRole)
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }
    if (!hasRequiredRole) {
      router.replace('/403');
    }
  }, [isAuthenticated, hasRequiredRole, router, redirectTo]);

  if (!isAuthenticated) return <LoadingSpinner fullPage />;
  if (!hasRequiredRole) return <LoadingSpinner fullPage />;

  return <>{children}</>;
}
