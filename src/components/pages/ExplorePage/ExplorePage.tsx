'use client';

import { Genre, useMoviesListQuery, useSearchQuery } from '@/api';
import { useIsScrolledToBottom } from '@/hooks/isScrolledToBottom';
import { Button, Input, Spinner, TextField, Label } from '@heroui/react';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import {
  useBrowsingState,
  useRememberPageScroll,
} from '@/components/providers/BrowsingStateProvider';
import { useForm } from 'react-hook-form';
import Card from './Card';
import { SearchFormValues } from './types';
import { movieToCardData } from './utilities/movieToCardData';
import { formatGenres } from './utilities/formatGenres';
import { tvShowToCardData } from './utilities/tvShowToCardData';
import { useRegisterHapticFeedback } from '@/hooks/useRegisterHapticFeedback';

type Props = {
  moviesGenresList: Genre[];
  tvShowsGenresList: Genre[];
};

const ExplorePage = ({ moviesGenresList, tvShowsGenresList }: Props) => {
  const { searchTerm, setSearchTerm, searchDraft, setSearchDraft } = useBrowsingState();
  useRememberPageScroll('/explore');

  const moviesListQuery = useMoviesListQuery();
  const searchQuery = useSearchQuery(searchTerm);

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    reset,
  } = useForm<SearchFormValues>({ defaultValues: { searchInput: searchDraft } });

  const registerHapticFeedback = useRegisterHapticFeedback();

  const isScrolledToBottom = useIsScrolledToBottom(undefined, {
    offset: 200,
  });

  const t = useTranslations('ListPage');

  const handleSubmit = (data: SearchFormValues) => {
    setSearchTerm(data.searchInput);
    registerHapticFeedback('soft');
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
    setSearchDraft('');
    reset({ searchInput: '' });
  };

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
        <form onSubmit={rhfHandleSubmit(handleSubmit)}>
          <div className="grid grid-cols-6 gap-4">
            <TextField className="col-span-4" isDisabled={Boolean(searchTerm)}>
              <Label className="sr-only">{t('searchPlaceholder')}</Label>
              <Input
                placeholder={t('searchPlaceholder')}
                autoComplete="off"
                {...register('searchInput', {
                  onChange: (event) => setSearchDraft(event.target.value),
                })}
              />
            </TextField>
            {Boolean(searchTerm) ? (
              <Button
                className="col-span-2"
                variant="secondary"
                onPress={handleResetSearchFormButtonClick}
                size="lg"
              >
                {t('clearSearchButtonCaption')}
              </Button>
            ) : (
              <Button className="col-span-2" variant="primary" type="submit" size="lg">
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
          {searchTerm ? renderSearchedItems() : renderMoviesList()}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
