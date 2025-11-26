import { fetchWithAuth } from '@/utilities/fetchWithAuth';
import { Movie } from '../types';
import { useInfiniteQuery } from '@tanstack/react-query';

const searchForMovies = async ({
  pageParam,
  queryKey,
}: {
  pageParam: number;
  queryKey: string[];
}): Promise<{
  data: Movie[];
  nextCursor?: number;
}> => {
  const response = await fetchWithAuth(`/_api/search/multi?page=${pageParam}&query=${queryKey[1]}`);

  return {
    data: response.results,
    nextCursor: response.total_pages > pageParam ? pageParam + 1 : undefined,
  };
};

export const useMoviesSearchQuery = (searchTerm: string) => {
  return useInfiniteQuery({
    queryKey: ['moviesSearch', searchTerm],
    queryFn: searchForMovies,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(searchTerm),
  });
};
