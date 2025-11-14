import { Movie, useGenresListQuery } from '@/api';
import { getImageSrcByPath } from '@/utilities/getImageSrcByPath';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import ImageWithFallback from './ImageWithFallback';

type Props = {
  movie: Movie;
};

const MovieCard = ({ movie }: Props) => {
  const { title, poster_path: posterPath, genre_ids: genreIds } = movie;

  const [isTapped, setIsTapped] = useState(false);

  const genresListQuery = useGenresListQuery();

  const genresString = genresListQuery.data
    ? genreIds
        .map((id) => {
          const genre = genresListQuery.data.find((genre) => genre.id === id);

          return genre ? genre.name : null;
        })
        .join(', ')
    : '';

  return (
    <Box position="relative" onClick={() => setIsTapped(!isTapped)}>
      <Box rounded="md" overflow="hidden" position="relative" h="270px" bg="bg.emphasized">
        <ImageWithFallback
          src={getImageSrcByPath(posterPath)}
          alt={`${title} poster`}
          fill={true}
          style={{
            objectFit: 'cover',
          }}
        />
      </Box>
      <Text textStyle="lg" fontWeight="bold" mt={2}>
        {title}
      </Text>
      <Text textStyle="sm" fontWeight="light">
        {genresString}
      </Text>
      <Flex
        opacity={isTapped ? 1 : 0}
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        justifyContent="center"
        alignItems="center"
        transition="opacity 0.2s"
      >
        <Button variant="surface">Select</Button>
      </Flex>
    </Box>
  );
};

export default MovieCard;
