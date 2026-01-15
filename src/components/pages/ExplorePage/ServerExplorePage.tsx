import {
  getMoviesGenresList,
  getTvShowsGenresList,
  MOVIES_LIST_INFINITE_QUERY_OPTIONS,
} from '@/api';
import { getQueryClient } from '@/utilities/getQueryClient';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import ExplorePage from './ExplorePage';
import { cacheLife } from 'next/cache';

const ServerExplorePage = async () => {
  'use cache';
  cacheLife('hours');

  const queryClient = getQueryClient();

  const [moviesGenresList, tvShowsGenresList] = await Promise.all([
    getMoviesGenresList(),
    getTvShowsGenresList(),
    queryClient.prefetchInfiniteQuery(MOVIES_LIST_INFINITE_QUERY_OPTIONS),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExplorePage moviesGenresList={moviesGenresList} tvShowsGenresList={tvShowsGenresList} />
    </HydrationBoundary>
  );
};

export default ServerExplorePage;
