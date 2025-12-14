import { fetchWithAuth } from '@/utilities/fetchWithAuth';
import { useQuery } from '@tanstack/react-query';
import { TMDB_LANGUAGE } from '../constants';

type Genre = {
  id: number;
  name: string;
};

const getGenresList = async (): Promise<Genre[]> => {
  const response = await fetchWithAuth(`/_api/genre/movie/list?language=${TMDB_LANGUAGE}`);

  return response.genres;
};

export const useGenresListQuery = () => {
  return useQuery({
    queryKey: ['genres', 'list'],
    queryFn: getGenresList,
  });
};
