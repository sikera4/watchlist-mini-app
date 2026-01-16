import { db } from "@/utilities/initializeFirebase";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { MediaItem } from "../types";
import { getWatchlistsQueryKey } from "./useWatchlistsQuery";

type Params = {
  mediaItem: MediaItem;
  watchlistId: string;
}

const addToWatchlistMutation = async ({ mediaItem, watchlistId }: Params) => {
  const watchlistDocRef = doc(db, 'watchlists', String(watchlistId));

  console.log(mediaItem)

  await updateDoc(watchlistDocRef, {
    items: arrayUnion(mediaItem),
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
