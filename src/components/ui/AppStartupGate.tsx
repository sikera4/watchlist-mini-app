'use client';

import { useWatchlistsQuery } from '@/api/hooks/useWatchlistsQuery';
import { ReactNode } from 'react';
import AuthenticationScreen from './AuthenticationScreen';

export default function AppStartupGate({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  const lists = useWatchlistsQuery(userId);

  // An empty array is loaded data too. Never hide existing content during a refetch.
  if (lists.data !== undefined) {
    return children;
  }

  if (lists.isError || lists.isPaused) {
    return <AuthenticationScreen state="data-error" onRetry={() => void lists.refetch()} />;
  }

  return <AuthenticationScreen state="loading" />;
}
