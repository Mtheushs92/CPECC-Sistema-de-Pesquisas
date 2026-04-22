'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Login from '@/components/login';
import Onboarding from '@/components/onboarding';
import Dashboard from '@/components/dashboard';
import AdminDashboard from '@/components/admin-dashboard';
import { seedMockData } from '@/lib/local-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Home() {
  const { user, adminUser, loading } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    // Seed basic data on load
    seedMockData();

    // Test Firestore Connection
    const testConnection = async () => {
      try {
        const { doc, getDocFromServer } = await import('firebase/firestore');
        await getDocFromServer(doc(db, 'system_config', 'connection_test'));
      } catch (error: any) {
        if (error.message?.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    if (user) {
      seedMockData(user.id);
    }

    const checkProfile = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'researchers', user.id);
          const docSnap = await getDoc(docRef);
          setHasProfile(docSnap.exists());
        } catch (error) {
          console.error('Error checking profile:', error);
          setHasProfile(false);
        }
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

  // Admin has priority if logged in
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
