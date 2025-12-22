import { db } from "@/utilities/initializeFirebase";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { MediaItem } from "../types";
import { WATCHLISTS_QUERY_KEY } from "./useWatchlistsQuery";

type Params = {
  watchlistId: string;
  movieId: number;
}

const markAsSeen = async ({
  watchlistId,
  movieId,
}: Params) => {
  const watchlistDocRef = doc(db, 'watchlists', String(watchlistId));

  const watchlistDoc = await getDoc(watchlistDocRef);

  const watchedMoviesList: MediaItem[] = [];
  const moviesToWatchList: MediaItem[] = [];

  const watchlistMovies: MediaItem[] = watchlistDoc.data()?.movies || [];

  watchlistMovies.forEach((movie) => {
    if (movie.isSeen) {
      watchedMoviesList.push(movie);

      return;
    }

    if (movie.id === movieId && !movie.isSeen) {
      watchedMoviesList.push({
        ...movie,
        isSeen: true,
      });

      return;
    }

    moviesToWatchList.push(movie);
  })

  await updateDoc(watchlistDocRef, {
    movies: [...watchedMoviesList, ...moviesToWatchList],
  })
}

export const useMarkAsSeenMutation = (options?: UseMutationOptions<unknown, unknown, Params>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsSeen,
    ...options,
    onSuccess: (...params) => {
      options?.onSuccess?.(...params);

      queryClient.invalidateQueries({ queryKey: WATCHLISTS_QUERY_KEY })
    }
  })
}
