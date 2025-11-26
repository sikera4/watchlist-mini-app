import { db } from "@/utilities/initializeFirebase";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { WATCHLISTS_QUERY_KEY } from "./useWatchlistsQuery";

type Params = {
  movieId: number;
  watchlistId: string;
}

const addMovieToWatchlistMutation = async ({ movieId, watchlistId }: Params) => {
  const watchlistDocRef = doc(db, 'watchlists', String(watchlistId));

  await updateDoc(watchlistDocRef, {
    movies: arrayUnion({
      id: movieId,
      isSeen: false,
    }),
  })
}

export const useAddMovieToWatchlistMutation = (options?: UseMutationOptions<unknown, unknown, Params>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMovieToWatchlistMutation,
    ...options,
    onSuccess: (...params) => {
      queryClient.invalidateQueries({ queryKey: WATCHLISTS_QUERY_KEY });

      options?.onSuccess?.(...params);
    },
  });
}
