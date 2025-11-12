'use client';

import { useMoviesListQuery, useMoviesSearchQuery } from '@/api';
import { useIsScrolledToBottom } from '@/hooks/isScrolledToBottom';
import { AbsoluteCenter, Box, Button, Container, Grid, Input, Spinner } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import MovieCard from './MovieCard';
import { SearchFormValues } from './types';

const ListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const moviesListQuery = useMoviesListQuery();
  const moviesSearchQuery = useMoviesSearchQuery(searchTerm);

  const { register, handleSubmit } = useForm<SearchFormValues>();

  const isScrolledToBottom = useIsScrolledToBottom(undefined, {
    offset: 200,
  });

  const t = useTranslations('ListPage');

  const onSubmit = (data: SearchFormValues) => {
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
    <Container p={4} position="relative" minHeight="100vh">
      <Box background="bg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns="3fr 1fr" gap={4}>
            <Input
              placeholder={t('searchPlaceholder')}
              autoComplete="off"
              {...register('searchInput')}
            />
            <Button variant="surface" type="submit">
              {t('searchButtonCaption')}
            </Button>
          </Grid>
        </form>
      </Box>
      {isLoading ? (
        <AbsoluteCenter>
          <Spinner size="xl" />
        </AbsoluteCenter>
      ) : (
        <Grid templateColumns="1fr 1fr" gap={4} mt={4}>
          {(searchTerm ? moviesSearchQuery.data : moviesListQuery.data)?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </React.Fragment>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ListPage;
