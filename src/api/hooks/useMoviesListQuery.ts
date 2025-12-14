import { fetchWithAuth } from '@/utilities/fetchWithAuth';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Movie } from '../types';
import { TMDB_LANGUAGE } from '../constants';

const getMoviesList = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<{
  data: Movie[];
  nextCursor?: number;
}> => {
  const response = await fetchWithAuth(`/_api/movie/popular?language=${TMDB_LANGUAGE}&page=${pageParam}`);

  return {
    data: response.results,
    nextCursor: response.total_pages > pageParam ? pageParam + 1 : undefined,
  };
};

export const useMoviesListQuery = () => {
  return useInfiniteQuery({
    queryKey: ['movies', 'popular'],
    queryFn: getMoviesList,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};
