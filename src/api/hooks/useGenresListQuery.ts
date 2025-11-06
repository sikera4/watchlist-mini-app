import { fetchWithAuth } from '@/utilities/fetchWithAuth';
import { useQuery } from '@tanstack/react-query';

type Genre = {
  id: number;
  name: string;
};

const getGenresList = async (): Promise<Genre[]> => {
  const response = await fetchWithAuth('/_api/genre/movie/list');

  return response.genres;
};

export const useGenresListQuery = () => {
  return useQuery({
    queryKey: ['genres', 'list'],
    queryFn: getGenresList,
  });
};
