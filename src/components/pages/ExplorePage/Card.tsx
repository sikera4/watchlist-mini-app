import { PLACEHOLDER_URL } from '@/constants';
import { getImageSrcByPath } from '@/utilities/getImageSrcByPath';
import { Image } from '@heroui/react';
import NextImage from 'next/image';
import { useState } from 'react';
import CardOverlay from './CardOverlay';
import { CardData } from './types';

type Props = CardData;

const Card = ({ title, posterPath, genres, releaseDate, id }: Props) => {
  const [isTapped, setIsTapped] = useState(false);

  return (
    <div className="relative" onClick={() => setIsTapped(!isTapped)}>
      <div className="rounded-md overflow-hidden">
        <Image
          alt={`${title} poster`}
          className="static rounded-md object-cover"
          height={270}
          src={getImageSrcByPath(posterPath)}
          fallbackSrc={PLACEHOLDER_URL}
          as={NextImage}
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
