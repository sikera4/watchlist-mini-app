import { UseQueryOptionsWithoutQueryKeyAndFn } from '@/types';
import { db } from '@/utilities/initializeFirebase';
import { useQuery } from '@tanstack/react-query';
import { List } from '../types';
import { readWatchlists } from '../firestore/watchlists';

export const getWatchlistsQueryKey = (userId?: string | null) =>
  userId ? ['user', 'lists', userId] : ['user', 'lists'];

export const useWatchlistsQuery = (
  userId: string | null,
  options?: UseQueryOptionsWithoutQueryKeyAndFn<List[], unknown, List[], string[]>
) => {
  return useQuery({
    ...options,
    enabled: Boolean(userId) && options?.enabled !== false,
    queryFn: () => (userId ? readWatchlists(db, userId) : Promise.resolve([])),
    queryKey: getWatchlistsQueryKey(userId),
  });
};
