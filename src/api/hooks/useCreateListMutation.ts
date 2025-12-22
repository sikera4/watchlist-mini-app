import { db } from '@/utilities/initializeFirebase';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { WATCHLISTS_QUERY_KEY } from './useWatchlistsQuery';

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
    onSuccess: (...params) => {
      queryClient.invalidateQueries({ queryKey: WATCHLISTS_QUERY_KEY });

      options?.onSuccess?.(...params);
    }
  });
};
