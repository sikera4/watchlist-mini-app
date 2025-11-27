import { db } from "@/utilities/initializeFirebase";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { WATCHLISTS_QUERY_KEY } from "./useWatchlistsQuery";
import { MovieInList } from "../types";

type Params = {
  movie: MovieInList;
  watchlistId: string;
}

const addMovieToWatchlistMutation = async ({ movie, watchlistId }: Params) => {
  const watchlistDocRef = doc(db, 'watchlists', String(watchlistId));

  await updateDoc(watchlistDocRef, {
    movies: arrayUnion(movie),
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
