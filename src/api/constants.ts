export const TMDB_LANGUAGE = 'ru-RU';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const SERVER_REQUEST_CACHING_STATEGY: RequestInit = {
  cache: 'force-cache',
  next: { revalidate: 86400 }, // 24 hours
};
