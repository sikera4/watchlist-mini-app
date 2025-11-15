'use client';

import { useMoviesListQuery, useMoviesSearchQuery } from '@/api';
import { useIsScrolledToBottom } from '@/hooks/isScrolledToBottom';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import MovieCard from './MovieCard';
import { SearchFormValues } from './types';
import { Button, Input, Spinner } from '@heroui/react';

const ExplorePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const moviesListQuery = useMoviesListQuery();
  const moviesSearchQuery = useMoviesSearchQuery(searchTerm);

  const { register, handleSubmit: rhfHandleSubmit } = useForm<SearchFormValues>();

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

    if (searchTerm && moviesSearchQuery.hasNextPage) {
      moviesSearchQuery.fetchNextPage();
    }
  }, [isScrolledToBottom]);

  const isLoading = moviesListQuery.isLoading || moviesSearchQuery.isLoading;

  return (
    <div className="p-4 relative min-h-screen">
      <div className="bg-background">
        <form onSubmit={rhfHandleSubmit(handleSubmit)}>
          <div className="grid grid-cols-6 gap-4">
            <Input
              size="sm"
              className="col-span-4"
              label={t('searchPlaceholder')}
              autoComplete="off"
              radius="lg"
              {...register('searchInput')}
            />
            <Button className="col-span-2" variant="solid" type="submit" size="lg">
              {t('searchButtonCaption')}
            </Button>
          </div>
        </form>
      </div>
      {isLoading ? (
        <div className="absolute ">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {(searchTerm ? moviesSearchQuery.data : moviesListQuery.data)?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.map((movie) => (
                <div key={movie.id}>
                  <MovieCard movie={movie} />
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
