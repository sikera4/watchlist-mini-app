import { fetchWithAuth } from '@/utilities/fetchWithAuth';
import { isServer, useInfiniteQuery } from '@tanstack/react-query';
import { TMDB_BASE_URL, TMDB_LANGUAGE } from '../constants';
import { Movie } from '../types';

const getMoviesList = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<{
  data: Movie[];
  nextCursor?: number;
}> => {
  const response = await fetchWithAuth(`${isServer ? TMDB_BASE_URL : '/_api'}/movie/popular?language=${TMDB_LANGUAGE}&page=${pageParam}`);

  return {
    data: response.results,
    nextCursor: response.total_pages > pageParam ? pageParam + 1 : undefined,
  };
};

export const MOVIES_LIST_INFINITE_QUERY_OPTIONS = {
  queryKey: ['movies', 'popular'],
  queryFn: getMoviesList,
  initialPageParam: 1,
  getNextPageParam: (lastPage: { nextCursor?: number }) => lastPage.nextCursor,
}

export const useMoviesListQuery = () => {
  return useInfiniteQuery(MOVIES_LIST_INFINITE_QUERY_OPTIONS);
};
