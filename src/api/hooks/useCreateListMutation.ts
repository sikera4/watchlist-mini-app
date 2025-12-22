import { db } from '@/utilities/initializeFirebase';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { getUserDataQueryKey } from './useUserDataQuery';
import { getWatchlistsQueryKey } from './useWatchlistsQuery';

type Params = {
  name?: string;
  userId: number;
};

const createList = async (params: Params) => {
  const watchlistsCollectionRef = collection(db, 'watchlists');
  const watchlistDocRef = await addDoc(watchlistsCollectionRef, {
    name: params.name ?? 'New Watchlist',
    userIds: [params.userId],
    items: [],
  });

  const watchlistId = watchlistDocRef.id;

  const userDocRef = doc(db, 'users', String(params.userId));

  await updateDoc(userDocRef, {
    watchlists: arrayUnion(watchlistId),
  });
};

export const useCreateListMutation = (options?: UseMutationOptions<unknown, unknown, Params>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: createList,
    onSuccess: async (_, variables, ...otherParams) => {
      await queryClient.invalidateQueries({ queryKey: getUserDataQueryKey(variables.userId) });
      await queryClient.invalidateQueries({ queryKey: getWatchlistsQueryKey() });

      options?.onSuccess?.(_, variables, ...otherParams);
    }
  });
};
