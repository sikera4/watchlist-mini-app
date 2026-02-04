import { fetchWithAuth } from '@/utilities/fetchWithAuth';
import { Genre } from '../types';
import { SERVER_REQUEST_CACHING_STATEGY, TMDB_BASE_URL, TMDB_LANGUAGE } from '../constants';

export const getTvShowsGenresList = async (): Promise<Genre[]> => {
  const response = await fetchWithAuth(
    `${TMDB_BASE_URL}/genre/tv/list?language=${TMDB_LANGUAGE}`,
    SERVER_REQUEST_CACHING_STATEGY
  );

  return response.genres;
};
