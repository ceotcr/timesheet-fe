'use client';

import { useAuthStore } from '@/store/auth';
import { LoginForm } from '@/components/auth/login-form';
import { Header } from '@/components/layout/header';
import { ManagerDashboard } from '@/components/dashboard/manager-dashboard';
import { AssociateDashboard } from '@/components/dashboard/associate-dashboard';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        {user.role === 'manager' ? (
          <ManagerDashboard />
        ) : (
          <AssociateDashboard />
        )}
      </main>
    </div>
  );
}
