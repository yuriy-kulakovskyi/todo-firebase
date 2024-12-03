import { useRouter } from 'next/router';
import { useAuth } from './AuthProvider';
import { ReactNode, useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return <>{children}</>;
}