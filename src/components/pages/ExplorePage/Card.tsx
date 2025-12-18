import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { getImageSrcByPath } from '@/utilities/getImageSrcByPath';
import { useState } from 'react';
import CardOverlay from './CardOverlay';
import { CardData } from './types';

type Props = CardData;

const Card = ({ title, posterPath, genres, releaseDate, id }: Props) => {
  const [isTapped, setIsTapped] = useState(false);

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
      <h4 className="text-lg font-bold mt-2">{title ?? name}</h4>
      <span className="text-sm font-light">
        {Boolean(releaseDate) && releaseDate}
        {Boolean(releaseDate && genres) && ', '}
        {genres}
      </span>
      <CardOverlay
        isVisible={isTapped}
        mediaItem={{
          title,
          posterPath,
          genres,
          releaseDate,
          id,
        }}
      />
    </div>
  );
};

export default Card;
