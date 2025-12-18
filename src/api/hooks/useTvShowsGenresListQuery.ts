import { fetchWithAuth } from '@/utilities/fetchWithAuth';
import { useQuery } from '@tanstack/react-query';
import { TMDB_LANGUAGE } from '../constants';
import { Genre } from '../types';

const getTvShowsGenresList = async (): Promise<Genre[]> => {
  const response = await fetchWithAuth(`/_api/genre/tv/list?language=${TMDB_LANGUAGE}`);

  return response.genres;
};

export const useTvShowsGenresListQuery = () => {
  return useQuery({
    queryKey: ['genres', 'list', 'tv'],
    queryFn: getTvShowsGenresList,
  });
};
