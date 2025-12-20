import { fetchWithAuth } from '@/utilities/fetchWithAuth';
import { Movie, TvShow } from '../types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { TMDB_LANGUAGE } from '../constants';

type MediaItem = {
  media_type: 'movie';
} & Movie | {
  media_type: 'tv';
} & TvShow | {
  media_type: 'person';
};

const search = async ({
  pageParam,
  queryKey,
}: {
  pageParam: number;
  queryKey: string[];
}): Promise<{
  data: MediaItem[];
  nextCursor?: number;
}> => {
  const response = await fetchWithAuth(`/_api/search/multi?page=${pageParam}&query=${queryKey[1]}&language=${TMDB_LANGUAGE}`);

  return {
    data: response.results,
    nextCursor: response.total_pages > pageParam ? pageParam + 1 : undefined,
  };
};

export const useSearchQuery = (searchTerm: string) => {
  return useInfiniteQuery({
    queryKey: ['moviesSearch', searchTerm],
    queryFn: search,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(searchTerm),
  });
};
