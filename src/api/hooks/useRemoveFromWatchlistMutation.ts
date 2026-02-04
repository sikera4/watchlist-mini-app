import { arrayRemove, doc, updateDoc } from 'firebase/firestore';
import { MediaItem } from '../types';
import { db } from '@/utilities/initializeFirebase';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { getWatchlistsQueryKey } from './useWatchlistsQuery';

type Params = {
  mediaItems: MediaItem[];
  watchlistId: string;
};

const addToWatchlistMutation = async ({ mediaItems, watchlistId }: Params) => {
  const watchlistDocRef = doc(db, 'watchlists', String(watchlistId));

  await updateDoc(watchlistDocRef, {
    items: arrayRemove(...mediaItems),
  });
};

export const useRemoveFromWatchlistMutation = (
  options?: UseMutationOptions<unknown, unknown, Params>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWatchlistMutation,
    ...options,
    onSuccess: (...params) => {
      queryClient.invalidateQueries({ queryKey: getWatchlistsQueryKey() });

      options?.onSuccess?.(...params);
    },
  });
};
