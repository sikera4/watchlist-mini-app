import { db } from "@/utilities/initializeFirebase";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { addDoc, collection } from "firebase/firestore";

type Params = {
  name?: string;
  userId: number;
}

const createList = async (params: Params) => {
  const watchlistsCollectionRef = collection(db, 'watchlists');
  const docRef = await addDoc(watchlistsCollectionRef, {
    name: params.name ?? 'New Watchlist',
    userIds: [params.userId],
    movies: [],
  });

  return docRef.id;
}

export const useCreateListMutation = (options?: UseMutationOptions<string, unknown, Params>) => {
  return useMutation({
    ...options,
    mutationFn: createList,
  })
}
