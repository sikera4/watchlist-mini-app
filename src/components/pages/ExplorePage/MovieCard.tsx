import { Movie, useGenresListQuery } from '@/api';
import { getImageSrcByPath } from '@/utilities/getImageSrcByPath';
import { useState } from 'react';
import ImageWithFallback from './ImageWithFallback';
import { formatYear } from '@/utilities/formatYear';
import { Button } from '@heroui/react';

type Props = {
  movie: Movie;
};

const MovieCard = ({ movie }: Props) => {
  const { title, poster_path: posterPath, genre_ids: genreIds, release_date: releaseDate } = movie;

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
    <div className="relative" onClick={() => setIsTapped(!isTapped)}>
      <div className="rounded-md overflow-hidden relative bg-content1-foreground h-[270px]">
        <ImageWithFallback
          src={getImageSrcByPath(posterPath)}
          alt={`${title} poster`}
          fill={true}
          style={{
            objectFit: 'cover',
          }}
        />
      </div>
      <h4 className="text-lg font-bold mt-2">{title}</h4>
      <span className="text-sm font-light">
        {formatYear(new Date(releaseDate))}, {genresString}
      </span>
      <div
        className={`flex opacity-${isTapped ? 1 : 0} absolute top-0 left-0 right-0 bottom-0 bg-background/60 justify-center items-center transition-opacity duration-200`}
      >
        <Button variant="solid">Select</Button>
      </div>
    </div>
  );
};

export default MovieCard;
