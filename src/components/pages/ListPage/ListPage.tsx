"use client";

import { useMoviesListQuery } from "@/api";
import { useIsScrolledToBottom } from "@/hooks/isScrolledToBottom";
import { Button, Container, Grid, Input } from "@chakra-ui/react";
import React, { useEffect } from "react";
import MovieCard from "./blocks/MovieCard";

const ListPage = () => {
  const moviesListQuery = useMoviesListQuery();

  const isScrolledToBottom = useIsScrolledToBottom(undefined, {
    offset: 200,
  });

  useEffect(() => {
    if (isScrolledToBottom && moviesListQuery.hasNextPage) {
      moviesListQuery.fetchNextPage();
    }
  }, [isScrolledToBottom]);

  return (
    <Container p={4}>
      <Grid templateColumns="3fr 1fr" gap={4}>
        <Input placeholder="what're we looking for..." />
        <Button variant="surface">Search</Button>
      </Grid>
      <Grid mt={4} templateColumns="1fr 1fr" gap={4}>
        {moviesListQuery.data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.data.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </React.Fragment>
        ))}
      </Grid>
    </Container>
  );
};

export default ListPage;
