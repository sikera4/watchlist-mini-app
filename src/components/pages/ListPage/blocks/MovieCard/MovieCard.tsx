import { Movie, useGenresListQuery } from '@/api';
import { getImageSrcByPath } from '@/utilities/getImageSrcByPath';
import { Box, Text } from '@chakra-ui/react';
import Image from 'next/image';

type Props = {
  movie: Movie;
};

const MovieCard = ({ movie }: Props) => {
  const { title, poster_path: posterPath, genre_ids: genreIds } = movie;

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
    <Box>
      <Box rounded="md" overflow="hidden">
        <Image
          src={getImageSrcByPath(posterPath)}
          alt={`${title} poster`}
          width={200}
          height={300}
        />
      </Box>
      <Text textStyle="lg" fontWeight="bold" mt={2}>
        {title}
      </Text>
      <Text textStyle="sm" fontWeight="light">
        {genresString}
      </Text>
    </Box>
  );
};

export default MovieCard;
