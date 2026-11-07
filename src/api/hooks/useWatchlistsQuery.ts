import { UseQueryOptionsWithoutQueryKeyAndFn } from '@/types';
import { db } from '@/utilities/initializeFirebase';
import { useQuery } from '@tanstack/react-query';
import { List } from '../types';
import { readWatchlists } from '../firestore/watchlists';
import { withTimeout } from '@/utilities/withTimeout';

export const getWatchlistsQueryKey = (userId?: string | null) =>
  userId ? ['user', 'lists', userId] : ['user', 'lists'];

export const useWatchlistsQuery = (
  userId: string | null,
  options?: UseQueryOptionsWithoutQueryKeyAndFn<List[], unknown, List[], string[]>
) => {
  return useQuery({
    retry: false,
    ...options,
    enabled: Boolean(userId) && options?.enabled !== false,
    queryFn: () => (userId ? withTimeout(readWatchlists(db, userId)) : Promise.resolve([])),
    queryKey: getWatchlistsQueryKey(userId),
  });
};
