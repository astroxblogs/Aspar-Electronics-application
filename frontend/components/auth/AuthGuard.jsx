'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { persistor } from '@/store';
import { Loader2 } from 'lucide-react';
import { selectIsAuthenticated, selectIsAdmin } from '@/store/slices/authSlice';

export default function AuthGuard({ children, requireAdmin = false }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Check if redux-persist has already extracted state from localStorage
    if (persistor.getState().bootstrapped) {
      setIsHydrated(true);
      return;
    }
    
    // Subscribe to wait for hydration to complete
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        setIsHydrated(true);
        unsubscribe();
      }
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Only execute redirects after Redux memory is fully restored
    if (isHydrated) {
      if (!isAuthenticated) {
        router.replace(`/login?callbackUrl=${pathname}`);
      } else if (requireAdmin && !isAdmin) {
        router.replace('/');
      }
    }
  }, [isHydrated, isAuthenticated, isAdmin, requireAdmin, router, pathname]);

  // Show a blank loading screen while verifying auth to prevent UI data flashes
  if (!isHydrated || !isAuthenticated || (requireAdmin && !isAdmin)) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-700 animate-spin" />
      </div>
    );
  }

  // Authentication successful, render private components
  return <>{children}</>;
}
