import { db } from '@/utilities/initializeFirebase';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';

type Params = {
  name?: string;
  userId: number;
};

const createList = async (params: Params) => {
  const watchlistsCollectionRef = collection(db, 'watchlists');
  const watchlistDocRef = await addDoc(watchlistsCollectionRef, {
    name: params.name ?? 'New Watchlist',
    userIds: [params.userId],
    movies: [],
  });

  const watchlistId = watchlistDocRef.id;

  const userDocRef = doc(db, 'users', String(params.userId));

  await updateDoc(userDocRef, {
    watchlists: arrayUnion(watchlistId),
  });
};

export const useCreateListMutation = (options?: UseMutationOptions<unknown, unknown, Params>) => {
  return useMutation({
    ...options,
    mutationFn: createList,
  });
};
