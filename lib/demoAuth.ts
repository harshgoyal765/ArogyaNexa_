/**
 * DEMO AUTH — Dummy credentials for role-based access testing
 * ─────────────────────────────────────────────────────────────
 * These credentials bypass the real backend and return mock tokens.
 * Remove or gate behind NODE_ENV in production.
 */

import type { AuthResponse } from '@/types/auth';

export interface DemoUser {
  email: string;
  password: string;
  role: string;
  label: string;
  dashboard: string;
  description: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    email: 'customer@demo.com',
    password: 'Demo@1234',
    role: 'CUSTOMER',
    label: 'Customer',
    dashboard: '/dashboard',
    description: 'Browse products, place orders, track prescriptions',
  },
  {
    email: 'doctor@demo.com',
    password: 'Demo@1234',
    role: 'DOCTOR',
    label: 'Doctor',
    dashboard: '/doctor',
    description: 'Patient portal, prescriptions, consultations',
  },
  {
    email: 'pharmacist@demo.com',
    password: 'Demo@1234',
    role: 'PHARMACIST',
    label: 'Pharmacist',
    dashboard: '/pharmacist',
    description: 'Review prescriptions, manage dispensing queue',
  },
  {
    email: 'admin@demo.com',
    password: 'Demo@1234',
    role: 'ADMIN',
    label: 'Admin',
    dashboard: '/admin/dashboard',
    description: 'Orders, products, users, operations',
  },
  {
    email: 'superadmin@demo.com',
    password: 'Demo@1234',
    role: 'SUPER_ADMIN',
    label: 'Super Admin',
    dashboard: '/superadmin',
    description: 'Full system access, all dashboards',
  },
  {
    email: 'content@demo.com',
    password: 'Demo@1234',
    role: 'CONTENT_EDITOR',
    label: 'Content Editor',
    dashboard: '/admin/content',
    description: 'Wellness articles, health education hub',
  },
];

/** Returns a mock AuthResponse if credentials match a demo user, otherwise null */
export function getDemoAuthResponse(email: string, password: string): AuthResponse | null {
  const match = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!match) return null;

  return {
    accessToken: `demo-token-${match.role.toLowerCase()}-${Date.now()}`,
    refreshToken: `demo-refresh-${match.role.toLowerCase()}`,
    tokenType: 'Bearer',
    expiresIn: 86400,
    uuid: `demo-uuid-${match.role.toLowerCase()}`,
    email: match.email,
    fullName: `Demo ${match.label}`,
    roles: [match.role],
    mfaRequired: false,
  };
}

/** Returns the dashboard path for a given set of roles */
export function getDashboardForRoles(roles: string[]): string {
  if (roles.includes('SUPER_ADMIN')) return '/superadmin';
  if (roles.includes('ADMIN')) return '/admin/dashboard';
  if (roles.includes('PHARMACIST')) return '/pharmacist';
  if (roles.includes('DOCTOR')) return '/doctor';
  if (roles.includes('CONTENT_EDITOR')) return '/admin/content';
  return '/dashboard';
}
