import { db } from '@/utilities/initializeFirebase';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { setWatched, WatchedParams } from '../firestore/watched';
import { getWatchlistsQueryKey } from './useWatchlistsQuery';

export const useSetWatchedMutation = (
  options?: UseMutationOptions<void, unknown, WatchedParams>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: WatchedParams) => setWatched(db, params),
    ...options,
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({ queryKey: getWatchlistsQueryKey() });
      await options?.onSuccess?.(...params);
    },
  });
};
