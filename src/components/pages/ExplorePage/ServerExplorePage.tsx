import {
  getMoviesGenresList,
  getTvShowsGenresList,
  MOVIES_LIST_INFINITE_QUERY_OPTIONS,
} from '@/api';
import { getQueryClient } from '@/utilities/getQueryClient';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import ExplorePage from './ExplorePage';
import { cacheLife } from 'next/cache';
import { Suspense } from 'react';

const ServerExplorePage = async () => {
  'use cache';
  cacheLife('days');

  const queryClient = getQueryClient();

  const [moviesGenresList, tvShowsGenresList] = await Promise.all([
    getMoviesGenresList(),
    getTvShowsGenresList(),
    queryClient.prefetchInfiniteQuery(MOVIES_LIST_INFINITE_QUERY_OPTIONS),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <ExplorePage moviesGenresList={moviesGenresList} tvShowsGenresList={tvShowsGenresList} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ServerExplorePage;
