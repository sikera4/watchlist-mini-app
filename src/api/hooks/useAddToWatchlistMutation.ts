import { db } from "@/utilities/initializeFirebase";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { WATCHLISTS_QUERY_KEY } from "./useWatchlistsQuery";
import { MovieInList } from "../types";

type Params = {
  movie: MovieInList;
  watchlistId: string;
}

const addToWatchlistMutation = async ({ movie, watchlistId }: Params) => {
  const watchlistDocRef = doc(db, 'watchlists', String(watchlistId));

  await updateDoc(watchlistDocRef, {
    movies: arrayUnion(movie),
  })
}

export const useAddToWatchlistMutation = (options?: UseMutationOptions<unknown, unknown, Params>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWatchlistMutation,
    ...options,
    onSuccess: (...params) => {
      queryClient.invalidateQueries({ queryKey: WATCHLISTS_QUERY_KEY });

      options?.onSuccess?.(...params);
    },
  });
}
