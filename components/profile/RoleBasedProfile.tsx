'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CustomerProfile from '@/components/profile/CustomerProfile';
import AdminProfile from '@/components/profile/AdminProfile';
import DoctorProfile from '@/components/profile/DoctorProfile';
import PharmacistProfile from '@/components/profile/PharmacistProfile';
import ContentEditorProfile from '@/components/profile/ContentEditorProfile';

export default function RoleBasedProfile() {
  const { user, isCustomer, isAdmin, isDoctor, isPharmacist, isContentEditor, isSuperAdmin } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading profile data
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !user) {
    return <LoadingSpinner fullPage />;
  }

  // Render role-specific profile component
  if (isCustomer) {
    return <CustomerProfile />;
  }

  if (isAdmin) {
    return <AdminProfile />;
  }

  if (isDoctor) {
    return <DoctorProfile />;
  }

  if (isPharmacist) {
    return <PharmacistProfile />;
  }

  if (isContentEditor) {
    return <ContentEditorProfile />;
  }

  if (isSuperAdmin) {
    // SuperAdmin uses a minimal profile (system account)
    return <AdminProfile />;
  }

  // Fallback to customer profile
  return <CustomerProfile />;
}
