import { db } from "@/utilities/initializeFirebase";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { MediaItem } from "../types";
import { getWatchlistsQueryKey } from "./useWatchlistsQuery";

type Params = {
  movie: MediaItem;
  watchlistId: string;
}

const addToWatchlistMutation = async ({ movie, watchlistId }: Params) => {
  const watchlistDocRef = doc(db, 'watchlists', String(watchlistId));

  await updateDoc(watchlistDocRef, {
    items: arrayUnion(movie),
  })
}

export const useAddToWatchlistMutation = (options?: UseMutationOptions<unknown, unknown, Params>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWatchlistMutation,
    ...options,
    onSuccess: (...params) => {
      queryClient.invalidateQueries({ queryKey: getWatchlistsQueryKey() });

      options?.onSuccess?.(...params);
    },
  });
}
