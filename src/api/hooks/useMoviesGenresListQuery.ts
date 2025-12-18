import { fetchWithAuth } from '@/utilities/fetchWithAuth';
import { useQuery } from '@tanstack/react-query';
import { TMDB_LANGUAGE } from '../constants';
import { Genre } from '../types';

const getMoviesGenresList = async (): Promise<Genre[]> => {
  const response = await fetchWithAuth(`/_api/genre/movie/list?language=${TMDB_LANGUAGE}`);

  return response.genres;
};

export const useMoviesGenresListQuery = () => {
  return useQuery({
    queryKey: ['genres', 'list', 'movies'],
    queryFn: getMoviesGenresList,
  });
};
