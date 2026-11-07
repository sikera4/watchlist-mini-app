'use client';

import { Genre, useMoviesListQuery, useSearchQuery } from '@/api';
import { useIsScrolledToBottom } from '@/hooks/isScrolledToBottom';
import { Button, Spinner } from '@heroui/react';
import React, { useEffect } from 'react';
import {
  useBrowsingState,
  useRememberPageScroll,
} from '@/components/providers/BrowsingStateProvider';
import Card from './Card';
import SearchForm from './SearchForm';
import { movieToCardData } from './utilities/movieToCardData';
import { formatGenres } from './utilities/formatGenres';
import { tvShowToCardData } from './utilities/tvShowToCardData';

type Props = {
  moviesGenresList: Genre[];
  tvShowsGenresList: Genre[];
};

const ExplorePage = ({ moviesGenresList, tvShowsGenresList }: Props) => {
  const { searchTerm } = useBrowsingState();
  useRememberPageScroll('/explore');

  const moviesListQuery = useMoviesListQuery();
  const searchQuery = useSearchQuery(searchTerm);

  const isScrolledToBottom = useIsScrolledToBottom(undefined, {
    offset: 200,
  });

  const activeQuery = searchTerm ? searchQuery : moviesListQuery;
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = activeQuery;

  useEffect(() => {
    if (!isScrolledToBottom || !hasNextPage || isFetchingNextPage) {
      return;
    }

    // Recheck geometry after results grow; don't fetch every page on a stale scroll flag.
    if (document.documentElement.scrollHeight - (window.scrollY + window.innerHeight) <= 200) {
      void fetchNextPage();
    }
  }, [isScrolledToBottom, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isLoading = activeQuery.isLoading;

  const renderSearchedItems = () => {
    return searchQuery.data?.pages.map((page, i) => (
      <React.Fragment key={i}>
        {page.data.map((mediaItem) => {
          if (mediaItem.media_type === 'person') {
            return null;
          }

          const cardData =
            mediaItem.media_type === 'movie'
              ? movieToCardData(mediaItem)
              : tvShowToCardData(mediaItem);
          const genres = formatGenres({
            genres: mediaItem.media_type === 'movie' ? moviesGenresList : tvShowsGenresList,
            genresIds: mediaItem.genre_ids,
          });

          return (
            <div key={mediaItem.id}>
              <Card {...cardData} genres={genres} />
            </div>
          );
        })}
      </React.Fragment>
    ));
  };

  const renderMoviesList = () => {
    return moviesListQuery.data?.pages.map((page, i) => (
      <React.Fragment key={i}>
        {page.data.map((movie) => (
          <div key={movie.id}>
            <Card
              {...movieToCardData(movie)}
              genres={formatGenres({
                genres: moviesGenresList,
                genresIds: movie.genre_ids,
              })}
            />
          </div>
        ))}
      </React.Fragment>
    ));
  };

  return (
    <div className="app-page px-4 relative min-h-screen">
      <div className="telegram-theme-surface -mx-4 px-4 py-4 sticky top-0 z-10">
        <SearchForm />
      </div>
      {isLoading ? (
        <div className="absolute top-[calc(50%-20px)] left-[calc(50%-20px)]">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {searchTerm ? renderSearchedItems() : renderMoviesList()}
        </div>
      )}
      {activeQuery.isError && (
        <div role="alert" className="py-6 text-center">
          <p className="mb-3 text-sm text-muted">
            Не удалось загрузить фильмы. Попробуйте ещё раз.
          </p>
          <Button variant="secondary" onPress={() => void activeQuery.refetch()}>
            Повторить
          </Button>
        </div>
      )}
      {!isLoading &&
        !activeQuery.isError &&
        activeQuery.data?.pages.every((page) => page.data.length === 0) && (
          <p className="py-10 text-center text-muted">
            Ничего не найдено. Попробуйте другое название.
          </p>
        )}
      {hasNextPage && (
        <div className="flex justify-center py-6">
          <Button
            variant="secondary"
            isPending={isFetchingNextPage}
            onPress={() => void fetchNextPage()}
          >
            {isFetchingNextPage ? 'Загружаем…' : 'Показать ещё'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
