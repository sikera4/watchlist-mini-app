import { Movie, useGenresListQuery } from '@/api';
import { formatYear } from '@/utilities/formatYear';
import { getImageSrcByPath } from '@/utilities/getImageSrcByPath';
import { useState } from 'react';
import CardOverlay from './CardOverlay';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

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

  const formattedReleaseDate = releaseDate && formatYear(new Date(releaseDate));

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
        {Boolean(formattedReleaseDate) && `${formattedReleaseDate}, `}
        {genresString}
      </span>
      <CardOverlay isVisible={isTapped} movie={movie} />
    </div>
  );
};

export default MovieCard;
