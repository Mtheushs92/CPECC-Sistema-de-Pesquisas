'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Login from '@/components/login';
import Onboarding from '@/components/onboarding';
import Dashboard from '@/components/dashboard';
import AdminDashboard from '@/components/admin-dashboard';
import { seedMockData, getOneFromLocal } from '@/lib/local-storage';

export default function Home() {
  const { user, adminUser, loading } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    seedMockData();

    if (user) {
      seedMockData(user.id);
    }

    const checkProfile = () => {
      if (user) {
        setHasProfile(!!getOneFromLocal('researchers', user.id));
      } else {
        setHasProfile(null);
      }
    };

    checkProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (adminUser) {
    return <AdminDashboard />;
  }

  if (!user) {
    return <Login />;
  }

  if (hasProfile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasProfile) {
    return <Onboarding onComplete={() => setHasProfile(true)} />;
  }

  return <Dashboard />;
}
