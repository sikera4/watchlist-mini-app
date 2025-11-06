"use client";

import { useMoviesListQuery, useMoviesSearchQuery } from "@/api";
import { useIsScrolledToBottom } from "@/hooks/isScrolledToBottom";
import {
  AbsoluteCenter,
  Button,
  Container,
  Flex,
  Grid,
  Input,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import MovieCard from "./blocks/MovieCard";
import { useForm } from "react-hook-form";
import { SearchFormValues } from "./types";
import { useTranslations } from "next-intl";

const ListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const moviesListQuery = useMoviesListQuery();
  const moviesSearchQuery = useMoviesSearchQuery(searchTerm);

  const { register, handleSubmit } = useForm<SearchFormValues>();

  const isScrolledToBottom = useIsScrolledToBottom(undefined, {
    offset: 200,
  });

  const t = useTranslations("ListPage");

  const onSubmit = (data: SearchFormValues) => {
    setSearchTerm(data.searchInput);
  };

  useEffect(() => {
    if (isScrolledToBottom && moviesListQuery.hasNextPage) {
      moviesListQuery.fetchNextPage();
    }
  }, [isScrolledToBottom]);

  const isFetching = moviesListQuery.isFetching || moviesSearchQuery.isFetching;

  return (
    <Container p={4} position="relative" minHeight="100vh">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid templateColumns="3fr 1fr" gap={4}>
          <Input
            placeholder={t("searchPlaceholder")}
            autoComplete="off"
            {...register("searchInput")}
          />
          <Button variant="surface" type="submit">
            {t("searchButtonCaption")}
          </Button>
        </Grid>
      </form>
      {isFetching ? (
        <AbsoluteCenter>
          <Spinner size="xl" />
        </AbsoluteCenter>
      ) : (
        <Grid mt={4} templateColumns="1fr 1fr" gap={4}>
          {(searchTerm
            ? moviesSearchQuery.data
            : moviesListQuery.data
          )?.pages.map((page, i) => (
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
