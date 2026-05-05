import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authApi } from '@/services/api/authApi';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('access-token');

      if (!token) {
        setAllowed(false);
        return;
      }

      try {
        await authApi.me();
        setAllowed(true);
      } catch {
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
        setAllowed(false);
      }
    }

    checkAuth();
  }, []);

  if (allowed === null) {
    return <p style={{ padding: 24 }}>Checking access...</p>;
  }

  return allowed ? <>{children}</> : <Navigate to="/admin/login" replace />;
}