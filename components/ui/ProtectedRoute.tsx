'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  redirectTo?: string;
  blockSuperAdmin?: boolean; // New prop to explicitly block SuperAdmin from business routes
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login',
  blockSuperAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, hasRole, isSuperAdmin } = useAuth();
  const router = useRouter();

  const hasRequiredRole = !requiredRole || (
    Array.isArray(requiredRole)
      ? requiredRole.some(hasRole)
      : hasRole(requiredRole)
  );

  // Block SuperAdmin from accessing business data routes
  const isSuperAdminBlocked = blockSuperAdmin && isSuperAdmin;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }
    
    // If SuperAdmin tries to access blocked route, redirect to their dashboard
    if (isSuperAdminBlocked) {
      router.replace('/superadmin');
      return;
    }
    
    if (!hasRequiredRole) {
      router.replace('/403');
    }
  }, [isAuthenticated, hasRequiredRole, isSuperAdminBlocked, router, redirectTo]);

  if (!isAuthenticated) return <LoadingSpinner fullPage />;
  if (isSuperAdminBlocked) return <LoadingSpinner fullPage />;
  if (!hasRequiredRole) return <LoadingSpinner fullPage />;

  return <>{children}</>;
}
