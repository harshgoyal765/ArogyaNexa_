'use client';
import { useEffect } from 'react';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import RoleBasedProfile from '@/components/profile/RoleBasedProfile';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchProfileThunk } from '@/store/authSlice';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((s) => s.auth);

  useEffect(() => { dispatch(fetchProfileThunk()); }, [dispatch]);

  if (isLoading || !user) return <LoadingSpinner fullPage />;

  return <RoleBasedProfile />;
}
