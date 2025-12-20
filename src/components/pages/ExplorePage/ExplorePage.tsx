'use client';

import {
  useMoviesGenresListQuery,
  useMoviesListQuery,
  useSearchQuery,
  useTvShowsGenresListQuery,
} from '@/api';
import { useIsScrolledToBottom } from '@/hooks/isScrolledToBottom';
import { Button, Input, Spinner } from '@heroui/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Card from './Card';
import { SearchFormValues } from './types';
import { movieToCardData } from './utilities/movieToCardData';
import { formatGenres } from './utilities/formatGenres';
import { tvShowToCardData } from './utilities/tvShowToCardData';

const ExplorePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const moviesListQuery = useMoviesListQuery();
  const searchQuery = useSearchQuery(searchTerm);
  const moviesGenresQuery = useMoviesGenresListQuery();
  const tvShowsGenresQuery = useTvShowsGenresListQuery();

  const { register, handleSubmit: rhfHandleSubmit, reset } = useForm<SearchFormValues>();

  const isScrolledToBottom = useIsScrolledToBottom(undefined, {
    offset: 200,
  });

  const t = useTranslations('ListPage');

  const handleSubmit = (data: SearchFormValues) => {
    setSearchTerm(data.searchInput);
  };

  useEffect(() => {
    if (!isScrolledToBottom) {
      return;
    }

    if (!searchTerm && moviesListQuery.hasNextPage) {
      moviesListQuery.fetchNextPage();
    }

    if (searchTerm && searchQuery.hasNextPage) {
      searchQuery.fetchNextPage();
    }
  }, [isScrolledToBottom]);

  const isLoading = moviesListQuery.isLoading || searchQuery.isLoading;

  const handleResetSearchFormButtonClick = () => {
    setSearchTerm('');
    reset();
  };

  return (
    <div className="px-4 pb-4 relative min-h-screen">
      <div className="bg-background py-4 sticky top-0 z-10">
        <form onSubmit={rhfHandleSubmit(handleSubmit)}>
          <div className="grid grid-cols-6 gap-4">
            <Input
              size="sm"
              className="col-span-4"
              label={t('searchPlaceholder')}
              autoComplete="off"
              radius="lg"
              isDisabled={Boolean(searchTerm)}
              {...register('searchInput')}
            />
            {Boolean(searchTerm) ? (
              <Button
                className="col-span-2"
                variant="solid"
                onPress={handleResetSearchFormButtonClick}
                size="lg"
              >
                {t('clearSearchButtonCaption')}
              </Button>
            ) : (
              <Button className="col-span-2" variant="solid" type="submit" size="lg">
                {t('searchButtonCaption')}
              </Button>
            )}
          </div>
        </form>
      </div>
      {isLoading ? (
        <div className="absolute top-[calc(50%-20px)] left-[calc(50%-20px)]">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {searchTerm
            ? searchQuery.data?.pages.map((page, i) => (
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
                      genres:
                        mediaItem.media_type === 'movie'
                          ? (moviesGenresQuery.data ?? [])
                          : (tvShowsGenresQuery.data ?? []),
                      genresIds: mediaItem.genre_ids,
                    });

                    return (
                      <div key={mediaItem.id}>
                        <Card {...cardData} genres={genres} />
                      </div>
                    );
                  })}
                </React.Fragment>
              ))
            : moviesListQuery.data?.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.data.map((movie) => (
                    <div key={movie.id}>
                      <Card
                        {...movieToCardData(movie)}
                        genres={formatGenres({
                          genres: moviesGenresQuery.data ?? [],
                          genresIds: movie.genre_ids,
                        })}
                      />
                    </div>
                  ))}
                </React.Fragment>
              ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
