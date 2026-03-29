'use client';
import { useAppSelector } from './useAppDispatch';

export function useAuth() {
  const { user, accessToken, roles } = useAppSelector((s) => s.auth);
  const isAuthenticated = !!accessToken;

  return {
    user,
    accessToken,
    roles,
    isAuthenticated,
    isCustomer: roles.includes('CUSTOMER'),
    isDoctor: roles.includes('DOCTOR'),
    isPharmacist: roles.includes('PHARMACIST'),
    isAdmin: roles.includes('ADMIN'),
    isSuperAdmin: roles.includes('SUPER_ADMIN'),
    isContentEditor: roles.includes('CONTENT_EDITOR'),
    hasRole: (role: string) => roles.includes(role),
  };
}
