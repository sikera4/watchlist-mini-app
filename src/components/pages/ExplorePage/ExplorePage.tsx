'use client';

import { useMoviesListQuery, useMoviesSearchQuery } from '@/api';
import { useIsScrolledToBottom } from '@/hooks/isScrolledToBottom';
import {
  AbsoluteCenter,
  Box,
  Button,
  Code,
  Container,
  Grid,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import MovieCard from './MovieCard';
import { SearchFormValues } from './types';
import { useTelegramApp } from '@/components/providers/TelegramAppProvider';

const ExplorePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const tgWebApp = useTelegramApp();

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
    <Container p={4} position="relative" minHeight="100vh">
      <Code>{JSON.stringify(tgWebApp)}</Code>
      <Box background="bg">
        <form onSubmit={rhfHandleSubmit(handleSubmit)}>
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
                <Box key={movie.id}>
                  <MovieCard movie={movie} />
                </Box>
              ))}
            </React.Fragment>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ExplorePage;
