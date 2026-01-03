'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/Toast';
import { WindowContextProvider } from '@/components/Window/WindowContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ToastProvider>
        <WindowContextProvider>{children}</WindowContextProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
